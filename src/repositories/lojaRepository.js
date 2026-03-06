const baseRepository = require('./BaseRepository');
const {Loja, Produto, Encomenda, EncomendaItem} = require('../models');


if (!Loja.associations.produtos) {
    Loja.hasMany(Produto, { foreignKey: 'loja_id', as: 'produtos' });
}
if (!Loja.associations.encomendas) {
    Loja.hasMany(Encomenda, { foreignKey: 'loja_id', as: 'encomendas' });
}
if (!Encomenda.associations.itens) {
    Encomenda.hasMany(EncomendaItem, { foreignKey: 'encomenda_id', as: 'itens' });
}
if (!EncomendaItem.associations.produto) {
    EncomendaItem.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });
}


class LojaRepository extends baseRepository {
  constructor() {
    super(Loja);
    }
  // findAll agora aceita um objeto 'where' para filtros
  async findAll(filters = {}, options = {}) {
    return await this.model.findAll({ where: filters }, options);
  }


  async findByUsuarioId(usuario_id, options = {}) {
    return await this.model.findOne({ where: {usuario_id}, options});
  }

  async findLojaCompleta(loja_id) {
      return await this.model.findOne({
          where: { id: loja_id },
          include: [
              {
                  model: Produto,
                  as:'produtos',
                  // limit: 10,
                  attributes: ['id', 'nome', 'preco', 'estoque'],
                  limit: 10 // Opcional: buscar apenas os produtos mais recentes
              },
              // {
              //     model: Encomenda,
              //     as:'encomendas',
              //     limit:20,
              //     include: [
              //         {
              //             model: EncomendaItem,
              //             as: 'itens',
              //             include: [{ model: Produto, as: 'produto'}]
              //         }
              //     ]
              // }
          ]
      });
  }

  
  
  
  // update retorna [quantidadeAfetada]
  async update(id, data, options = {}) {
    return await this.model.update(data, { where: { id }, options});
  }
}

module.exports = LojaRepository;