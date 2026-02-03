const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loja = sequelize.define('Loja', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  avaliacao_media: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0,
  },
  verificada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'lojas',
  timestamps: false,
});

module.exports = Loja;
