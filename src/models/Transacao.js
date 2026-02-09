// src/models/Transacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transacao = sequelize.define('Transacao', {
  // ATRIBUTOS (Baseado na migration, id omitido)
  encomenda_id: {
    type: DataTypes.INTEGER,
    allowNull: false // Adicionado para garantir integridade, dado que é FK
  },
  tipo: {
    type: DataTypes.ENUM('pagamento', 'liberacao', 'reembolso')
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmada', 'falhou')
  }
}, {
  // OPÇÕES
  tableName: 'transacao',
  timestamps: true, // Migration tem created_at, mas não updated_at
  createdAt: 'created_at',
  updatedAt: false, // Explicitando que não há updated_at
  underscored: true // Migration usa snake_case
});

// LIGAÇÕES (Associações)
Transacao.associate = (models) => {
  // Pertence a
  Transacao.belongsTo(models.Encomenda, {
    foreignKey: 'encomenda_id',
    as: 'encomenda'
  });
  
  // Tem muitos
  Transacao.hasMany(models.Ledger, {
    foreignKey: 'transacao_id',
    as: 'ledgers'
  });
};

module.exports = Transacao;