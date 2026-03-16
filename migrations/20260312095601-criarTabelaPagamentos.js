'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pagamento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedido', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      gateway_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true, // Pode ser nulo até o gateway processar
        unique: true
      },
      valor_pago: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      pagamento_status: {
        type: Sequelize.STRING,
        defaultValue: 'pendente'
      },
      pagamento_metodo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gateway_response: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable('pagamento');
  }
};