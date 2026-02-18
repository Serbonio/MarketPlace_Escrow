const encomendaRepository = require('../repositories/index').encomendaRepo;

async function listarEncomendas() {
    return await encomendaRepository.findAll();
}
async function listarEncomendasPorPedido(pedidoId) {
    return await encomendaRepository.findByPedidoId(pedidoId);
}
async function listarEncomendaPorId(id) {
    return await encomendaRepository.findById(id);
}
async function actualizarStatus(id, status) {
    return await encomendaRepository.update(id, {status});
}

module.exports = {
    listarEncomendas,
    listarEncomendasPorPedido,
    listarEncomendaPorId,
    actualizarStatus
}   