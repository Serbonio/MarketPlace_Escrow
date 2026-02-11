'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('produto', [
      {
        loja_id: 5,
        nome: 'Produto Teste 1',
        descricao: 'Descrição do produto 1',
        preco: 100.00,
        estoque: 50,
        categoria: 'Categoria A',
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        loja_id: 5,
        nome: 'Produto Teste 2',
        descricao: 'Descrição do produto 2',
        preco: 200.00,
        estoque: 30,
        categoria: 'Categoria B',
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('produto', null, {});
  }
};
