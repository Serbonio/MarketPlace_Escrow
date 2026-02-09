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