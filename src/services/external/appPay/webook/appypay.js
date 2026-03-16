// webhook/appypay.js (Express.js)
const express = require('express');
const router = express.Router();

router.post('/webhook/appypay', async (req, res) => {
  // Responder 200 IMEDIATAMENTE — a AppyPay pode re-tentar se demorar
  res.status(200).json({ received: true });

  // Processar em background
  processWebhook(req.body).catch(console.error);
});

async function processWebhook(payload) {
  console.log('Webhook recebido:', JSON.stringify(payload));

  const { id, merchantTransactionId, responseStatus } = payload;

  // Verificar se é uma transacção sua
  const order = await db.orders.findOne({
    where: { appypayMerchantId: merchantTransactionId }
  });

  if (!order) {
    console.warn('Transacção desconhecida:', merchantTransactionId);
    return;
  }

  // Evitar processar duplicados (idempotência)
  if (order.paymentStatus === 'paid') {
    console.log('Já processado:', merchantTransactionId);
    return;
  }

  const isSuccess = responseStatus.successful &&
                    responseStatus.status === 'Success';

  if (isSuccess) {
    await db.orders.update(
      {
        paymentStatus: 'paid',
        appypayTransactionId: id,
        paidAt: new Date()
      },
      { where: { id: order.id } }
    );

    // Disparar outras acções: email, activar serviço, etc.
    await sendConfirmationEmail(order);
    await activateService(order);

  } else {
    await db.orders.update(
      {
        paymentStatus: 'failed',
        paymentError: responseStatus.message
      },
      { where: { id: order.id } }
    );
  }
}

module.exports = router;