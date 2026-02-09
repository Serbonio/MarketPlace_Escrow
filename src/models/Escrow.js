// src/models/Escrow.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escrow = sequelize.define('Escrow', {
  // ATRIBUTOS (Baseado na migration, id omitido)
  encomenda_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false // Adicionado para garantir integridade, dado que é FK
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ativo', 'liberado', 'disputado', 'cancelado')
    // allowNull default é true
  }
}, {
  // OPÇÕES
  tableName: 'escrow',
  timestamps: true, // Migration tem created_at e updated_at
  underscored: true // Migration usa snake_case
});

// LIGAÇÕES (Associações)
Escrow.associate = (models) => {
  // O Escrow pertence a uma Encomenda (e vice-versa, definido no model Encomenda)
  Escrow.belongsTo(models.Encomenda, {
    foreignKey: 'encomenda_id',
    as: 'encomenda'
  });
};

module.exports = Escrow;