const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('criado', 'pago', 'parcialmente_concluido', 'concluido', 'cancelado'),
    defaultValue: 'criado'
  },
  nome_completo: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  telefone_contacto: { type: DataTypes.STRING, allowNull: false },
  provincia: { type: DataTypes.STRING, allowNull: false },
  cidade: { type: DataTypes.STRING, allowNull: false },
  endereco_completo: { type: DataTypes.TEXT, allowNull: false },
  codigo_postal: DataTypes.STRING,
  referencia_encontro: {type:DataTypes.TEXT, allowNull:false}
}, {
  tableName: 'pedido',
  timestamps: true,
  underscored: true
});

Pedido.associate = (models) => {
  Pedido.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  Pedido.hasMany(models.Encomenda, { foreignKey: 'pedido_id', as: 'encomendas' });
  Pedido.hasMany(models.Pagamento,{foreignKey:'pedido_id', as:'pagamentos'})
};

module.exports = Pedido;