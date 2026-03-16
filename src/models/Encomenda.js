const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Encomenda = sequelize.define('Encomenda', {
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  loja_id: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { 
    type: DataTypes.ENUM('criada', 'paga', 'enviada', 'entregue', 'concluida', 'cancelada'),
    defaultValue: 'criada'
  },
  delivery_token: DataTypes.STRING,
  metodo_confirmacao: { 
    type: DataTypes.ENUM('token', 'otp', 'assinatura digital', 'manual', 'automatico'),
    allowNull: false
  }
}, { tableName: 'encomenda', timestamps: true, underscored: true });

Encomenda.associate = (models) => {
  // Pertence a
  Encomenda.belongsTo(models.Pedido, {
    foreignKey: 'pedido_id',
    as: 'pedido'
  });
  Encomenda.belongsTo(models.Loja, {
    foreignKey: 'loja_id',
    as: 'loja'
  });

  // Tem muitos/um
  Encomenda.hasMany(models.EncomendaItem, {
    foreignKey: 'encomenda_id',
    as: 'itens'
  });
  Encomenda.hasMany(models.Transacao, {
    foreignKey: 'encomenda_id',
    as: 'transacoes'
  });
  Encomenda.hasOne(models.Escrow, {
    foreignKey: 'encomenda_id',
    as: 'escrow'
  });
};
module.exports = Encomenda;
