const {Usuario} = require('../models');
const baseRepository = require('./BaseRepository');

class UsuarioRepository extends baseRepository {
  constructor() {
    super(Usuario);
  };

  async findAll(filter={} ,options = {}) {
        return await this.model.findAll(filter,options);
    } 

  async findByEmail(email, options = {}) {
    return await this.model.findOne({ where: { email } }, options);
  }

}

module.exports = UsuarioRepository;
