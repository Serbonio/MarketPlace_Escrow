const sequelize = require('../config/database');

// 1. Importar as definições (apenas os modelos, sem associações ainda)
const Usuario = require('./Usuario');
const Loja = require('./Loja'); 
const Produto = require('./Produto');
const ProdutoImagem = require('./ProdutoImagem')
const Pedido = require('./Pedido');
const Pagamento = require('./Pagamento');
const Encomenda = require('./Encomenda');
const EncomendaItem = require('./EncomendaItem');
const Transacao = require('./Transacao');
const Ledger = require('./Ledger');
const Escrow = require('./Escrow');
const Categoria = require('./Categoria');
const Levantamento = require('./Levantamento');
// Adicione todos os outros modelos aqui...

const models = {
  Usuario,
  Loja,
  Produto,
  ProdutoImagem,
  Pedido,
  Encomenda,
  EncomendaItem,
  Transacao,
  Ledger,
  Escrow,
  Categoria,
  Levantamento,
  Pagamento
};

// 2. Executar as associações passando o objeto 'models' completo
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.log(`Associando modelo: ${modelName}`);
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  sequelize
};