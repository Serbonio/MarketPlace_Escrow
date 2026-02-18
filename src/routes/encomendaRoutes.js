const encomendaController = require('../controllers/encomendaController');
const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermissions = require('../middlewares/permissionMiddleware');

router.use(authMiddleware);

router.get('/', checkPermissions('admin', 'vendedor'), encomendaController.listarEncomendas);
router.get('/pedido/:pedidoId', checkPermissions('admin', 'vendedor'), encomendaController.listarEncomendasPorPedido);
router.get('/:id', checkPermissions('admin', 'vendedor', 'cliente'), encomendaController.listarEncomendaPorId);
router.put('/:id/status', checkPermissions('admin', 'vendedor'), encomendaController.actualizarStatus);
