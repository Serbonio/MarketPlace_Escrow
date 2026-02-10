const lojaRepository = require('../repositories/lojaRepository');

class LojaService {

  async criarLoja(usuario_id, data) {
    console.log('Criando loja para usuário_id:', usuario_id);
    console.log('Dados da loja:', data);

    console.log('--- DEBUG SERVICE ---');
  console.log('Usuario ID recebido:', usuario_id);
  console.log('Tipo de dado do ID:', typeof usuario_id);
  console.log('Dados da loja:', data);
  console.log('---------------------');
  
    const lojaExiste = await lojaRepository.findByUsuarioId(usuario_id);
    if (lojaExiste) {
      throw new Error('Usuário já possui uma loja');
    }

    return lojaRepository.create({
      ...data,
      usuario_id,
    });
  }

  listarLojas(status) {
    const filters = {};
    if (status) {
      filters.status = status; // Ex: 'ativa', 'suspensa'
    }
    return lojaRepository.findAll(filters);
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