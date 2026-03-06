// src/repositories/ProdutoImagemRepository.js
const BaseRepository = require('./BaseRepository');
const {ProdutoImagem} = require('../models');

class ProdutoImagemRepository extends BaseRepository {
    constructor() {
        super(ProdutoImagem);
    }

    // Define uma imagem como principal e remove o status das outras do mesmo produto
    async setMainImage(produtoId, imagemId, options = {}) {
        // Remove 'principal' de todas as imagens do produto
        await this.model.update(
            { principal: false },
            { where: { produto_id: produtoId }, ...options }
        );
        // Define a nova principal
        return await this.update(imagemId, { principal: true }, options);
    }
}

module.exports = ProdutoImagemRepository;