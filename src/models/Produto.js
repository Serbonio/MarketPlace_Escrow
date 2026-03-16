const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  loja_id: { type: DataTypes.INTEGER, allowNull: false },
  categoria_id: { type: DataTypes.INTEGER },
  nome: { type: DataTypes.STRING, allowNull: false },
  marca: DataTypes.STRING(100),
  modelo: DataTypes.STRING(100),
  condicao: { type: DataTypes.ENUM('novo', 'usado', 'recondicionado'), defaultValue: 'novo' },
  preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  preco_promocional: DataTypes.DECIMAL(10, 2),
  estoque: { type: DataTypes.INTEGER, defaultValue: 0 },
  descricao_curta: DataTypes.STRING(255),
  descricao_completa: DataTypes.TEXT,
  especificacoes: DataTypes.JSON,
  sku: { type: DataTypes.STRING, unique: true },
  peso: DataTypes.DECIMAL(10, 3),
  largura: DataTypes.INTEGER,
  altura: DataTypes.INTEGER,
  comprimento: DataTypes.INTEGER,
  status: { type: DataTypes.ENUM('ativo', 'inativo', 'pausado'), defaultValue: 'ativo' },
  visibilidade: { type: DataTypes.ENUM('publico', 'privado'), defaultValue: 'publico' }
}, {
  tableName: 'produto',
  underscored: true,
  timestamps: true
});

Produto.associate = (models)=>{
  Produto.belongsTo(models.Loja,{foreignKey:'loja_id', as:'loja'})
  Produto.belongsTo(models.Categoria,{foreignKey:'categoria_id', as:'categoria'})
  Produto.hasMany(models.ProdutoImagem, {foreignKey:'produto_id', as:'produto_imagens'})
  Produto.hasMany(models.EncomendaItem, {foreignKey:'produto_id', as:'encomenda_itens'})
}

module.exports = Produto;