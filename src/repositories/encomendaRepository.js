// src/repositories/EncomendaRepository.js
const BaseRepository = require('./BaseRepository');
const Encomenda = require('../models/Encomenda');

class EncomendaRepository extends BaseRepository {
    constructor() {
        super(Encomenda);
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