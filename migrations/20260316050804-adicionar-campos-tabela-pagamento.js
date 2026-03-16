'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pagamento','merchant_transactio_id',{
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      after:'pedido_id'
    })
    await queryInterface.addColumn('pagamento','referencia_numero',{
      type:Sequelize.STRING,
      after:'pagamento_metodo'
    })
    await queryInterface.addColumn('pagamento','referencia_entidade',{
      type:Sequelize.STRING,
      after:'referencia_numero'
    })
    await queryInterface.addColumn('pagamento','referencia_validade',{
      type:Sequelize.DATE,
      after:'referencia_entidade'
    })
    await queryInterface.addColumn('pagamento','corfirmed_at',{
      type:Sequelize.DATE,
      after:'updated_at'
    })
    await queryInterface.changeColumn('pagamento','pagamento_status',{
      type:Sequelize.STRING,
      allowNull: false,
      defaultValue:'pendente'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pagamento','merchant_transaction_id')
    await queryInterface.removeColumn('pagamento','referencia_numero')
    await queryInterface.removeColumn('pagamento','referencia_entidade')
    await queryInterface.removeColumn('pagamento','referencia_validade')
    await queryInterface.removeColumn('pagamento','confirmed_at')
  }
};
