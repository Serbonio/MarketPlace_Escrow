// src/models/EncomendaItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EncomendaItem = sequelize.define('EncomendaItem', {
  // ATRIBUTOS (Baseado na migration, id omitido)
  encomenda_id: {
    type: DataTypes.INTEGER,
    allowNull: false // Adicionado para garantir integridade, dado que é FK
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false // Adicionado para garantir integridade, dado que é FK
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  // OPÇÕES
  tableName: 'encomenda_item',
  timestamps: false // Migration não definiu created_at/updated_at
});

// LIGAÇÕES (Associações)
EncomendaItem.associate = (models) => {
  EncomendaItem.belongsTo(models.Encomenda, {
    foreignKey: 'encomenda_id',
    as: 'encomenda'
  });
  EncomendaItem.belongsTo(models.Produto, {
    foreignKey: 'produto_id',
    as: 'produto'
  });
};

module.exports = EncomendaItem;