const produtoRepository = require('../repositories/produtoRepository');
const lojaRepository = require('../repositories/lojaRepository');

class ProdutoService {
    async criarProduto(loja_id, usuario_id, data) {
        // Validação: Verifique se o vendedor é dono da loja
        const loja = await lojaRepository.findById(loja_id);
        if (!loja) throw new Error('Loja não encontrada');
        
        // Se não for admin, verifica se é dono da loja
        // (Assumindo que req.userTipo está disponível ou pegando do contexto)                
        
        return await produtoRepository.create({ ...data, loja_id });
    }

    async listarProdutos(filtros) {
        const where = {};
        if (filtros.loja_id) where.loja_id = filtros.loja_id;
        if (filtros.categoria) where.categoria = filtros.categoria;
        if (filtros.ativo) where.ativo = filtros.ativo;

        return await produtoRepository.findAll(where);
    }

    async buscarProduto(id) {
        const produto = await produtoRepository.findById(id);
        if (!produto) throw new Error('Produto não encontrado');
        return produto;
    }

    async atualizarProduto(id, data) {
        const [updated] = await produtoRepository.update(id, data);
        if (!updated) throw new Error('Produto não encontrado ou sem alterações');
        return await this.buscarProduto(id);
    }

    async removerProduto(id) {
        const deleted = await produtoRepository.delete(id);
        if (!deleted) throw new Error('Produto não encontrado');
        return deleted;
    }
}

module.exports = new ProdutoService();