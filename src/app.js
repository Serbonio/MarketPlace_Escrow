// No seu arquivo principal do backend (ex: app.js ou server.js)
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

// Configuração explícita do CORS
app.use(cors({
    origin: '*', // Em produção, mude para a URL do seu front-end (ex: 'http://127.0.0.1:5500')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', routes);

module.exports = app;