'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedido', {
      id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
      usuario_id: {type: Sequelize.INTEGER, allowNull: false, references: { model: 'usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      total: {type: Sequelize.DECIMAL(10, 2),allowNull: false},
      status: {
        type: Sequelize.ENUM('criado', 'pago', 'parcialmente_concluido', 'concluido', 'cancelado'),
        defaultValue: 'criado'
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
    await queryInterface.dropTable('pedido');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_pedido_status";'
    );
  }
};
