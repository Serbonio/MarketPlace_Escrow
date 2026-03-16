'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Removendo as colunas desnecessárias para o novo design
    await queryInterface.removeColumn('produto', 'ativo');
    await queryInterface.removeColumn('produto', 'prazo_entrega');
  },

  down: async (queryInterface, Sequelize) => {
    // Caso precise reverter, adicionamos de volta
    await queryInterface.addColumn('produto', 'ativo', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    });
    await queryInterface.addColumn('produto', 'prazo_entrega', {
      type: Sequelize.INTEGER,
      defaultValue: 3
    });
  }
};