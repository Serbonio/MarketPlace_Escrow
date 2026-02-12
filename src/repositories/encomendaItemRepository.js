// src/repositories/EncomendaItemRepository.js
const BaseRepository = require('./BaseRepository');
const EncomendaItem = require('../models/EncomendaItem');

class EncomendaItemRepository extends BaseRepository {
    constructor() {
        super(EncomendaItem);
    }

    // bulkCreate é específico, não tem na base
    async bulkCreate(items, options = {}) {
        return await this.model.bulkCreate(items, options);
    }

    async findByEncomendaId(encomendaId, options = {}) {
        return await this.findAll({
            where: { encomenda_id: encomendaId },
            ...options
        });
    }
}
module.exports = EncomendaItemRepository;