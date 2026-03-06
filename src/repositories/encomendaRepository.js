// src/repositories/EncomendaRepository.js
const BaseRepository = require('./BaseRepository');
const {Encomenda, EncomendaItem} = require('../models');

class EncomendaRepository extends BaseRepository {
    constructor() {
        super(Encomenda);
    }
    async findById(id, options={}){
        return await this.model.findByPk(id, {
            include:[
                {
                    model:EncomendaItem, 
                    as:"itens"
                }
            ]
        , ...options})
    }
    // findById, create, update já existem na base.
    
    async findByPedidoId(pedidoId, options = {}) {
        return await this.findAll({
            where: { pedido_id: pedidoId },
            ...options
        });
    }
}
module.exports = EncomendaRepository;