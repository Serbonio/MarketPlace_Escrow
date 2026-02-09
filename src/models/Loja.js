const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loja = sequelize.define('Loja', {
    nome: {type:DataTypes.STRING, allowNull: false},
    descricao: DataTypes.TEXT,
    status: DataTypes.ENUM('ativa', 'suspensa'),
    reputacao: DataTypes.FLOAT
  }, {
    tableName: 'loja',
    timestamps: true,
    underscored: true
  });

  Loja.associate = (models) => {
    Loja.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    Loja.hasMany(models.Produto, { foreignKey: 'loja_id' });
    Loja.hasMany(models.Encomenda, { foreignKey: 'loja_id' });
  };


module.exports = Loja;
