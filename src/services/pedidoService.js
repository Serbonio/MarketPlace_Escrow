const sequelize = require('../config/database');
const { validarStockParaPedido, processarStockEncomenda } = require('./stockService');

const {
    pedidoRepo, produtoRepo, encomendaRepo,
    encomendaItemRepo, escrowRepo, transacaoRepo,
    ledgerRepo, lojaRepo
} = require('../repositories/index');

const { initiatePayment } = require('./pagamentoService');
const { gerarTokenEQRCode, gerarDeliveryToken } = require('./qrCodeService');

async function registrarPedidoCompleto(usuario_id, items, dadosEntrega, t) {
    const produtoIds = items.map(i => i.produto_id);
    const produtosDoBanco = await produtoRepo.findByIds(produtoIds, { transaction: t });

    let totalGeral = 0;
    let totaisPorLoja = {};

    for (const item of items) {
        const produto = produtosDoBanco.find(p => String(p.id) === String(item.produto_id));
        if (!produto) throw new Error(`Produto ${item.produto_id} não encontrado`);

        const subtotal = Number(produto.preco) * Number(item.quantidade);
        totalGeral += subtotal;

        if (!totaisPorLoja[produto.loja_id]) {
            totaisPorLoja[produto.loja_id] = { total: 0, itens: [] };
        }
        totaisPorLoja[produto.loja_id].total += subtotal;
        totaisPorLoja[produto.loja_id].itens.push({
            produto_id: produto.id,
            quantidade: item.quantidade,
            preco_unitario: produto.preco
        });
    }

    const pedido = await pedidoRepo.create({
        usuario_id,
        total: totalGeral,
        status: 'criado',
        nome_completo: dadosEntrega.nome_completo,
        telefone_contacto: dadosEntrega.telefone_contacto,
        email: dadosEntrega.email,
        provincia: dadosEntrega.provincia,
        cidade: dadosEntrega.cidade,
        endereco_completo: dadosEntrega.endereco_completo,
        codigo_postal: dadosEntrega.codigo_postal,
        referencia_encontro: dadosEntrega.referencia_encontro,
    }, { transaction: t });

    const encomendasCriadas = [];

    for (const lojaId in totaisPorLoja) {
        const encomenda = await encomendaRepo.create({
            pedido_id: pedido.id,
            loja_id: lojaId,
            total: totaisPorLoja[lojaId].total,
            status: 'pendente',
            metodo_confirmacao: 'token',
        }, { transaction: t });

        const token = gerarDeliveryToken(
            encomenda.id,
            lojaId,
            usuario_id
        );
        console.log({token_gerado:token})

        await encomendaRepo.update(encomenda.id, {
        delivery_token: token,
    }, { transaction: t });
    
        const encomendaCompleta = await encomendaRepo.findById(
        encomenda.id,
        { transaction: t }
    );
        const itensParaSalvar = totaisPorLoja[lojaId].itens.map(i => ({
            ...i,
            encomenda_id: encomenda.id
        }));

        await encomendaItemRepo.bulkCreate(itensParaSalvar, { transaction: t });
        encomendasCriadas.push(encomenda);
    }

    return { pedido, encomendasCriadas };
}

