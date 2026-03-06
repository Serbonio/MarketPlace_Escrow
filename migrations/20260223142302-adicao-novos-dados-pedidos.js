'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionando os campos de identificação e contacto
    await queryInterface.addColumn('Pedido', 'nome_completo', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Pedido', 'telefone_contacto', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Adicionando os campos de localização geográfica
    await queryInterface.addColumn('Pedido', 'provincia', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Pedido', 'cidade', {
      type: Sequelize.STRING, // Ex: Talatona, Belas, Viana
      allowNull: false,
    });
    await queryInterface.addColumn('Pedido', 'endereco_completo', {
      type: Sequelize.TEXT, // Bairro, Rua, Bloco, nº da Casa
      allowNull: false,
    });
    await queryInterface.addColumn('Pedido', 'codigo_postal', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pedido', 'referencia_encontro', {
      type: Sequelize.TEXT, // "Defronte ao colégio...", "Ao lado do banco..."
      allowNull: true,
    });

    // Adicionando o método de pagamento escolhido no checkout
    await queryInterface.addColumn('Pedido', 'metodo_pagamento', {
      type: Sequelize.ENUM('multicaixa_express', 'transferencia', 'pagamento_entrega', 'carteira_digital'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pedido', 'nome_completo');
    await queryInterface.removeColumn('Pedido', 'telefone_contacto');
    await queryInterface.removeColumn('Pedido', 'provincia');
    await queryInterface.removeColumn('Pedido', 'cidade');
    await queryInterface.removeColumn('Pedido', 'endereco_completo');
    await queryInterface.removeColumn('Pedido', 'codigo_postal');
    await queryInterface.removeColumn('Pedido', 'referencia_encontro');
    await queryInterface.removeColumn('Pedido', 'metodo_pagamento');
  }
};