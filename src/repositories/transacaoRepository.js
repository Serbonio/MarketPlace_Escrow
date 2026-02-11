class TransacaoRepository {
  constructor(TransacaoModel) {
    this.Transacao = TransacaoModel;
  }

  create(data, options = {}) {
    return this.Transacao.create(data, options);
  }

  findById(id, options = {}) {
    return this.Transacao.findByPk(id, options);
  }

  findByEncomendaId(encomendaId, options = {}) {
    return this.Transacao.findAll({
      where: { encomenda_id: encomendaId },
      ...options
    });
  }

  update(transacao, data, options = {}) {
    return transacao.update(data, options);
  }
}

module.exports = TransacaoRepository;
