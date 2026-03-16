'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('encomenda', 'delivery_token', {
      type: Sequelize.STRING,
      allowNull: true, // Gerado após o pagamento ser confirmado
      comment: 'Token que o cliente apresenta ao receber o produto'
    });

    await queryInterface.addColumn('encomenda', 'metodo_confirmacao', {
      type: Sequelize.ENUM('token', 'otp', 'assinatura digital','manual','automatico'),
      defaultValue: 'token',
      allowNull: false
    });

    await queryInterface.changeColumn('encomenda','status',{
      type:Sequelize.ENUM("criada","paga","enviada","entregue","concluida", "cancelada")
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('encomenda', 'delivery_token');
    await queryInterface.removeColumn('encomenda', 'metodo_confirmacao');
  }
};