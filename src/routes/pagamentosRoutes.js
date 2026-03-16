// routes/payments.js
const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

// Frontend chama este endpoint quando cliente clica "Pagar"
router.post('/pay', pagamentoController.pagarPedido);

// Frontend consulta este endpoint para saber se já foi pago
router.get('/pay/status/:paymentId', pagamentoController.verificarStatusPagamento);

module.exports = router;