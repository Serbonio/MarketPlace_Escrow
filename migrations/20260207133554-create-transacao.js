'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transacao', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      encomenda_id: { type: Sequelize.INTEGER, references: { model: 'encomenda', key: 'id' } },
      tipo: { type: Sequelize.ENUM('pagamento', 'liberacao', 'reembolso') },
      valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.ENUM('pendente', 'confirmada', 'falhou') },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('transacao')
};