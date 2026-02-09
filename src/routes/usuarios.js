const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const usuarioController = require('../controllers/usuarioController');

// Rotas públicas
router.post('/', usuarioController.create);
router.post('/login', usuarioController.login);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas protegidas (apenas para administradores)
router.get('/', usuarioController.index);
router.get('/:id', usuarioController.show);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;