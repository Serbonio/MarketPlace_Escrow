const baseRepository = require('./BaseRepository');
const {Loja, Produto, Encomenda, EncomendaItem} = require('../models');


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
            //   {
            //       model: Produto,
            //       as:'produtos',
            //       // limit: 10,
            //       attributes: ['id', 'nome', 'preco', 'estoque'],
            //       limit: 10 // Opcional: buscar apenas os produtos mais recentes
            //   },
              {
                  model: Encomenda,
                  as:'encomendas',
                  
                  include: [
                      {
                          model: EncomendaItem,
                          as: 'itens',
                          include: [{ model: Produto, as: 'produto'}]
                      }
                  ]
              }
          ]
      });
  }

  
  
  
  // update retorna [quantidadeAfetada]
  async update(id, data, options = {}) {
    return await this.model.update(data, { where: { id }, options});
  }
}

module.exports = LojaRepository;