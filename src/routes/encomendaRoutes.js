const encomendaController = require('../controllers/encomendaController');
const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermissions = require('../middlewares/permissionMiddleware');

router.use(authMiddleware);

router.get('/', checkPermissions('admin', 'vendedor','cliente'), encomendaController.listarEncomendas);
router.get('/pedido/:pedidoId', checkPermissions('admin', 'vendedor', 'cliente'), encomendaController.listarEncomendasPorPedido);
router.get('/:id', checkPermissions('admin', 'vendedor', 'cliente'), encomendaController.listarEncomendaPorId);
router.put('/:id/status', checkPermissions('admin', 'vendedor'), encomendaController.actualizarStatus);

module.exports= router;