async function processarCheckout(usuario_id, items, dadosCheckout) {

    // ✅ PASSO 0 — Validar stock ANTES de criar o pedido
    const validacao = await validarStockParaPedido(items);
    console.log(validacao)
    if (!validacao.valido) {
        // Rejeitar imediatamente — não cria pedido
        throw new Error(JSON.stringify({
            tipo: 'STOCK_INSUFICIENTE',
            mensagem: 'Um ou mais produtos não têm stock suficiente',
            detalhes: validacao.erros
        }));
    }

    let t;
    let resultadoRegistro;

    // PASSO 1 — Criar pedido e encomendas na base de dados
    try {
        t = await sequelize.transaction();
        resultadoRegistro = await registrarPedidoCompleto(usuario_id, items, dadosCheckout, t);
        await t.commit();
    } catch (error) {
        if (t && !t.finished) await t.rollback();
        console.error('Erro no registro do pedido:', error);
        throw error;
    }

    const { pedido, encomendasCriadas } = resultadoRegistro;

    // PASSO 2 — Iniciar pagamento na AppyPay
    try {
        const metodoPagamento = dadosCheckout.metodo_pagamento?.toUpperCase();

        // ✅ Para pagamento na entrega — confirmar imediatamente
        if (metodoPagamento === 'pagamento_entrega') {
            await confirmarPagamentoPedido(pedido.id, encomendasCriadas, usuario_id);
            return {
                sucesso: true,
                pedidoId: pedido.id,
                status: 'confirmado',
                metodoPagamento: 'pagamento_entrega'
            };
        }

        // ✅ Para REF e GPO — iniciar pagamento assíncrono
        if (metodoPagamento === 'REF' || metodoPagamento === 'GPO') {
            const pagamento = await initiatePayment({
                method: metodoPagamento,
                amount: pedido.total,
                orderId: pedido.id,
                phone: dadosCheckout.telefone_contacto,
                email: dadosCheckout.email
            });

            // Resposta imediata — confirmação vem pelo Webhook
            const resposta = {
                sucesso: true,
                pedidoId: pedido.id,
                pagamentoId: pagamento.id,
                status: 'pendente_pagamento',
                metodoPagamento
            };

            // Para REF — incluir dados da referência para mostrar ao cliente
            if (metodoPagamento === 'REF') {
                resposta.referencia = pagamento.referencia_numero;
                resposta.entidade = pagamento.referencia_entidade || '00348';
                resposta.validade = pagamento.referencia_validade;
                resposta.instrucoes = `Pague na referência ${pagamento.referencia_numero}, Entidade ${pagamento.referencia_entidade || '00348'}`;
            }

            // Para GPO — cliente recebe notificação no telemóvel
            if (metodoPagamento === 'GPO') {
                resposta.instrucoes = 'Verifique o seu telemóvel e aprove o pagamento no Multicaixa Express';
            }

            return resposta;
        }

        throw new Error(`Método de pagamento inválido: ${metodoPagamento}`);

    } catch (error) {
        console.error('Erro na fase de pagamento:', error);
        return {
            sucesso: false,
            pedidoId: pedido.id,
            status: 'erro_pagamento',
            error: error.message
        };
    }
}

