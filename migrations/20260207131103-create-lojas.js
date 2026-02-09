'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loja', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuario', key: 'id' },
        onDelete: 'CASCADE'
      },
      nome: { type: Sequelize.STRING, allowNull: false },
      descricao: { type: Sequelize.TEXT },
      status: { type: Sequelize.ENUM('ativa', 'suspensa'), defaultValue: 'ativa' },
      reputacao: { type: Sequelize.FLOAT, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('loja')
};
