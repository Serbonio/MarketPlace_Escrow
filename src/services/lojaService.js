const {lojaRepo}= require('../repositories/index');
const lojaRepository =lojaRepo; 
class LojaService {

  async criarLoja(usuario_id, data) {
    console.log('Criando loja com dados:', data, 'para usuário ID:', usuario_id);

    const lojaExiste = await lojaRepository.findByUsuarioId(usuario_id);
    // if (lojaExiste) {
    //   throw new Error('Usuário já possui uma loja');
    // }
    return lojaRepository.create({
      ...data,
      usuario_id,
    });
  }

  async listarLojas(status) {
    const filters = {};
    if (status) {
      filters.status = status; // Ex: 'ativa', 'suspensa'
    }
    return await lojaRepository.findAll(filters);
  }

  async buscarLoja(id) {
    const loja = await lojaRepository.findById(id);
    if (!loja) {
      throw new Error('Loja não encontrada');
    }
    return loja;
  }
// Funcao que busca loja com base no usuario
  async buscarLojaByUsuarioID(usuario_id){
    const loja = lojaRepository.findByUsuarioId(usuario_id);
    if(!loja){
        throw new Error("Precisa criar uma Loja")
      }
    return loja;
  }
  async DadosCompletosLoja(loja_id){
      const loja = lojaRepository.findLojaCompleta(loja_id)
      if(!loja) 
        throw new Error("Loja não encontrada")
      return loja
  }

  async atualizarLoja(id, usuario, data) {
    const loja = await this.buscarLoja(id);

    if (usuario.tipo !== 'admin' && loja.usuario_id !== usuario.id) {
      throw new Error('Sem permissão');
    }

    await loja.update(data);
    return loja;
  }

  async alterarStatusLoja(id, usuario, status) {
    const loja = await this.buscarLoja(id);
    const lojaAlterada = await this.atualizarLoja(id, usuario, { status });
    return lojaAlterada;
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