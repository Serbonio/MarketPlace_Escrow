const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const lojaController = require('../controllers/lojaController');

router.get('/', lojaController.index); // Qualquer usuário logado pode listar
router.get('/:id',lojaController.show); // Qualquer usuário logado pode ver detalhes

// Aplicar autenticação para todas as rotas de loja
router.use(authMiddleware);

// Rotas
router.get("/usuarios/loja/:id", checkPermission('vendedor', 'admin'), lojaController.lojaPorUsuarioID)
router.post('/', checkPermission('vendedor', 'admin'), lojaController.create);
router.put('/:id', checkPermission('vendedor', 'admin'), lojaController.update);
router.patch('/:id/status', checkPermission('admin'), lojaController.alterarStatus);
router.delete('/:id', checkPermission('admin'), lojaController.delete);

module.exports = router;