async function confirmarPagamentoPedido(pedidoId, encomendas, usuario_id) {
    console.log(pedidoId, encomendas, usuario_id)
    const t = await sequelize.transaction();

        try {
        // Para cada encomenda, tentar decrementar o stock
        const resultadosStock = [];

        for (const encomenda of encomendas) {
            // Buscar os itens da encomenda
            const itens = await encomendaItemRepo.findByEncomenda(encomenda.id);

            // Tentar decrementar — com lock para evitar race conditions
            const resultadoStock = await processarStockEncomenda(itens, t);
            resultadosStock.push({
                encomendaId: encomenda.id,
                ...resultadoStock
            });
        }

        // Verificar se alguma encomenda falhou por falta de stock
        const encomendasComFalha = resultadosStock.filter(r => !r.sucesso);

        if (encomendasComFalha.length > 0) {
            // Rollback — não confirmar pagamento se stock falhou
            await t.rollback();

            // Marcar pedido para estorno
            await pedidoRepo.update(pedidoId, {
                status: 'estorno_pendente',
            });

            // Registar detalhes do problema
            console.error('Stock esgotado após pagamento:', encomendasComFalha);

            // Disparar notificação ao cliente (implementar conforme o teu sistema)
            await notificarClienteStockEsgotado(pedidoId, encomendasComFalha);

            return {
                sucesso: false,
                tipo: 'STOCK_ESGOTADO_APOS_PAGAMENTO',
                mensagem: 'Stock esgotado durante o processamento. Será feito um estorno.',
                detalhes: encomendasComFalha
            };
        }        
        await pedidoRepo.update(pedidoId, {
            status: 'pago',
            payment_status: 'confirmado'
        }, { transaction: t });

        for (const encomenda of encomendas) {
            // Transação financeira
            const transacao = await transacaoRepo.create({
                encomenda_id: null,
                pedido_id: pedidoId,
                levantamento_id: null,
                tipo_evento: 'pagamento_pedido',
                status: 'paga',
                valor: encomenda.total
            }, { transaction: t });

            // Ledger — Débito do utilizador
            await ledgerRepo.create({
                entidade_tipo: 'usuario',
                entidade_id: usuario_id,
                transacao_id: transacao.id,
                tipo_movimento: 'debito',
                valor: encomenda.total,
            }, { transaction: t });

            // Ledger — Crédito do sistema (escrow)
            await ledgerRepo.create({
                entidade_tipo: 'sistema',
                entidade_id: null,
                transacao_id: transacao.id,
                tipo_movimento: 'credito',
                valor: encomenda.total,
            }, { transaction: t });

            // Activar Escrow
            await escrowRepo.create({
                encomenda_id: encomenda.id,
                valor: encomenda.total,
                status: 'ativo'
            }, { transaction: t });
        }
        await t.commit();
        return{sucess:true}
    } catch (error) {
        await t.rollback();
        throw error;
    }
}


    async function liberarEscrow(encomenda_id, confirmado_por) {
        console.log(encomenda_id, confirmado_por)
        // Usamos o padrão gerenciado da transaction (t)
        return await sequelize.transaction(async (t) => {
    
            // 1. Buscar encomenda com Lock para evitar race conditions
            const encomenda = await encomendaRepo.findById(encomenda_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });
    
            if (!encomenda) throw new Error('Encomenda não encontrada');
            // Ajustado para bater com o status 'pago' que definimos no checkout
            // if (encomenda.status !== 'paga') throw new Error('Encomenda não está pronta para liberação');
    
            // 2. Validar quem confirma (Segurança)
            const pedido = await pedidoRepo.findById(encomenda.pedido_id, { transaction: t });
            if (pedido.usuario_id !== confirmado_por) {
                throw new Error('Usuário não autorizado a liberar este escrow');
            }
    
            // 3. Buscar escrow (findByEncomendaId deve retornar a instância)
            const escrow = await escrowRepo.findByEncomendaId(encomenda_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });
            
            if (!escrow) throw new Error('Escrow inexistente');
            // Ajustado para bater com o status 'retido' que definimos antes
            if (escrow.status === 'retido') throw new Error('Escrow não pode ser liberado');
    
            // 4. Lógica de Comissão (Exemplo: 10% para o Marketplace)
            const valorTotal = parseFloat(escrow.valor);
            // const taxaPlataforma = valorTotal * 0.10; 
            // const valorVendedor = valorTotal - taxaPlataforma;
            const transacao = await transacaoRepo.create({
                    encomenda_id: encomenda.id,
                    tipo: 'pagamento',
                    valor: encomenda.total,
                    status: 'paga'
                }, { transaction: t });
    
                // Pegar dados da loja
                const loja = await lojaRepo.findById(encomenda.loja_id);
                const vendedor = await lojaRepo.findByUsuarioId(loja.usuario_id)
                console.log(loja)            
            // 5. Ledger — Crédito da Loja (Vendedor)
            await ledgerRepo.create({
                transacao_id:transacao.id,
                entidade_id:vendedor,
                entidade_tipo:"loja",
                tipo: 'credito',
                valor: valorTotal,
                status: 'concluido',
                // descricao: `Liberação de saldo: Encomenda #${encomenda.id}`
            }, { transaction: t });
    
            // 6. Ledger — Comissão do Sistema
            await ledgerRepo.create({
                transacao_id:transacao.id,
                entidade_tipo:"sistema",
                entidade_id:null,
                usuario_id: 1, // ID da sua conta Admin
                tipo: 'debito',
                valor: valorTotal,
                status: 'concluido',
                // descricao: `Comissão Marketplace: Encomenda #${encomenda.id}`
            }, { transaction: t });
    
            // 7. Atualizar status (Usando o novo padrão de Repository que criamos)
            await escrowRepo.update(escrow.id, { status: 'liberado' }, { transaction: t });
            await encomendaRepo.update(encomenda.id, { status: 'concluida' }, { transaction: t });
    
            // 8. Verificar se o pedido pai foi totalmente concluído
            const { Op } = require('sequelize');
            const encomendasPendentes = await encomendaRepo.count({
                where: {
                    pedido_id: pedido.id,
                    status: { [Op.not]: 'entregue' }
                },
                transaction: t
            });
    
            if (encomendasPendentes === 0) {
                await pedidoRepo.update(pedido.id, { status: 'concluido' }, { transaction: t });
            } else {
                await pedidoRepo.update(pedido.id, { status: 'parcialmente_concluido' }, { transaction: t });
            }
    
            return { sucesso: true, mensagem: "Saldo liberado com sucesso!" };
        });
    }
    
    async function descontarStockProduto(produto_id, quantidade){
        const produto = await produtoRepo.findById(produto_id)
        console.log(`Produto que será descontado por que foi pago${produto.nome}`)
    
        return await produtoRepo.decrementEstoque(produto, quantidade)
    }
    async function validarQuantidadeProduto(produto, quantidade){
        if(produto.estoque<quantidade){
            throw new Error('Estoque insufiiciente')
        }
    }

    async function notificarClienteStockEsgotado(pedidoId, encomendasComFalha) {
    const pedido = await pedidoRepo.findById(pedidoId);
    const produtosEsgotados = encomendasComFalha
        .flatMap(e => e.falhas)
        .map(f => f.nome)
        .join(', ');

    console.log(`
        Notificar utilizador ${pedido.email}:
        "Lamentamos, o stock de [${produtosEsgotados}] esgotou 
        enquanto o pagamento era processado. 
        Será efectuado um estorno em 3-5 dias úteis."
    `);
}

module.exports = {
    registrarPedidoCompleto,
    processarCheckout,
    confirmarPagamentoPedido,
    liberarEscrow
};
