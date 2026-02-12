// src/repositories/BaseRepository.js
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data, options = {}) {
        return await this.model.create(data, options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async update(id, data, options = {}) {
        const record = await this.findById(id, options);
        if (!record) throw new Error('Registro não encontrado');
        return await record.update(data, options);
    }

    async delete(id, options = {}) {
        const record = await this.findById(id, options);
        if (!record) throw new Error('Registro não encontrado');
        return await record.destroy(options);
    }
}
module.exports = BaseRepository;