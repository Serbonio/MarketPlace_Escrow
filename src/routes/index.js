const express = require('express');
const router = express.Router();

router.use('/usuarios', require('./usuarios'));
router.use('/auth', require('./auth'));

module.exports = router;
