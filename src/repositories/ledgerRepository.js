class LedgerRepository {
  constructor(LedgerModel) {
    this.Ledger = LedgerModel;
  }

  create(data, options = {}) {
    return this.Ledger.create(data, options);
  }

  findByEntidade(entidadeTipo, entidadeId, options = {}) {
    return this.Ledger.findAll({
      where: {
        entidade_tipo: entidadeTipo,
        entidade_id: entidadeId
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  }

  findLastSaldo(entidadeTipo, entidadeId, options = {}) {
    return this.Ledger.findOne({
      where: {
        entidade_tipo: entidadeTipo,
        entidade_id: entidadeId
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  }
}

module.exports = LedgerRepository;
