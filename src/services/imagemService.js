const  ProdutoImagem  = require('../models/ProdutoImagem');

class ImagemService {
    /**
     * @param {number} produto_id - ID do produto pai
     * @param {Array} arquivos - Array vindo do req.files do Multer
     * @param {Object} transaction - Instância de transação do Sequelize (opcional)
     */
    async salvarImagensProduto(produto_id, arquivos, transaction = null) {
        if (!arquivos || arquivos.length === 0) return [];

        const imagensDados = arquivos.map((file, index) => ({
            produto_id,
            url: `/uploads/${file.filename}`,
            ordem: index,
            principal: index === 0 // A primeira imagem vira a principal
        }));

        // bulkCreate insere múltiplos registros de uma vez só
        return await ProdutoImagem.bulkCreate(imagensDados, { transaction });
    }

    async excluirImagensPorProduto(produto_id, transaction = null) {
        return await ProdutoImagem.destroy({
            where: { produto_id },
            transaction
        });
    }
}

module.exports = new ImagemService();