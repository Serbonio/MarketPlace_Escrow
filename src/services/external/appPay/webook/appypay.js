// webhook/appypay.js (Express.js)
const {pagamentoRepo, pedidoRepo} = require('../../../../repositories/index')



async function processWebhook(payload) {
  console.log('Webhook recebido:', JSON.stringify(payload));

  const { id, merchantTransactionId, responseStatus } = payload;

  // Verificar se é uma transacção sua
  const pagamento = await pagamentoRepo.findByMerchantTransactionId(merchantTransactionId)

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
    await pagamentoRepo.update(
      {
        pagamento_status: isSuccess ? 'pago':"falhou",
        gateway_transaction_id: id,
        confirmed_at: new Date(),
        gateway_response: payload,
      },
      { where: { id: pagamento.id } }
    );

    // Disparar outras acções: email, activar serviço, etc.
    // await sendConfirmationEmail(order);
    // await activateService(order);

  } else {
    await pagamentoRepo.update(
      {
        pagamento_status: 'failed',
        gateway_response: payload
      },
      { where: { id: pagamento.id } }
    );
    console.log(console.error(responseStatus.message))
  }
}

module.exports = {processWebhook};