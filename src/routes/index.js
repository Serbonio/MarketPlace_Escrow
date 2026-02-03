const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API online com Sequelize 🚀' });
});

router.use('/usuarios', require('./usuarios'));
router.use('/auth', require('./auth'));

module.exports = router;
