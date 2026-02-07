'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ledger', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      entidade_tipo: { type: Sequelize.ENUM('usuario', 'loja', 'sistema') },
      entidade_id: { type: Sequelize.INTEGER },
      transacao_id: { type: Sequelize.INTEGER, references: { model: 'transacao', key: 'id' } },
      tipo: { type: Sequelize.ENUM('credito', 'debito') },
      valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      saldo_resultante: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('ledger')
};