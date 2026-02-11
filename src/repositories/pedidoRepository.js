class PedidoRepository {
  constructor(PedidoModel) {
    this.Pedido = PedidoModel;
  }

  create(data, options = {}) {
    return this.Pedido.create(data, options);
  }

  findById(id, options = {}) {
    return this.Pedido.findByPk(id, options);
  }

  update(pedido, data, options = {}) {
    return pedido.update(data, options);
  }

  findByUsuarioId(usuarioId, options = {}) {
    return this.Pedido.findAll({
      where: { usuario_id: usuarioId },
      ...options
    });
  }
}

module.exports = PedidoRepository;
