// src/repositories/PedidoRepository.js
const BaseRepository = require('./BaseRepository');
const {Pedido, Produto, Encomenda, EncomendaItem} = require("../models")

class PedidoRepository extends BaseRepository {
    constructor() {
        super(Pedido);
    }

    async findByIds(id, options = {}) {
        return await this.findAll({
            where: { id: id },
            ...options
        });
    }
    async findByUsuarioIds(id, options = {}) {
        return await this.findAll({
            where: { usuario_id: id },
            include:[
                {
                    model: Encomenda,
                    as:"encomendas",
                    include:[
                        {
                            model: EncomendaItem,
                            as:"itens"
                        }
                    ]
                }
            ],
            ...options
        });
    }

    // Sobrescrevendo o update para aceitar a instância do objeto
    async update(pedidoOrId, data, options = {}) {
    if (typeof pedidoOrId === 'object' && pedidoOrId.update) {
        // Se for a instância completa do Sequelize
        return await pedidoOrId.update(data, options);
    }
    
    // Se for apenas o ID, usamos o model diretamente
    return await this.model.update(data, {
        where: { id: pedidoOrId },
        ...options
    });
}
}
module.exports = PedidoRepository;