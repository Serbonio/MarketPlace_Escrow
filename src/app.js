// // No seu arquivo principal do backend (ex: app.js ou server.js)
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

// Webhook
const routeWebhook = require('./services/external/appPay/webook/WebhookController')
const path = require('path');
const models = require('./models/index')

const app = express();

// Configuração explícita do CORS
app.use(cors({
    origin: '*', // Em produção, mude para a URL do seu front-end (ex: 'http://127.0.0.1:5500')
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use('/api', routes);
app.use(routeWebhook)

module.exports = app;