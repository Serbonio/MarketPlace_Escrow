const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loja = sequelize.define('Loja', {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuario', key: 'id' }
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: DataTypes.TEXT,
    status: DataTypes.ENUM('ativa', 'suspensa'),
    logo_url: DataTypes.STRING,
    banner_url: DataTypes.STRING,
    reputacao: DataTypes.FLOAT,
    prazo_entrega: DataTypes.INTEGER
}, {
    tableName: 'loja',
    timestamps: true,
    underscored: true
});

Loja.associate = (models) => {
    Loja.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as:'usuario'});
    Loja.hasMany(models.Produto, { foreignKey: 'loja_id', as: 'produtos' });
    Loja.hasMany(models.Encomenda, { foreignKey: 'loja_id', as:'encomendas'});
    Loja.hasMany(models.Levantamento, {foreignKey: 'loja_id', as:'levantamentos'})
};

module.exports = Loja;