const { where } = require('sequelize');
const sequelize = require('../config/database');
const {
    pedidoRepo,
    produtoRepo,
    encomendaRepo,
    encomendaItemRepo,
    escrowRepo,
    transacaoRepo,
    ledgerRepo
} = require('../repositories/index');

async function criarPedidoPagar(usuario_id, items, dadosPagamento) { // 1. Adicione async aqui
    return await sequelize.transaction(async (t) => {
        
        // 1. Buscar produtos
        const produtoIds = items.map(i => i.produto_id);
        const produtosDoBanco = await produtoRepo.findByIds(produtoIds, { transaction: t });

        // 2. Calcular Totais e Agrupar
        let totalGeral = 0;
        let totaisPorLoja = {}; // { lojaId: { total: 0, itens: [] } }

        for (const item of items) {
            const produto = produtosDoBanco.find(p => p.id === item.produto_id);
            const subtotal = produto.preco * item.quantidade;
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

        // 3. Criar Pedido Principal
        const pedido = await pedidoRepo.create({
            usuario_id: usuario_id,
            total: totalGeral,
            status: 'criado'
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

            // Preparar itens para bulkCreate
            const itensParaSalvar = totaisPorLoja[lojaId].itens.map(i => ({
                ...i,
                encomenda_id: encomenda.id
            }));
            encomendasCriadas.push(encomenda);
            
            await encomendaItemRepo.bulkCreate(itensParaSalvar, { transaction: t });

        }

        const pagamentoSucesso = simularPagamento(dadosPagamento, pedido.total); // Simule o pagamento aqui

        if (!pagamentoSucesso) {
            throw new Error('Pagamento falhou');
        }


        await pedidoRepo.update({ status: 'pago' }, {where: {id:pedido.id}}, { transaction: t });

        for(const encomenda of encomendasCriadas){
            const transacao = await transacaoRepo.create({
                encomenda_id: encomenda.id,
                tipo: 'pagamento',
                valor: encomenda.total,
                status: 'paga'
            }, { transaction: t });

            const ledgerDebito = await ledgerRepo.create({
                entidade_tipo: 'usuario',
                entidade_id: usuario_id,
                transacao_id: transacao.id,
                tipo: 'debito',
                valor: encomenda.total,
                // saldo_resultante: null // Calcular se necessário
            }, { transaction: t });

            const ledgerCredito = await ledgerRepo.create({
                entidade_tipo: 'sistema',
                entidade_id: null,
                transacao_id: transacao.id,
                tipo: 'credito',
                valor: encomenda.total,
                // saldo_resultante: null // Calcular se necessário
            }, { transaction: t });
            
            const escrow = await escrowRepo.create({
                encomenda_id: encomenda.id,
                valor: encomenda.total,
                status: 'ativo'
            }, { transaction: t });


        }

        //Fazer a liberacao do escrow
        // Após entrega ser confirmada pelo comprador


        // *. Retornar resultado
        const encomendasSimples = encomendasCriadas.map(e=>{
            return {
                id: e.id,
                loja_id: e.loja_id,
                total: e.total,
            }
        });
        
        return {
            pedido_id: pedido.id,
            totalGeral:pedido.total,
            transacao: {
                tipo: 'pagamento',
                valor: pedido.total,
                status: 'paga'
            },
            encomendas: encomendasSimples
        }; // Retorne o pedido criado
    });
}

async function liberarEscrow(encomenda_id, confirmado_por){
    return await sequelize.transaction(async (t) => {

        // 1. Buscar encomenda (com lock)
        const encomenda = await encomendaRepo.findById(encomenda_id, {
            lock: t.LOCK.UPDATE,
            transaction: t
        });

        if (!encomenda) throw new Error('Encomenda não encontrada');
        if (encomenda.status !== 'paga') throw new Error('Encomenda não está pronta para liberação');

        // 2. Validar quem confirma
        const pedido = await pedidoRepo.findById(encomenda.pedido_id, { transaction: t });
        if (pedido.usuario_id !== confirmado_por) {
            throw new Error('Usuário não autorizado a liberar este escrow');
        }   

        // 3. Buscar escrow (lock)
        const escrow = await escrowRepo.findByEncomendaId(encomenda_id, {
            lock: t.LOCK.UPDATE,
            transaction: t
        });
        if (!escrow) throw new Error('Escrow inexistente');
        if (escrow.status !== 'ativo') throw new Error('Escrow não pode ser liberado');

        // 4. Criar transação de liberação
        const transacaoLiberacao = await transacaoRepo.create({
            encomenda_id: encomenda.id,
            tipo: 'liberacao',
            valor: escrow.valor,
            status: 'confirmada'
        }, { transaction: t });

        // 5. Ledger — débito do sistema
        const ledgerDebito = await ledgerRepo.create({
            entidade_tipo: 'sistema',
            entidade_id: null,
            transacao_id: transacaoLiberacao.id,
            tipo: 'debito',
            valor: escrow.valor,
            // saldo_resultante: null // Calcular se necessário
        }, { transaction: t });
        
        // 6. Ledger — crédito da loja
        const ledgerCredito = await ledgerRepo.create({
            entidade_tipo: 'loja',
            entidade_id: encomenda.loja_id,
            transacao_id: transacaoLiberacao.id,
            tipo: 'credito',
            valor: escrow.valor,
            // saldo_resultante: null // Calcular se necessário
        }, { transaction: t });

        // 7. Atualizar status do escrow e encomenda
        await escrowRepo.update({ status: 'liberado' }, { where: { id: escrow.id }, transaction: t });
        await encomendaRepo.update({ status: 'concluida' }, { where: { id: encomenda.id }, transaction: t });

        // 8. Verificar se todas as encomendas do pedido estão concluídas para atualizar status do pedido
        const encomendasPendentes = await encomendaRepo.count({
            where: {
                pedido_id: pedido.id,
                status: { [sequelize.Op.not]: 'concluida' }
            },transaction: t});

            if (encomendasPendentes === 0) {
                await pedidoRepo.update({ status: 'concluido' }, { where: { id: pedido.id }, transaction: t });
            } else {
                await pedidoRepo.update({ status: 'parcialmente_concluido' }, { where: { id: pedido.id }, transaction: t });
            }
            
        // 🔐 COMMIT (automático pela transaction managed)  
        });
}
module.exports = {
    PedidoService
};