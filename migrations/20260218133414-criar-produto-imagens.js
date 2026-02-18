'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProdutoImagens', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      produto_id: {
        type: Sequelize.INTEGER,
        references: { model: 'produto', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      url: { type: Sequelize.STRING, allowNull: false },
      ordem: { type: Sequelize.INTEGER, defaultValue: 0 },
      principal: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('ProdutoImagens')
};