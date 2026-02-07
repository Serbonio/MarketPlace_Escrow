'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('encomenda', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedido', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      loja_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'loja', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM(
          'criada',
          'paga',
          'enviada',
          'concluida',
          'cancelada'
        ),
        defaultValue: 'criada'
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('encomenda');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_encomenda_status";'
    );
  }
};
