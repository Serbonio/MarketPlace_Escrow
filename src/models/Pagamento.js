const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pagamento = sequelize.define('Pagamento', {
  pedido_id: { type: DataTypes.INTEGER, allowNull: false, references:{model:'pedido', key:'id'}},
  merchant_transaction_id:{type: DataTypes.STRING, allowNull:false, unique:true},
  gateway_transaction_id: { type: DataTypes.STRING, unique:true},
  valor_pago: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  pagamento_status: { type: DataTypes.STRING, defaultValue: 'pendente' ,
    validate:{
        isIn:[['pendente','pago','falhou', 'expirado']]
    }        
},
  pagamento_metodo: { 
    type: DataTypes.STRING, allowNull: false, 
    validate:{
        isIn:[['REF','GPO','pagamento_entrega']]
    },
    defaultValue:'GPO'
  },
  referencia_numero:DataTypes.STRING,
  referencia_entidade: {type:DataTypes.STRING, defaultValue:'00348'},
  referencia_validade : DataTypes.DATE,
  gateway_response: DataTypes.JSON, // Sequelize converte JSON automaticamente se configurado
  confirmed_at:{type:DataTypes.DATE},
}, 
{ tableName: 'pagamento', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', underscored: true });
Pagamento.associate = models=>{
  Pagamento.belongsTo(models.Pedido,{foreignKey:'pedido_id', as:'pedido'})
}
module.exports = Pagamento;