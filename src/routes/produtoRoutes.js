const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const produtoController = require('../controllers/produtoController');

// Listar produtos (público ou logado)
router.get('/', produtoController.index);
router.get('/:id', produtoController.show);

// Rotas protegidas
router.use(authMiddleware);

// Criar produto dentro de uma loja específica
router.post('/loja/:loja_id', checkPermission('vendedor', 'admin'), produtoController.create);

// Atualizar e deletar
router.put('/:id', checkPermission('vendedor', 'admin'), produtoController.update);
router.delete('/:id', checkPermission('admin'), produtoController.delete);

module.exports = router;