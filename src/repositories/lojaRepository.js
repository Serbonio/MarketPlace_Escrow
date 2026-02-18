const Loja = require('../models/Loja');
const baseRepository = require('./BaseRepository');

class LojaRepository extends baseRepository {
  constructor() {
    super(Loja);
    }
  // findAll agora aceita um objeto 'where' para filtros
  async findAll(filters = {}, options = {}) {
    return await this.model.findAll({ where: filters }, options);
  }


  async findByUsuarioId(usuario_id, options = {}) {
    return await this.model.findOne({ where: { usuario_id}, options});
  }
  
  // update retorna [quantidadeAfetada]
  async update(id, data, options = {}) {
    return await this.model.update(data, { where: { id }, options});
  }
}

module.exports = LojaRepository;