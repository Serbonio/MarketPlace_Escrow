const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transacao = sequelize.define('Transacao', {
  // ATRIBUTOS
  encomenda_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Alterado para true conforme seu esquema de banco de dados
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  levantamento_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo_evento: {
    type: DataTypes.ENUM('pagamento_pedido', 'liberar_escrow', 'devolucao', 'saque'),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmada', 'falhou'),
    defaultValue: 'pendente'
  }
}, {
  // OPÇÕES
  tableName: 'transacao',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // Mantendo como você definiu originalmente
  underscored: true
});

// LIGAÇÕES (Associações)
Transacao.associate = (models) => {
  Transacao.belongsTo(models.Encomenda, {
    foreignKey: 'encomenda_id',
    as: 'encomenda'
  });
  Transacao.belongsTo(models.Pedido, {
    foreignKey: 'pedido_id',
    as: 'pedido'
  });
  Transacao.belongsTo(models.Levantamento, {
    foreignKey: 'levantamento_id',
    as: 'levantamento'
  });
  Transacao.hasMany(models.Ledger, {
    foreignKey: 'transacao_id',
    as: 'ledgers'
  });
};

module.exports = Transacao;