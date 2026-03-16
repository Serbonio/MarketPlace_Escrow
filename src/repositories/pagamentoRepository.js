const BaseRepository = require('./BaseRepository')
const {Pagamento, Pedido} = require('../models')

class PagamentoRepository extends BaseRepository{
    constructor(){
       super(Pagamento);
    }
    async findOrderByMerchantTransactionId(merchant_transaction_id, options={}){
        const pagamento= await this.model.findOne({
            where:{
                merchant_transaction_id:merchant_transaction_id
            },
            ...options
        })
        return await Pedido.findOne({
            where:{
                id: pagamento.pedido_id
            }
        })
    }
     async findByMerchantTransactionId(merchant_transaction_id, options={}){
        return await this.model.findOne({
            where:{
                merchant_transaction_id:merchant_transaction_id
            },
        });
    }
}

module.exports = PagamentoRepository;