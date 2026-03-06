// src/services/CategoriaService.js
const CategoriaRepository = require('../repositories/categoriaRepository');
const slugify = require('slugify'); // biblioteca comum: npm install slugify

class CategoriaService {
    constructor() {
        this.categoriaRepo = new CategoriaRepository();
    }

    async criarCategoria(dados) {
        // Gerar slug automático se não enviado
        if (!dados.slug) {
            dados.slug = slugify(dados.nome, { lower: true });
        }

        // Verificar se já existe slug igual
        const existente = await this.categoriaRepo.findBySlug(dados.slug);
        if (existente) throw new Error('Já existe uma categoria com este slug');

        return await this.categoriaRepo.create(dados);
    }

    async getArvoreCategorias() {
        return await this.categoriaRepo.findTree();
    }
}

module.exports = new CategoriaService();