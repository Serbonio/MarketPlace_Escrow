'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.renameColumn('pagamento', 'merchant_transactio_id', 'merchant_transaction_id')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.renameColumn('pagamento', 'merchant_transaction_id', 'merchant_transactio_id')

  }
};
