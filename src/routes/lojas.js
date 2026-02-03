const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/lojaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, lojaController.create);
router.get('/', lojaController.index);
router.get('/:id', lojaController.show);
router.put('/:id', authMiddleware, lojaController.update);
router.delete('/:id', authMiddleware, lojaController.delete);

module.exports = router;
