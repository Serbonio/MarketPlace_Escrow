// src/repositories/ProdutoRepository.js
const BaseRepository = require('./BaseRepository');
const Produto = require('../models/Produto');
const { Op } = require('sequelize');

class ProdutoRepository extends BaseRepository {
    constructor() {
        super(Produto);
    }

    async findByIds(ids, options = {}) {
        // Se 'ids' for um array, usa findAll com Op.in
        if (Array.isArray(ids)) {
            return await this.findAll({
                where: {
                    id: { [Op.in]: ids }
                },
                ...options
            });
        }
        // Se for um único ID, usa o findById da base
        return await super.findById(ids, options);
    }

    async decrementEstoque(produto, quantidade, options = {}) {
        return await produto.decrement('estoque', {
            by: quantidade,
            ...options
        });
    }
}
module.exports = ProdutoRepository;