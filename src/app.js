const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const corsOptions = {
  origin: 'http://127.0.0.1/:5500', // Ajuste para o domínio do frontend
  optionsSuccessStatus: 200,
};
app.use(cors());
app.use(express.json());
app.use('/api', routes);

module.exports = app;
