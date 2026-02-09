// models/Produto.js
const { DataTypes } = require('sequelize'); 
const sequelize = require('../config/database');  

const Produto = sequelize.define('Produto', {
    loja_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: DataTypes.TEXT,
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estoque: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    categoria: DataTypes.STRING,
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'produto',
    underscored: true
  });

  Produto.associate = (models) => {
    Produto.belongsTo(models.Loja, {
      foreignKey: 'loja_id',
      as: 'loja'
    });

    Produto.hasMany(models.EncomendaItem, {
      foreignKey: 'produto_id',
      as: 'itens_encomenda'
    });
  };

module.exports = Produto;