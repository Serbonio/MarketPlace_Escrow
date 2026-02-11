// services/pedidoService.js
const sequelize = require('../config/database')
// const { Pedido, Pagamento, Escrow, Produto, Usuario} = require('../models')
const repos = require('../repositories');


class PedidoService {
  constructor({ 
    pedidoRepo, 
    encomendaRepo, 
    encomendaItemRepo, 
    produtoRepo, 
    escrowRepo, 
    transacaoRepo, 
    ledgerRepo,
    sequelize 
  }) {
    this.pedidoRepo = pedidoRepo;
    this.encomendaRepo = encomendaRepo;
    this.encomendaItemRepo = encomendaItemRepo;
    this.produtoRepo = produtoRepo;
    this.escrowRepo = escrowRepo;
    this.transacaoRepo = transacaoRepo;
    this.ledgerRepo = ledgerRepo;
    this.sequelize = sequelize;
  }

  /**
   * Cria um pedido completo
   * @param {Object} data
   * @param {number} data.usuario_id
   * @param {Array} data.itens -> [{ produto_id, quantidade }]
   * @returns {Object} { pedido, encomendas, itens }
   */
  async createPedido({ usuario_id, itens }) {
    if (!itens || !itens.length) throw new Error('Pedido precisa de pelo menos 1 item');

    return this.sequelize.transaction(async (t) => {

      // 1️⃣ Criar pedido principal
      const pedido = await this.pedidoRepo.create({
        usuario_id,
        total: 0, // vamos calcular depois
        status: 'criado'
      }, { transaction: t });

      // 2️⃣ Obter dados dos produtos do pedido
      const produtoIds = itens.map(i => i.produto_id);
      const produtos = await this.produtoRepo.findByIds(produtoIds, { transaction: t });

      if (produtos.length !== produtoIds.length) 
        throw new Error('Alguns produtos não existem');

      // 3️⃣ Agrupar itens por loja (cada loja terá uma encomenda)
      const lojaMap = {}; // loja_id -> [itens]
      for (const item of itens) {
        const produto = produtos.find(p => p.id === item.produto_id);
        if (!produto.ativo) throw new Error(`Produto ${produto.id} não está ativo`);

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

        const encomenda = await this.encomendaRepo.create({
          pedido_id: pedido.id,
          loja_id,
          total: totalEncomenda,
          status: 'criada'
        }, { transaction: t });

        // 5️⃣ Criar itens da encomenda
        for (const itemData of itensLoja) {
          await this.encomendaItemRepo.bulkCreate([{
            encomenda_id: encomenda.id,
            produto_id: itemData.produto_id,
            quantidade: itemData.quantidade,
            preco_unitario: itemData.preco_unitario
          }], { transaction: t });

          // 6️⃣ Diminuir estoque do produto
          const produto = produtos.find(p => p.id === itemData.produto_id);
          await this.produtoRepo.decrementEstoque(produto, itemData.quantidade, { transaction: t });
        }

        encomendas.push(encomenda);
      }

      // 7️⃣ Atualizar total do pedido
      const totalPedido = encomendas.reduce((sum, e) => sum + parseFloat(e.total), 0);
      await this.pedidoRepo.update(pedido, { total: totalPedido }, { transaction: t });

      return { pedido, encomendas };
    });
  }
}

module.exports = PedidoService;
