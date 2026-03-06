// src/models/Pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  // ATRIBUTOS (Baseado na migration, id omitido por ser autoincrement padrao)
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('criado', 'pago', 'parcialmente_concluido', 'concluido', 'cancelado'),
    defaultValue: 'criado'
  },
  nome_completo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone_contacto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco_completo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  codigo_postal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referencia_encontro: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // --- PAGAMENTO ---
  metodo_pagamento: {
    type: DataTypes.ENUM('multicaixa_express', 'transferencia', 'pagamento_entrega', 'carteira_digital'),
    allowNull: false
  }
}, {
  // OPÇÕES
  tableName: 'pedido',
  timestamps: true, // migration tem created_at e updated_at
  underscored: true // migration usa snake_case
});

// LIGAÇÕES (Associações)
Pedido.associate = (models) => {
  // Um pedido pertence a um usuário
  Pedido.belongsTo(models.Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
  });
  
  // Um pedido pode ter várias encomendas (conforme sua instrução)
  Pedido.hasMany(models.Encomenda, {
    foreignKey: 'pedido_id',
    as: 'encomendas'
  });
};

module.exports = Pedido;