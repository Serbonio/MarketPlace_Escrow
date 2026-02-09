const express = require('express');
const router = express.Router();
// const authService = require('../services/authService');
const usuarioController = require('../controllers/usuarioController');


// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas protegidas
router.use('/usuarios', usuarioController);


module.exports = router;
