// src/services/vendedorService.js
const encomendaItemRepo = require('../repositories/encomendaItemRepository');

class VendedorService {
    async listarMinhasVendas(lojaId) {
        if (!lojaId) throw new Error("ID da loja é necessário");

        const vendas = await encomendaItemRepo.buscarVendasPorLoja(lojaId);

        return vendas.map(venda => {
            const v = venda.toJSON();
            return {
                item_id: v.id,
                pedido_id: v.encomenda_id,
                produto: v.produto.nome,
                imagem: v.produto.imagem,
                quantidade: v.quantidade,
                valor_receber: v.quantidade * v.preco_unitario,
                status_pagamento: v.detalhes_pedido.status, // Ex: 'pago'
                data: v.detalhes_pedido.createdAt
            };
        });
    }
}

module.exports = new VendedorService();