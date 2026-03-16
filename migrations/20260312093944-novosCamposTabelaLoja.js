'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionando os novos campos conforme o novo desenho
    await queryInterface.addColumn('loja', 'logo_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'status' // posiciona após o campo status para organização
    });

    await queryInterface.addColumn('loja', 'banner_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'logo_url'
    });

    // Caso queira garantir que a reputação tenha um valor padrão no DB
    await queryInterface.changeColumn('loja', 'reputacao', {
      type: Sequelize.FLOAT,
      defaultValue: 5.0
    });
    
    await queryInterface.addColumn('loja','prazo_entrega',{
      type: Sequelize.INTEGER,
      defaultValue: 7, 
      after:reputacao
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter as alterações caso necessário
    await queryInterface.removeColumn('loja', 'logo_url');
    await queryInterface.removeColumn('loja', 'banner_url');
  }
};