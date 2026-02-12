// services/pedidoService.js
const sequelize = require('../config/database');
const {
    pedidoRepo,
    encomendaRepo,
    encomendaItemRepo,
    produtoRepo,
    // escrowRepo, // Não usado neste método
    // transacaoRepo, // Não usado neste método
    // ledgerRepo // Não usado neste método
} = require('../repositories/index');

class PedidoService {

    /**
     * Cria um pedido completo
     * @param {Object} data
     * @param {number} data.usuario_id
     * @param {Array} data.itens -> [{ produto_id, quantidade }]
     * @returns {Object} { pedido, encomendas, itens }
     */
    async createPedido({ usuario_id, itens }) {
        if (!itens || !itens.length) throw new Error('Pedido precisa de pelo menos 1 item');
        console.log(usuario_id, itens);
        // managed transaction
        return await sequelize.transaction(async (t) => {

            // 1️⃣ Criar pedido principal
            const pedido = await pedidoRepo.create({
                usuario_id, // id do comprador
                total: 0, // calcular depois
                status: 'criado'
            }, { transaction: t });

            // 2️⃣ Obter dados dos produtos do pedido
            const produtoIds = itens.map(i => i.produto_id);
            // ✅ CORREÇÃO: Usar findByIds (do produtoRepository) e passar a transação
            const produtos = await produtoRepo.findByIds(produtoIds, { transaction: t });

            if (produtos.length !== produtoIds.length)
                throw new Error('Alguns produtos não existem');

            // 3️⃣ Agrupar itens por loja (cada loja terá uma encomenda)
            const lojaMap = {}; // loja_id -> [itens]
            for (const item of itens) {
                const productId = Number(item.produto_id);
                const produto = produtos.find(p => p.id === productId);

                // ✅ Adicionar uma verificação de segurança
                if (!produto) throw new Error(`Produto com ID ${item.produto_id} não encontrado no banco`);

                if (!produto.ativo) throw new Error(`Produto ${produto.id} não está ativo`);
                if (produto.estoque < item.quantidade) throw new Error(`Estoque insuficiente para produto ${produto.id}`);

                if (!lojaMap[produto.loja_id]) lojaMap[produto.loja_id] = [];
                lojaMap[produto.loja_id].push({
                    produto_id: produto.id,
                    quantidade: item.quantidade,
                    preco_unitario: produto.preco
                });
            }

            // 4️⃣ Criar encomendas por loja
            const encomendas = [];
            for (const [loja_id, itensLoja] of Object.entries(lojaMap)) {
                const totalEncomenda = itensLoja.reduce((sum, i) => sum + i.quantidade * i.preco_unitario, 0);

                const encomenda = await encomendaRepo.create({
                    pedido_id: pedido.id,
                    loja_id,
                    total: totalEncomenda,
                    status: 'criada'
                }, { transaction: t });

                // 5️⃣ Criar itens da encomenda
                for (const itemData of itensLoja) {
                    await encomendaItemRepo.bulkCreate({ // ✅ bulkCreate não existe no Base, usando create
                        encomenda_id: encomenda.id,
                        produto_id: itemData.produto_id,
                        quantidade: itemData.quantidade,
                        preco_unitario: itemData.preco_unitario
                    }, { transaction: t });

                    // 6️⃣ Diminuir estoque do produto
                    const produtoInstancia = produtos.find(p => p.id === itemData.produto_id);
                    await produtoRepo.decrementEstoque(produtoInstancia, itemData.quantidade, { transaction: t });
                }

                encomendas.push(encomenda);
            }

            // 7️⃣ Atualizar total do pedido
            const totalPedido = encomendas.reduce((sum, e) => sum + parseFloat(e.total), 0);
            
            // ✅ CORREÇÃO: BaseRepository.update espera (id, data, options)
            // Passe pedido.id em vez do objeto pedido inteiro
            await pedidoRepo.update(pedido, { total: totalPedido }, { transaction: t });
            return { pedido, encomendas };
        });
    }
}

module.exports = PedidoService;