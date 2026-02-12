// src/repositories/TransacaoRepository.js
const BaseRepository = require('./BaseRepository');
const Transacao = require('../models/Transacao');

class TransacaoRepository extends BaseRepository {
    constructor() {
        super(Transacao);
    }

    async findByEncomendaId(encomendaId, options = {}) {
        return await this.findAll({
            where: { encomenda_id: encomendaId },
            ...options
        });
    }
}
module.exports = TransacaoRepository;