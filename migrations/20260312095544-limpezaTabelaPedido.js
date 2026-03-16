'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Removendo campos que foram para a tabela de Pagamento
    await queryInterface.removeColumn('pedido', 'metodo_pagamento');

    // Adicionando o campo email (caso não exista) para o snapshot do pedido
    await queryInterface.addColumn('pedido', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'nome_completo'
    });

    // Renomeando para bater com o Model e o DER se necessário
    // Se a coluna já for telefone_contacto, ignorar. Se for apenas telefone, renomear:
    // await queryInterface.renameColumn('pedido', 'telefone', 'telefone_contacto');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pedido', 'metodo_pagamento', {
      type: Sequelize.ENUM('multicaixa_express', 'transferencia', 'pagamento_entrega', 'carteira_digital'),
      allowNull: false
    });
    await queryInterface.removeColumn('pedido', 'email');
  }
};