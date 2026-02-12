// src/repositories/LedgerRepository.js
const BaseRepository = require('./BaseRepository');
const Ledger = require('../models/Ledger');

class LedgerRepository extends BaseRepository {
    constructor() {
        super(Ledger);
    }

    async findByEntidade(entidadeTipo, entidadeId, options = {}) {
        return await this.findAll({
            where: {
                entidade_tipo: entidadeTipo,
                entidade_id: entidadeId
            },
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findLastSaldo(entidadeTipo, entidadeId, options = {}) {
        return await this.model.findOne({
            where: {
                entidade_tipo: entidadeTipo,
                entidade_id: entidadeId
            },
            order: [['created_at', 'DESC']],
            ...options
        });
    }
}
module.exports = LedgerRepository;