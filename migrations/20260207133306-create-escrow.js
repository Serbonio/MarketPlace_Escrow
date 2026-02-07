'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('escrow', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      encomenda_id: { type: Sequelize.INTEGER, unique: true, references: { model: 'encomenda', key: 'id' } },
      valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.ENUM('ativo', 'liberado', 'disputado', 'cancelado') },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('escrow')
};