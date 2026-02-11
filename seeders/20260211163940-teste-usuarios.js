'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senhaHash = await bcrypt.hash('123456', 10);

    return queryInterface.bulkInsert('usuario', [
      {
        nome: 'Vendedor Teste',
        email: 'vendedor@teste.com',
        senha: senhaHash,
        tipo: 'seller',
        status: 'ativo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Comprador Teste',
        email: 'comprador@teste.com',
        senha: senhaHash,
        tipo: 'buyer',
        status: 'ativo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('usuario', null, {});
  }
};
