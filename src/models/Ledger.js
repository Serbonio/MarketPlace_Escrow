// src/models/Ledger.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ledger = sequelize.define('Ledger', {
  // ATRIBUTOS (Baseado na migration, id omitido)
  entidade_tipo: {
    type: DataTypes.ENUM('usuario', 'loja', 'sistema')
  },
  entidade_id: {
    type: DataTypes.INTEGER
  },
  transacao_id: {
    type: DataTypes.INTEGER,
    allowNull: false // Adicionado para garantir integridade, dado que é FK
  },
  tipo: {
    type: DataTypes.ENUM('credito', 'debito')
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  saldo_resultante: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  // OPÇÕES
  tableName: 'ledger',
  timestamps: true, // Migration tem created_at, mas não updated_at
  createdAt: 'created_at',
  updatedAt: false, // Explicitando que não há updated_at
  underscored: true // Migration usa snake_case
});

// LIGAÇÕES (Associações)
Ledger.associate = (models) => {
  // Pertence a uma transação
  Ledger.belongsTo(models.Transacao, {
    foreignKey: 'transacao_id',
    as: 'transacao'
  });
};

module.exports = Ledger;