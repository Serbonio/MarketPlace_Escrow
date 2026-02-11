'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('loja', [
      {
        usuario_id: 57, // vendedor
        nome: 'Loja Teste',
        descricao: 'Loja de teste do vendedor',
        status: 'ativa',
        reputacao: 5.0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('loja', null, {});
  }
};
