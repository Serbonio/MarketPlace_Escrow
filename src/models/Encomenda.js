// src/models/Encomenda.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Encomenda = sequelize.define('Encomenda', {
  // ATRIBUTOS (Baseado na migration, id omitido)
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  loja_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('criada', 'paga', 'enviada', 'concluida', 'cancelada'),
    defaultValue: 'criada'
  }
}, {
  // OPÇÕES
  tableName: 'encomenda',
  timestamps: true, // migration tem created_at e updated_at
  underscored: true // migration usa snake_case
});

// LIGAÇÕES (Associações)
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
  Encomenda.hasOne(models.Escrow, {
    foreignKey: 'encomenda_id',
    as: 'escrow'
  });
  Encomenda.hasMany(models.Transacao, {
    foreignKey: 'encomenda_id',
    as: 'transacoes'
  });
};

module.exports = Encomenda;