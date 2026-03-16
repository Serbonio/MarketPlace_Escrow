'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('levantamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loja_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'loja', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Impede deletar loja com levantamentos pendentes
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      iban: {
        type: Sequelize.STRING,
        allowNull: false
      },
      titular_conta: {
        type: Sequelize.STRING,
        allowNull: false
      },
      comprovativo_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pendente', 'processando', 'concluido', 'rejeitado'),
        defaultValue: 'pendente'
      },
      motivo_rejeicao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('levantamentos');
  }
};