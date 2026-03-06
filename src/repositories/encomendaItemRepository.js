// src/repositories/EncomendaItemRepository.js
const BaseRepository = require('./BaseRepository');
const {EncomendaItem, Produto, Encomenda} = require('../models');


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
    async findByEncomenda(encomendaId) {
        return await this.model.findAll({
            where: { encomenda_id: encomendaId },
            include: [{
                model: Produto,
                as:'produto',
                attributes: ['nome', 'preco']
            }]
        });
    }
    async buscarItensParaVendedor(lojaId) {
    return await this.model.findAll({
        include: [
            {
                model: Produto,
                as: 'produto',
                where: { loja_id: lojaId }, // O FILTRO MÁGICO AQUI
                attributes: ['nome']
            },
            {
                model: Encomenda, // Para o vendedor saber quem é o cliente e o status
                as: 'encomenda',
                attributes: ['id', 'status', 'createdAt']
            }
        ]
    });
}
async buscarVendasPorLoja(lojaId) {
        return await EncomendaItem.findAll({
            include: [
                {
                    model: Produto,
                    as: 'produto',
                    where: { loja_id: lojaId }, // Filtra apenas produtos daquela loja
                    attributes: ['nome', 'imagem']
                },
                {
                    model: Encomenda,
                    as: 'detalhes_pedido',
                    attributes: ['status', 'createdAt', 'usuario_id']
                }
            ],
            order: [[{ model: Encomenda, as: 'detalhes_pedido' }, 'createdAt', 'DESC']]
        });
    }
}
module.exports = EncomendaItemRepository;