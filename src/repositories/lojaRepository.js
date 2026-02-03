const Loja = require('../models/Loja');

class LojaRepository {

  create(data) {
    return Loja.create(data);
  }

  findAll() {
    return Loja.findAll();
  }

  findById(id) {
    return Loja.findByPk(id);
  }

  findByUsuario(usuario_id) {
    return Loja.findOne({ where: { usuario_id } });
  }

  update(id, data) {
    return Loja.update(data, { where: { id } });
  }

  delete(id) {
    return Loja.destroy({ where: { id } });
  }
}

module.exports = new LojaRepository();
