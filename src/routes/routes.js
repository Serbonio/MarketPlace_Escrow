const express = require('express');
const router = express.Router();
// const authService = require('../services/authService');
const routesUsuarios = require('./usuarios');
const routesLojas = require('./lojas');
const routesProdutos = require('./produtoRoutes');
// const usuarioController = require('../controllers/usuarioController');


// Rotas usuarios
router.use('/usuarios', routesUsuarios);

// Rotas lojas
router.use('/lojas', routesLojas);

// Rotas produtos
router.use('/produtos', routesProdutos);

module.exports = router;
