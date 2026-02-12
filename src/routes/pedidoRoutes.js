const express = require('express');
const router = express.Router();

const criarPedidoController = require('../controllers/pedidoController');

router.post('/', criarPedidoController.criarPedido);

module.exports = router;