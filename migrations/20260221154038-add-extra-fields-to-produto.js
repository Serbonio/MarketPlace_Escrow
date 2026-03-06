'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usamos o Promise.all para garantir que todas as colunas sejam adicionadas
    return Promise.all([
      queryInterface.addColumn('produto', 'marca', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'nome' // Tenta colocar após o campo nome (apenas MySQL/MariaDB)
      }),
      queryInterface.addColumn('produto', 'modelo', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'marca'
      }),
      queryInterface.addColumn('produto', 'condicao', {
        type: Sequelize.ENUM('novo', 'usado', 'recondicionado'),
        defaultValue: 'novo',
        after: 'modelo'
      }),
      queryInterface.addColumn('produto', 'prazo_entrega', {
        type: Sequelize.INTEGER,
        defaultValue: 3,
        comment: 'Prazo em dias úteis',
        after: 'condicao'
      }),
      queryInterface.addColumn('produto', 'especificacoes', {
        type: Sequelize.JSON,
        allowNull: true,
        after: 'descricao_completa'
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // No "down", removemos as colunas na ordem inversa caso precises de fazer rollback
    return Promise.all([
      queryInterface.removeColumn('produto', 'marca'),
      queryInterface.removeColumn('produto', 'modelo'),
      queryInterface.removeColumn('produto', 'condicao'),
      queryInterface.removeColumn('produto', 'prazo_entrega'),
      queryInterface.removeColumn('produto', 'especificacoes')
    ]);
  }
};