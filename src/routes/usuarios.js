const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const usuarioController = require('../controllers/usuarioController');

// // Rotas públicas
router.post('/cadastro', usuarioController.create);
router.post('/login', usuarioController.login);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas protegidas (apenas para administradores)
router.get('/me', usuarioController.myPerfil);
// router.put('/me', usuarioController.update);
router.put('/:id/status', checkPermission('admin'), usuarioController.actualizarStatus);
router.put('/me/:id', usuarioController.alterarSenha);
router.get('/',checkPermission('admin'), usuarioController.index);
router.get('/:id', checkPermission('admin','cliente'), usuarioController.show);
router.put('/:id', checkPermission('admin', 'cliente'),usuarioController.update);
router.put('/:id/status', checkPermission('admin'), usuarioController.actualizarStatus);
router.delete('/:id', checkPermission('admin'), usuarioController.delete);

module.exports = router;

// // Falta aplicar middlleware para filtrar as rotas de admin e usuário comum

// //Cuida do middleware de autenticação e autorização, 
// // garantindo que apenas usuários autenticados e com as permissões adequadas possam acessar certas rotas.
// //  Ele também define as rotas para operações relacionadas aos usuários, 
// // como cadastro, login, visualização de perfil, atualização de perfil, 
// // alteração de status e exclusão de usuários.