const BaseRepository = require('./BaseRepository');
const { Produto, ProdutoImagem, Categoria } = require('../models');
const { Op } = require('sequelize');

class ProdutoRepository extends BaseRepository {
    constructor() {
        super(Produto);
    }

    // Busca produto com imagens e categoria inclusas
    async findFullDetails(id, options = {}) {
        return await this.findById(id, {
            include: [
                { model: ProdutoImagem, as: 'produto_imagens' },
                { model: Categoria, as: 'categoria' }
            ],
            ...options
        });
    }

    async produtosDaLoja(loja_id, options = {}) { // Adicionei options como parâmetro
        return await this.findAll({
            where: { 
                loja_id: loja_id 
            }, 
            include: [
                {
                    model: ProdutoImagem,
                    as: 'produto_imagens',
                    attributes: ['id', 'url']
                },
                {
                    model: Categoria,
                    as: 'categoria'
                }
            ],
            ...options // Agora a variável entra corretamente na query
        });
    }

    async findByIds(ids, options = {}) {
        if (Array.isArray(ids)) {
            return await this.findAll({
                where: { 
                    id: { [Op.in]: ids } 
                },
                ...options
            });
        }
        return await super.findById(ids, options);
    }

    async decrementEstoque(produtoOuId, quantidade, options = {}) {
    // Se for um número, decrementa usando o Model e WHERE
    if (typeof produtoOuId === 'number' || typeof produtoOuId === 'string') {
        return await this.model.decrement('estoque', {
            by: quantidade,
            where: { id: produtoOuId },
            ...options
        });
    }

    // Se for o objeto (instância do Sequelize), decrementa diretamente nele
    // Isso é o que o seu Service está tentando fazer
    return await produtoOuId.decrement('estoque', {
        by: quantidade,
        ...options
    });
}
}

module.exports = ProdutoRepository;