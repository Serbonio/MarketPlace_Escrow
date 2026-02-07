'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuario', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      telefone:{ type: Sequelize.STRING, allowNull: true },
      senha: { type: Sequelize.STRING, allowNull: false },
      tipo: { type: Sequelize.ENUM('cliente', 'vendedor', 'admin'), allowNull: false },
      status: { type: Sequelize.ENUM('ativo', 'suspenso'), defaultValue: 'ativo' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('usuario')
};

