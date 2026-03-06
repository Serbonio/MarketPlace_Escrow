const { produtoRepo, produtoImagemRepo, categoriaRepo } = require('../repositories/index');
const sequelize = require('../config/database'); 
const { Op} = require('sequelize');
const imagemService = require('./imagemService');

class ProdutoService {
    constructor() {
        // Usamos as instâncias já criadas no repositories/index.js
        this.produtoRepo = produtoRepo;
        this.imagemRepo = produtoImagemRepo;
        this.categoriaRepo= categoriaRepo;
    }
 // No ProdutoService.js
async criarProdutoCompleto(dados, imagensFormatadas) {
    const t = await sequelize.transaction();
    try {
        const produto = await this.produtoRepo.create(dados, { transaction: t });
        
        if (imagensFormatadas.length > 0) {
            // Adicione o produto_id em cada objeto de imagem
            const imgs = imagensFormatadas.map(img => ({
                ...img,
                produto_id: produto.id
            }));
            
            await this.imagemRepo.bulkCreate(imgs, { transaction: t });
        }
        
        await t.commit();
        return produto;
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

    // --- MÉTODOS DE BUSCA ---
    async listarProdutos(filtros) {
        const where = {};
        
        if (filtros.loja_id) where.loja_id = filtros.loja_id;
        if (filtros.categoria_id) where.categoria_id = filtros.categoria_id;
        if (filtros.status) where.status = filtros.status;
        
        if(filtros.condicao) where.condicao= filtros.condicao;
        if(filtros.busca) {
            where.nome = {[Op.like]: `%${filtros.busca}%`}
        }
        if(filtros.preco) {
            where.preco = {[Op.lte]:parseFloat(filtros.preco)};
        }

        // Agora com o mapeamento explícito para evitar erros de Alias
        const limit = parseInt(filtros.limite)||12
        const page = parseInt(filtros.page)||1
        const offset=(page-1)* limit;
        return await this.produtoRepo.findAll({
            where,
            limit,
            offset,
            include: [
                { association: 'imagens' },
                { association: 'categoria' }
            ]
        });
    }

    async buscarProduto(id) { 
        const produto = await this.produtoRepo.findFullDetails(id);
        if (!produto) throw new Error('Produto não encontrado');
        return produto;
    }

    async produtosDaLoja(loja_id){
               
        const produtos = await this.produtoRepo.produtosDaLoja(loja_id)
        if(!produtos) throw new Error('Produtos não encontrados')
        return produtos;
    }

    // ... outros métodos (atualizar, remover) permanecem iguais

    async actualizarProdutoCompleto(produto_id, dados, novasImagens) {
    const t = await sequelize.transaction();
    try {
        // 1. Atualiza os dados básicos do produto
        const [rowsAffected] = await this.produtoRepo.update(dados, {
            where: { id: produto_id },
            transaction: t
        });

        if (rowsAffected === 0) throw new Error('Produto não encontrado');

        // 2. Se houver novas imagens, adiciona-as
        if (novasImagens.length > 0) {
            const imgs = novasImagens.map(img => ({
                ...img,
                produto_id: produto_id
            }));
            await this.imagemRepo.bulkCreate(imgs, { transaction: t });
        }

        await t.commit();
        
        // Retorna o produto atualizado
        return await this.produtoRepo.findByPk(produto_id, { include: ['imagens'] });
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

    async removerProduto(produto_id){
        const produtoDeletado = await this.produtoRepo.delete(produto_id);
        if(!produtoDeletado) throw new Error ('Erro ao deletar produto');
        return produtoDeletado;
    }
    }


module.exports = new ProdutoService();