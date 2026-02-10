const Loja = require('../models/Loja');

class LojaRepository {
  create(data) {
    console.log('Dados recebidos no Repo:', data);
    return Loja.create(data);
  }

  // findAll agora aceita um objeto 'where' para filtros
  findAll(filters = {}) {
    return Loja.findAll({ where: filters });
  }

  findById(id) {
    return Loja.findByPk(id);
  }

  findByUsuarioId(usuario_id) {
    return Loja.findOne({ where: { usuario_id } });
  }
  
  // update retorna [quantidadeAfetada]
  async update(id, data) {
    return await Loja.update(data, { where: { id } });
  }

  delete(id) {
    return Loja.destroy({ where: { id } });
  }
}

module.exports = new LojaRepository();