const express = require('express');
const router = express.Router();
const checkpermission = require('../middlewares/permissionMiddleware');
const criarPedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/',checkpermission('cliente'),criarPedidoController.criarPedido);
router.get('/', checkpermission('admin'), criarPedidoController.listarPedidos);
router.get('/cliente/:id',checkpermission('cliente'), criarPedidoController.listarPedidosUsuario);
router.put('/:id/cancel',checkpermission('cliente'), criarPedidoController.cancelarPedido);

module.exports = router;