const produtoService = require('../services/produtoService');

class ProdutoController {
    async create(req, res) {
        try {
            const { loja_id } = req.params; // Loja vem da URL
            const produto = await produtoService.criarProduto(loja_id, req.userId, req.body);
            res.status(201).json(produto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async index(req, res) {
        try {
            // Filtros via query string: ?loja_id=1&categoria=eletronicos
            const produtos = await produtoService.listarProdutos(req.query);
            res.json(produtos);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async show(req, res) {
        try {
            const produto = await produtoService.buscarProduto(req.params.id);
            res.json(produto);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const produto = await produtoService.atualizarProduto(req.params.id, req.body);
            res.json(produto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await produtoService.removerProduto(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ProdutoController();