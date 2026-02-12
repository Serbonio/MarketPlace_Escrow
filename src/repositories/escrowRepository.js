// src/repositories/EscrowRepository.js
const BaseRepository = require('./BaseRepository');
const Escrow = require('../models/Escrow');

class EscrowRepository extends BaseRepository {
    constructor() {
        super(Escrow);
    }

    async findByEncomendaId(encomendaId, options = {}) {
        return await this.model.findOne({
            where: { encomenda_id: encomendaId },
            ...options
        });
    }
}
module.exports = EscrowRepository;