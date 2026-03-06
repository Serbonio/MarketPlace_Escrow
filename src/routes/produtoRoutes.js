const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const produtoController = require('../controllers/produtoController');
const upload = require('../config/multer');
const lojaController = require('../controllers/lojaController');

// --- ROTAS PÚBLICAS ---
// Qualquer visitante pode ver a vitrine
router.get('/', produtoController.index);
router.get('/:id', produtoController.show);

// --- ROTAS PROTEGIDAS ---
router.use(authMiddleware);

// Criar produto: Vinculado à loja do vendedor
// O front-end deve enviar o ID da loja na URL: /produtos/loja/5/produtos
router.post('/loja/:loja_id/produtos', checkPermission('vendedor', 'admin'), upload.array('imagens', 10), produtoController.create);

router.get(`/loja/:loja_id`, produtoController.produtosDaLoja)

// Atualizar dados do produto
router.put('/:id', checkPermission('vendedor', 'admin'), upload.array('imagens', 10),produtoController.update);

// Alterar status (Ativar/Inativar/Pausar)
// Mantive o método put por ser uma alteração de estado
router.put('/:id/status', checkPermission('vendedor', 'admin'), produtoController.alterarStatus);

// Deletar produto
router.delete('/:id', checkPermission('vendedor', 'admin'), produtoController.delete);

module.exports = router;