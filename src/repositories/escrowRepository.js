class EscrowRepository {
  constructor(EscrowModel) {
    this.Escrow = EscrowModel;
  }

  create(data, options = {}) {
    return this.Escrow.create(data, options);
  }

  findByEncomendaId(encomendaId, options = {}) {
    return this.Escrow.findOne({
      where: { encomenda_id: encomendaId },
      ...options
    });
  }

  update(escrow, data, options = {}) {
    return escrow.update(data, options);
  }
}

module.exports = EscrowRepository;
