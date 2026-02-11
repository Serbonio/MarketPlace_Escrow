const models = require('../config/database');

module.exports = {
  pedidoRepo: new (require('./pedidoRepository'))(models.Pedido),
  encomendaRepo: new (require('./encomendaRepository'))(models.Encomenda),
  encomendaItemRepo: new (require('./encomendaItemRepository'))(models.EncomendaItem),
  escrowRepo: new (require('./escrowRepository'))(models.Escrow),
  transacaoRepo: new (require('./transacaoRepository'))(models.Transacao),
  ledgerRepo: new (require('./ledgerRepository'))(models.Ledger),
//   produtoRepo: new (require('./produtoRepository'))(models.Produto),
};
