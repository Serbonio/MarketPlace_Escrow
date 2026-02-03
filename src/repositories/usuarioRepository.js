const Usuario = require('../models/Usuario');

class UsuarioRepository {

  create(data) {
    return Usuario.create(data);
  }

  findAll() {
    return Usuario.findAll();
  }

  findById(id) {
    return Usuario.findByPk(id);
  }

  findByEmail(email) {
    return Usuario.findOne({ where: { email } });
  }

  update(id, data) {
    return Usuario.update(data, { where: { id } });
  }

  delete(id) {
    return Usuario.destroy({ where: { id } });
  }
}

module.exports = new UsuarioRepository();
