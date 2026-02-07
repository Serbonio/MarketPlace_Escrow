'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('encomenda_item', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      encomenda_id: { type: Sequelize.INTEGER, references: { model: 'encomenda', key: 'id' } },
      produto_id: { type: Sequelize.INTEGER, references: { model: 'produto', key: 'id' } },
      quantidade: { type: Sequelize.INTEGER, allowNull: false },
      preco_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('encomenda_item')
};