// src/services/encomendaItemService.js
const { encomendaItemRepo, produtoRepo } = require('../repositories/index');
class EncomendaItemService {
    
    /**
     * Lista todos os produtos de uma encomenda específica
     */
    async listarItensDaEncomenda(encomendaId) {
    if (!encomendaId) throw new Error("ID da encomenda é obrigatório");
    
    // Busca os itens (já com os produtos acoplados)
    const itens = await encomendaItemRepo.findByEncomenda(encomendaId);
    
    itens.map(item=>
        {const itemDetalhado = item.get({plain:true})
        return console.log(itemDetalhado)}
    )
    // Transformamos o array de instâncias em objetos puros
    return itens.map(item => {
        const itemPuro = item.get({ plain: true });
        return {
            id: itemPuro.id,
            produto_id: itemPuro.produto_id,
            // Como usamos o alias 'produto', o objeto vem dentro de .produto
            nome: itemPuro.produto ? itemPuro.produto.nome : "Produto não encontrado",
            // imagem: itemPuro.produto ? itemPuro.produto.imagem : null,
            quantidade: itemPuro.quantidade,
            preco_unitario: itemPuro.preco_unitario,
            subtotal: Number(itemPuro.quantidade) * Number(itemPuro.preco_unitario)
        };
    });
}

    /**
     * Verifica se há stock suficiente antes de confirmar (Uso interno no pedidoService)
     */
    async validarStock(items) {
        for (const item of items) {
            const produto = await produtoRepo.findById(item.produto_id);
            if (!produto || produto.stock < item.quantidade) {
                throw new Error(`Stock insuficiente para o produto: ${produto ? produto.nome : item.produto_id}`);
            }
        }
        return true;
    }
}

module.exports = new EncomendaItemService();