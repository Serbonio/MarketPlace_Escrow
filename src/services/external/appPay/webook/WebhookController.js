const express = require('express');
const router = express.Router();
const appypayService = require('./appypay')

const webhookAppyPay = async (req, res) => {
  // Responder 200 IMEDIATAMENTE — a AppyPay pode re-tentar se demorar
  res.status(200).json({ received: true });

  // Processar em background
  await appypayService.processWebhook(req.body).catch(console.error);
}

router.post('/webhook/appypay', webhookAppyPay);

module.exports = router;