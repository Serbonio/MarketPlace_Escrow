const sequelize = require('../config/database');
const {
    pedidoRepo,
    produtoRepo,
    encomendaRepo,
    encomendaItemRepo
} = require('../repositories/index');

async function PedidoService(usuario_id, items) { // 1. Adicione async aqui
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
            encomendas: encomendasSimples
        }; // Retorne o pedido criado
    });
}
module.exports = {
    PedidoService
};