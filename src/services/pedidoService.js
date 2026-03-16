const { where } = require('sequelize');
const sequelize = require('../config/database');
const {
    pedidoRepo,
    produtoRepo,
    encomendaRepo,
    encomendaItemRepo,
    escrowRepo,
    transacaoRepo,
    ledgerRepo, 
    lojaRepo
} = require('../repositories/index');

async function registrarPedidoCompleto(usuario_id, items, dadosEntrega, t) {
    // 1. Buscar produtos para garantir preços atuais
    const produtoIds = items.map(i => i.produto_id);
    const produtosDoBanco = await produtoRepo.findByIds(produtoIds, { transaction: t });

    // 2. Calcular Totais e Agrupar por Loja
    let totalGeral = 0;
    let totaisPorLoja = {};

    for (const item of items) {
        const produto = produtosDoBanco.find(p => String(p.id) === String(item.produto_id));
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

    // 3. Criar Pedido Principal (Snapshot com dados novos)
    const pedido = await pedidoRepo.create({
        usuario_id: usuario_id,
        total: totalGeral,
        status: 'criado',
        // --- NOVOS CAMPOS ---
        nome_completo: dadosEntrega.nome_completo,
        telefone_contacto: dadosEntrega.telefone_contacto,
        email:dadosEntrega.email,
        provincia: dadosEntrega.provincia,
        cidade: dadosEntrega.cidade,
        endereco_completo: dadosEntrega.endereco_completo,
        codigo_postal: dadosEntrega.codigo_postal,
        referencia_encontro: dadosEntrega.referencia_encontro,
    }, { transaction: t });

    const encomendasCriadas = [];

    // 4. Criar Encomendas e Itens
    for (const lojaId in totaisPorLoja) {
        const encomenda = await encomendaRepo.create({
            pedido_id: pedido.id,
            loja_id: lojaId,
            total: totaisPorLoja[lojaId].total,
            status: 'pendente'
        }, { transaction: t });

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
    let t;
    let resultadoRegistro;

    try {
        t = await sequelize.transaction();
        // PASSO 1: Registro no Banco
        resultadoRegistro = await registrarPedidoCompleto(usuario_id, items, dadosCheckout, t);
        await t.commit();
    } catch (error) {
        if (t && !t.finished) await t.rollback();
        console.error("Erro no registro do pedido:", error);
        throw error;
    }

    // Se chegou aqui, o pedido ID já existe no banco.
    try {
        const { pedido, encomendasCriadas } = resultadoRegistro;

        // PASSO 2: Simulação de Pagamento
        const pagamentoSucesso = await simularPagamento(dadosCheckout, pedido.total);

        if (pagamentoSucesso) {
            // PASSO 3: Confirmação Financeira (Nova transação interna)
            // IMPORTANTE: Passamos o ID e os objetos criados
            await confirmarPagamentoPedido(pedido.id, encomendasCriadas, usuario_id);
            
            return { sucesso: true, pedidoId: pedido.id, status: 'pago' };
        } else {
            return { sucesso: false, pedidoId: pedido.id, status: 'pendente_pagamento' };
        }
    } catch (error) {
        // Se falhar aqui, o pedido continua 'criado' no banco para o usuário tentar pagar depois
        console.error("Erro na fase de pagamento/confirmação:", error);
        return { 
            sucesso: false, 
            pedidoId: resultadoRegistro.pedido.id, 
            status: 'erro_processamento_pagamento',
            error: error.message 
        };
    }
}
async function confirmarPagamentoPedido(pedidoId, encomendas, usuario_id) {
    const t = await sequelize.transaction();
    try {
        // Atualiza status do pedido
        await pedidoRepo.update(pedidoId, { status: 'pago' }, {transaction: t });

        for (const encomenda of encomendas) {
            // Cria Transação Financeira
            const transacao = await transacaoRepo.create({
                encomenda_id: encomenda.id,
                tipo: 'pagamento',
                valor: encomenda.total,
                status: 'paga'
            }, { transaction: t });

            // Registro no Ledger (Débito Usuário / Crédito Sistema)
            // Registro no Ledger (Débito Usuário)
            await ledgerRepo.create({
                entidade_tipo: 'usuario',
                entidade_id: usuario_id,
                transacao_id: transacao.id,
                tipo: 'debito',
                valor: encomenda.total,
            }, { transaction: t });
            
            // Registro no Ledger (Crédito Sistema - O dinheiro fica no sistema)
            await ledgerRepo.create({
                entidade_tipo: 'sistema',
                entidade_id: null,
                transacao_id: transacao.id,
                tipo: 'credito',
                valor: encomenda.total,
            }, { transaction: t });
            
            // Ativa o Escrow (Dinheiro retido até a entrega)
            await escrowRepo.create({
                encomenda_id: encomenda.id,
                valor: encomenda.total,
                status: 'ativo'
            }, { transaction: t });
        }
        await t.commit();
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

// Funcao complementar
async function simularPagamento(dadosPagamento, total_pedido){
    return true;
}

module.exports = { 
    registrarPedidoCompleto,
    processarCheckout, 
    confirmarPagamentoPedido,
    liberarEscrow
};