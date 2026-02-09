const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.create);
router.post('/login', usuarioController.login);
router.get('/', usuarioController.index);
router.get('/:id', usuarioController.show);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;