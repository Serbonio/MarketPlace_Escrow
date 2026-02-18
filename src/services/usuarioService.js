const bcrypt = require('bcryptjs');

const {usuarioRepo} = require('../repositories/index');

class UsuarioService {

  async criarUsuario(data) {
    const emailExiste = await usuarioRepo.findByEmail(data.email);
    if (emailExiste) {
      throw new Error('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await usuarioRepo.create({
      ...data,
      senha: senhaHash,
    });
    const dadosUsuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      status: usuario.status,
      }
    return {dados:dadosUsuario, message: 'Usuário criado com sucesso'};
  }

  async validarLogin(email, senha) {
    const usuario = await usuarioRepo.findByEmail(email);
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
    return usuarioRepo.findAll();
  }

  async listarPerfil(id){
    const perfil = await usuarioRepo.findById(id);
    if (!perfil) {
      throw new Error('Usuário não encontrado');
    }
    const dadosPerfil = {
      id: perfil.id,
      nome: perfil.nome,
      email: perfil.email,
      telefone: perfil.telefone,
      status: perfil.status,
    }
    return dadosPerfil;
  }

  async buscarUsuario(id) {
    const usuario = await usuarioRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async atualizarUsuario(id, data) {
    console.log(id,data)
    const usuario = await this.buscarUsuario(id);
    const senhaHash = await bcrypt.hash(data.senha, 10)
    await usuario.update({...data, senha:senhaHash});
    return usuario;
  }

  async actualizarStatus(id, status) {
    const usuario = await this.buscarUsuario(id);
    await usuario.update({ status });
    
    const message = status==="ativo" ? "Usuário ativado com sucesso" : "Usuário desativado com sucesso";``
    return {usuario, message: message};
  }

  async atualizarSenha(id, novaSenha) {
    const usuario = await this.buscarUsuario(id);
    console.log(id, novaSenha);
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await usuario.update({ senha: senhaHash });
    return {message: 'Senha atualizada com sucesso'};
  }

  async removerUsuario(id) {
    const usuario = await this.buscarUsuario(id);
    await usuario.destroy();
  }
}

module.exports = new UsuarioService();