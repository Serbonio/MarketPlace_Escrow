const lojaRepository = require('../repositories/lojaRepository');

class LojaService {

  async criarLoja(usuario_id, data) {
    const lojaExiste = await lojaRepository.findByUsuario(usuario_id);
    if (lojaExiste) {
      throw new Error('Usuário já possui uma loja');
    }

    return lojaRepository.create({
      ...data,
      usuario_id,
    });
  }

  listarLojas() {
    return lojaRepository.findAll();
  }

  async buscarLoja(id) {
    const loja = await lojaRepository.findById(id);
    if (!loja) {
      throw new Error('Loja não encontrada');
    }
    return loja;
  }

  async atualizarLoja(id, usuario, data) {
    const loja = await this.buscarLoja(id);

    if (usuario.tipo !== 'admin' && loja.usuario_id !== usuario.id) {
      throw new Error('Sem permissão');
    }

    await loja.update(data);
    return loja;
  }

  async removerLoja(id, usuario) {
    const loja = await this.buscarLoja(id);

    if (usuario.tipo !== 'admin' && loja.usuario_id !== usuario.id) {
      throw new Error('Sem permissão');
    }

    await loja.destroy();
  }
}

module.exports = new LojaService();
