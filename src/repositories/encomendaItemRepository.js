class EncomendaItemRepository {
  constructor(EncomendaItemModel) {
    this.EncomendaItem = EncomendaItemModel;
  }

  bulkCreate(items, options = {}) {
    return this.EncomendaItem.bulkCreate(items, options);
  }

  findByEncomendaId(encomendaId, options = {}) {
    return this.EncomendaItem.findAll({
      where: { encomenda_id: encomendaId },
      ...options
    });
  }
}

module.exports = EncomendaItemRepository;
