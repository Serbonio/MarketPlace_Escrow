const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');

class UsuarioService {

  async criarUsuario(data) {
    const emailExiste = await usuarioRepository.findByEmail(data.email);
    if (emailExiste) {
      throw new Error('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    return usuarioRepository.create({
      ...data,
      senha: senhaHash,
    });
  }

  async validarLogin(email, senha) {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new Error('Email não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha incorreta');
    }

    return usuario;
  }


  listarUsuarios() {
    return usuarioRepository.findAll();
  }

  async buscarUsuario(id) {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async atualizarUsuario(id, data) {
    const usuario = await this.buscarUsuario(id);
    await usuario.update(data);
    return usuario;
  }

  async removerUsuario(id) {
    const usuario = await this.buscarUsuario(id);
    await usuario.destroy();
  }
}

module.exports = new UsuarioService();