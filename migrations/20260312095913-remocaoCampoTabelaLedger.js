'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Renomear 'tipo' para 'tipo_movimento' (crédito/débito)
    await queryInterface.renameColumn('ledger', 'tipo', 'tipo_movimento');

    await queryInterface.removeColumn('ledger', 'saldo_resultante');
    // 2. Garantir que entidade_tipo aceite as strings do seu diagrama
    await queryInterface.changeColumn('ledger', 'entidade_tipo', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // 3. Remover saldo_resultante se você decidir que o saldo deve ser calculado 
    // dinamicamente para evitar erros de sincronismo (opcional, mas comum em MVPs)
    // await queryInterface.removeColumn('ledger', 'saldo_resultante');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ledger', 'tipo_movimento', 'tipo');
  }
};