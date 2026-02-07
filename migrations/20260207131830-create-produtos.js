'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produto', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      loja_id: {
        type: Sequelize.INTEGER,
        references: { model: 'loja', key: 'id' },
        onDelete: 'CASCADE'
      },
      nome: { type: Sequelize.STRING, allowNull: false },
      descricao: { type: Sequelize.TEXT },
      preco: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      estoque: { type: Sequelize.INTEGER, defaultValue: 0 },
      categoria: { type: Sequelize.STRING },
      ativo: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('produto')
};
