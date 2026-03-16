const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const routesUsuarios = require('./usuarios');
const routesLojas = require('./lojas');
const routesProdutos = require('./produtoRoutes');
const criarPedidoRoutes = require('./pedidoRoutes');
const routesEncomendas = require('./encomendaRoutes')
const routesEncomendasItem = require('./encomendaItemRoutes')
const routesEscrow = require('./escrowRoutes')
const routeWebhook = require('../services/external/appPay/webook/appypay')
// // Rotas usuarios
router.use('/usuarios', routesUsuarios);

// Rotas lojas
router.use('/lojas', routesLojas);

// Rotas produtos
router.use('/produtos', routesProdutos);

// Rotas pedidos
router.use('/pedidos', criarPedidoRoutes);

// Rotas encomendas
router.use('/encomendas', routesEncomendas)

// Rotas encomendaItem
router.use('/encomendaItem', routesEncomendasItem)

// Rotas Escrow 
router.use("/escrow", routesEscrow)

module.exports = router;
