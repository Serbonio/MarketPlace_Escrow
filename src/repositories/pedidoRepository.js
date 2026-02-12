// src/repositories/PedidoRepository.js
const BaseRepository = require('./BaseRepository');
const Pedido = require('../models/Pedido');

class PedidoRepository extends BaseRepository {
    constructor() {
        super(Pedido);
    }

    async findByIds(ids, options = {}) {
        return await this.findAll({
            where: { id: ids },
            ...options
        });
    }

    // Sobrescrevendo o update para aceitar a instância do objeto
    async update(pedido, data, options = {}) { // Agora espera a instância do pedido em vez do ID
        return await pedido.update(data, options);
    }
}
module.exports = PedidoRepository;