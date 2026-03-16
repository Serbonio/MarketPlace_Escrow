'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Verifica as colunas atuais da tabela
    const tableInfo = await queryInterface.describeTable('transacao');

    // 2. Renomeia 'tipo' para 'tipo_evento' apenas se 'tipo' existir e 'tipo_evento' não
    if (tableInfo.tipo && !tableInfo.tipo_evento) {
      await queryInterface.renameColumn('transacao', 'tipo', 'tipo_evento');
    }

    // 3. Atualiza o tipo da coluna para ENUM (usando changeColumn)
    await queryInterface.changeColumn('transacao', 'tipo_evento', {
      type: Sequelize.ENUM('pagamento_pedido', 'liberar_escrow', 'devolucao', 'saque'),
      allowNull: false
    });

    // 4. Adiciona pedido_id apenas se não existir
    if (!tableInfo.pedido_id) {
      await queryInterface.addColumn('transacao', 'pedido_id', {
        type: Sequelize.INTEGER,
        after: 'encomenda_id',
        allowNull: true,
        references: { model: 'pedido', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // 5. Adiciona levantamento_id apenas se não existir
    if (!tableInfo.levantamento_id) {
      await queryInterface.addColumn('transacao', 'levantamento_id', {
        type: Sequelize.INTEGER,
        after: 'pedido_id',
        allowNull: true,
        references: { model: 'levantamentos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.renameColumn('transacao', 'tipo_evento', 'tipo');
    await queryInterface.removeColumn('transacao', 'pedido_id');
    await queryInterface.removeColumn('transacao', 'levantamento_id');
  }
};

