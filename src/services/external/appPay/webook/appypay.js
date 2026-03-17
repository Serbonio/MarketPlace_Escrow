// webhook/appypay.js (Express.js)
const { where } = require('sequelize');
const {pagamentoRepo, pedidoRepo} = require('../../../../repositories/index')



async function processWebhook(payload) {
  console.log('Webhook recebido:', JSON.stringify(payload));
  console.log=payload;
  const { id, merchantTransactionId, responseStatus } = payload;

  // Verificar se é uma transacção sua
  const pagamento = await pagamentoRepo.findByMerchantTransactionId(merchantTransactionId)
  console.warn(pagamento.pedido_id);
  if (!pagamento) {
    console.warn('Transacção desconhecida:', merchantTransactionId);
    return;
  }

  // Evitar processar duplicados (idempotência)
  if (pagamento.pagamento_status === 'pago') {
    console.log('Já processado:', merchantTransactionId);
    return;
  }

  const isSuccess = responseStatus.successful &&
                    responseStatus.status === 'Success';

  if (isSuccess) {
    await pagamentoRepo.update(pagamento.id,
      {
        pagamento_status: 'pago',
        gateway_transaction_id: id,
        confirmed_at: new Date(),
        gateway_response: payload,
      },
    );

    // Disparar outras acções: email, activar serviço, etc.
    // await sendConfirmationEmail(order);
    // await activateService(order);

  } else {
    await pagamentoRepo.update(pagamento.id, 
      {
        pagamento_status: 'falhou',
        gateway_response: payload
      },
    );
    console.log(console.error(responseStatus.message))
  }
}

module.exports = {processWebhook};