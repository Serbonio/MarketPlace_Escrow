// routes/entregaRoutes.js
const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');
const authMiddleware = require('../middlewares/authMiddleware')

// Cliente obtém o QR Code da sua encomenda
router.get('/qrcode/:encomendaId', authMiddleware,entregaController.obterQRCode);

// Vendedor confirma entrega após escanear
router.post('/qrcode/confirmar', authMiddleware, entregaController.confirmarEntrega);

module.exports = router;