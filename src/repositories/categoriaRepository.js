// src/repositories/CategoriaRepository.js
const BaseRepository = require('./BaseRepository');
const {Categoria} = require('../models');

class CategoriaRepository extends BaseRepository {
    constructor() {
        super(Categoria);
    }

    // Busca todas as categorias principais (sem pai) e suas subcategorias
    async findTree() {
        return await this.findAll({
            where: { categoria_pai_id: null },
            include: [{ association: 'subcategorias' }]
        });
    }

    async findBySlug(slug) {
        return await this.model.findOne({ where: { slug } });
    }
}

module.exports = CategoriaRepository;