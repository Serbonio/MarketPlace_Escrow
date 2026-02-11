// testPedido.js

const PedidoService = require('../services/pedidoService')

async function testar() {
  const pedido = await PedidoService.criarPedido({
    compradorId: 1,
    produtoId: 10,
    quantidade: 2
  })

  await PedidoService.pagarPedido({
    pedidoId: pedido.id,
    metodoPagamento: 'MULTICAIXA',
    referencia: 'ABC123'
  })

  await PedidoService.liberarEscrow({
    pedidoId: pedido.id
  })

  console.log('Fluxo completo executado')
}

testar()
