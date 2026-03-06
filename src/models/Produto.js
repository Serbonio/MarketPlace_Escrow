const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  loja_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loja', key: 'id' }
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    references: { model: 'Categorias', key: 'id' }
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  condicao: {
    type: DataTypes.ENUM('novo', 'usado', 'recondicionado'),
    defaultValue: 'novo'
  },
  descricao_curta: DataTypes.STRING(255),
  descricao_completa: DataTypes.TEXT,
  especificacoes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Campos técnicos variáveis como RAM, CPU, Material, etc.'
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  preco_promocional: DataTypes.DECIMAL(10, 2),
  estoque: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  prazo_entrega: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    comment: 'Tempo estimado de entrega em dias úteis'
  },
  ativo: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  sku: {
    type: DataTypes.STRING,
    unique: true
  },
  // Logística/Frete
  peso: DataTypes.DECIMAL(10, 3),
  largura: DataTypes.INTEGER,
  altura: DataTypes.INTEGER,
  comprimento: DataTypes.INTEGER,
  // Status e Visibilidade
  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'pausado'),
    defaultValue: 'ativo'
  },
  visibilidade: {
    type: DataTypes.ENUM('publico', 'privado'),
    defaultValue: 'publico'
  }
}, {
  tableName: 'produto',
  underscored: true
});

Produto.associate = (models) => {
  Produto.belongsTo(models.Loja, { foreignKey: 'loja_id', as: 'loja' });
  Produto.belongsTo(models.Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
  Produto.hasMany(models.ProdutoImagem, { foreignKey: 'produto_id', as: 'imagens' });
  
  Produto.hasMany(models.EncomendaItem, {
    foreignKey: 'produto_id',
    as: 'itens_encomenda'
  });
};

module.exports = Produto;