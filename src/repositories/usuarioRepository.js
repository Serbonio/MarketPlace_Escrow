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
  async updateUer(usuario_id, data, options={}){
    const {senha, ...dadosSeguros}=data;
    return await this.model.update(dadosSeguros,{
      where:{id:usuario_id }, 
      options
    })
  }

  async updatePassword(usuario_id, password, options={}){
    return await this.model.update(
      {senha:password}, 
      {
        where: {id:usuario_id}, 
        options
      })
  }
}

module.exports = UsuarioRepository;
