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

    async decrementEstoque(produto, quantidade, options = {}) {
        // 'produto' aqui deve ser uma instância do Sequelize
        return await produto.decrement('estoque', {
            by: quantidade,
            ...options
        });
    }
}

module.exports = ProdutoRepository;