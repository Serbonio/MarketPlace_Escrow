const pedidoRepository = require('../repositories/index').pedidoRepo;

async function listarPedidos(){
    return await pedidoRepository.findAll();
}
async function obterPedido(id){
    return await pedidoRepository.findById(id);
}
async function cancelarPedido(id,status){
    const pedido = await pedidoRepository.findById(id);
    return await pedido.update({status});
}

module.exports = {
    listarPedidos,
    obterPedido,
    cancelarPedido
};