const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  }, 
  tipo: {
    type: DataTypes.ENUM('cliente', 'vendedor', 'admin'),
    defaultValue: 'cliente',
  },
}, {
  tableName: 'usuario',
  timestamps: true,
  underscored: true,
});

Usuario.associate = (models) => {
  Usuario.hasMany(models.Produto, { foreignKey: 'vendedor_id', as: 'produtos' });
  Usuario.hasMany(models.Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
};

module.exports = Usuario;
