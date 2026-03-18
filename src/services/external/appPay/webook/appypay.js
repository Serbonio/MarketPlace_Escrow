// webhook/appypay.js (Express.js)
// appypay.js — webhook
const { pagamentoRepo, pedidoRepo, encomendaRepo } = require('../../../../repositories/index');
const { confirmarPagamentoPedido } = require('../../../pedidoService');

async function processWebhook(payload) {
    console.log('Webhook recebido:', JSON.stringify(payload));

    const { id, merchantTransactionId, responseStatus } = payload;

    const pagamento = await pagamentoRepo.findByMerchantTransactionId(merchantTransactionId);

    if (!pagamento) {
        console.warn('Transacção desconhecida:', merchantTransactionId);
        return;
    }

    if (pagamento.pagamento_status === 'pago') {
        console.log('Já processado:', merchantTransactionId);
        return;
    }

    const isSuccess = responseStatus.successful && responseStatus.status === 'Success';

    if (isSuccess) {
        // 1. Actualizar pagamento
        await pagamentoRepo.update(pagamento.id, {
            pagamento_status: 'pago',
            gateway_transaction_id: id,
            confirmed_at: new Date(),
            gateway_response: JSON.stringify(payload)
        });

        // 2. Buscar encomendas do pedido
        const encomendas = await encomendaRepo.findAll({
            where: { pedido_id: pagamento.pedido_id }
        });

        // 3. Buscar usuario_id do pedido
        const pedido = await pedidoRepo.findById(pagamento.pedido_id);

        // 4. ✅ Confirmar pagamento — cria transações, ledger, escrow
        console.log(
          pagamento.pedido_id, 
          encomendas, 
          pedido.usuario_id)

        await confirmarPagamentoPedido(
            pagamento.pedido_id,
            encomendas,
            pedido.usuario_id
          );

        console.log('✅ Pagamento confirmado:', merchantTransactionId);

    } else {
        await pagamentoRepo.update(pagamento.id, {
            pagamento_status: 'falhou',
            gateway_response: JSON.stringify(payload)
        });

        console.log('❌ Pagamento falhado:', merchantTransactionId);
    }
}

module.exports = { processWebhook };
// ```

// ---

// ## Fluxo completo
// ```
// POST /api/checkout
//   → registrarPedidoCompleto() — cria pedido + encomendas
//   → initiatePayment() — chama AppyPay
//   → retorna ao cliente com referência (REF) ou instrução (GPO)

// Cliente paga no ATM ou aprova no telemóvel
//   → AppyPay chama POST /webhook/appypay
//   → processWebhook() — actualiza pagamento
//   → confirmarPagamentoPedido() — cria transações + ledger + escrow
//   → pedido fica com status 'pago'
