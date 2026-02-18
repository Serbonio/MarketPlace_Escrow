'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Adicionar novas colunas
    await queryInterface.addColumn('produto', 'descricao_curta', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn('produto', 'descricao_completa', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('produto', 'preco_promocional', { type: Sequelize.DECIMAL(10, 2), allowNull: true });
    await queryInterface.addColumn('produto', 'sku', { type: Sequelize.STRING, unique: true, allowNull: true });
    await queryInterface.addColumn('produto', 'peso', { type: Sequelize.DECIMAL(10, 3) });
    await queryInterface.addColumn('produto', 'largura', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('produto', 'altura', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('produto', 'comprimento', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('produto', 'status', { 
      type: Sequelize.ENUM('ativo', 'inativo', 'pausado'), defaultValue: 'ativo' 
    });
    await queryInterface.addColumn('produto', 'visibilidade', { 
      type: Sequelize.ENUM('publico', 'privado'), defaultValue: 'publico' 
    });
    
    // 2. Relacionamento com a nova tabela Categoria
    await queryInterface.addColumn('produto', 'categoria_id', {
      type: Sequelize.INTEGER,
      references: { model: 'Categorias', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 3. Remover colunas antigas (Cuidado: certifique-se de migrar os dados antes se houver produção)
    await queryInterface.removeColumn('produto', 'descricao');
    await queryInterface.removeColumn('produto', 'categoria');
  },

  down: async (queryInterface, Sequelize) => {
    // Lógica para reverter se necessário
    await queryInterface.removeColumn('produto', 'categoria_id');
    // ... adicionar colunas antigas de volta
  }
};