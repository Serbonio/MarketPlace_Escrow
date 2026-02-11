const pedidoRepository = require('../repositories/pedidoRepository');



class PedidoService {

  criarPedido(data) {
    const {usuario_id, encomenda_item} = data;
    if(!item || item.length===0) {
        throw new Error('O pedido deve conter pelo menos um item')
    }else if(item<0) {
        throw new Error('Quantidade de itens deve ser maior que zero')
    }


    // Buscar produtos com base nos produtos_id fornecidos 
    for(i in encomenda_item) {
        const produto = produtoRepository.findById(encomenda_item[i].produto_id);  
        if(!produto) {
            throw new Error(`Produto com id ${encomenda_item[i].produto_id} não encontrado`)
        }
    }


    // return pedidoRepository.create(data);
  }
}