const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Levantamento = sequelize.define('Levantamento', {
  loja_id: { type: DataTypes.INTEGER, allowNull: false, references:{model:'loja', }},
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  iban: { type: DataTypes.STRING, allowNull: false },
  titular_conta: { type: DataTypes.STRING, allowNull: false },
  comprovativo_url: DataTypes.STRING,
  status: { 
    type: DataTypes.ENUM('pendente', 'processando', 'concluida', 'rejeitado'), 
    defaultValue: 'pendente' 
  },
  motivo_rejeicao: DataTypes.TEXT
}, { tableName: 'levantamentos', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', underscored: true });
Levantamento.associate = models=>{
  Levantamento.belongsTo(models.Loja,{foreignKey:'loja_id', as:'loja'})
  Levantamento.hasOne(models.Transacao, {foreignKey:'levantamento_id', as:'detalhe_saque'})
}
module.exports = Levantamento;