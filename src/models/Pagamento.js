const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pagamento = sequelize.define('Pagamento', {
  pedido_id: { type: DataTypes.INTEGER, allowNull: false, references:{model:'pedido', key:'id'}},
  gateway_transaction_id: { type: DataTypes.STRING, unique:true},
  valor_pago: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  pagamento_status: { type: DataTypes.STRING, defaultValue: 'pendente' ,
    validate:{
        isIn:[['pendente','confirmado','falhou']]
    }        
},
  
  pagamento_metodo: { 
    type: DataTypes.STRING, allowNull: false, 
    validate:{
        isIn:[['ref','gpo','pagamento_entrega']]
    },
    defaultValue:'pendente'
  },
  gateway_response: DataTypes.JSON // Sequelize converte JSON automaticamente se configurado
}, { tableName: 'pagamento', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', underscored: true });
Pagamento.associate = models=>{
  Pagamento.belongsTo(models.Pedido,{foreignKey:'pedido_id', as:'pedido'})
}
module.exports = Pagamento;