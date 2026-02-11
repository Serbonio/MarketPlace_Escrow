class EncomendaRepository {
  constructor(EncomendaModel) {
    this.Encomenda = EncomendaModel;
  }

  create(data, options = {}) {
    return this.Encomenda.create(data, options);
  }

  findById(id, options = {}) {
    return this.Encomenda.findByPk(id, options);
  }

  update(encomenda, data, options = {}) {
    return encomenda.update(data, options);
  }

  findByPedidoId(pedidoId, options = {}) {
    return this.Encomenda.findAll({
      where: { pedido_id: pedidoId },
      ...options
    });
  }
}

module.exports = EncomendaRepository;
