// src/repositories/index.js
const PedidoRepository = require('./pedidoRepository');
const EncomendaRepository = require('./encomendaRepository');
const EncomendaItemRepository = require('./encomendaItemRepository');
const ProdutoRepository = require('./produtoRepository');
const EscrowRepository = require('./escrowRepository');
const TransacaoRepository = require('./transacaoRepository');
const LedgerRepository = require('./ledgerRepository');
// const LojaRepository = require('./lojaRepository');
// const UsuarioRepository = require('./usuarioRepository');

module.exports = {
    pedidoRepo: new PedidoRepository(),
    encomendaRepo: new EncomendaRepository(),
    encomendaItemRepo: new EncomendaItemRepository(),
    produtoRepo: new ProdutoRepository(),
    escrowRepo: new EscrowRepository(),
    transacaoRepo: new TransacaoRepository(),
    ledgerRepo: new LedgerRepository(),
    // lojaRepo: new LojaRepository(),
    // usuarioRepo: new UsuarioRepository(),
};