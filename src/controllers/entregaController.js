// controllers/entregaController.js
const { json } = require('express');
const { confirmarEntregaPorQRCode, obterQRCodeEncomenda } = require('../services/entregaService');

class EntregaController {

    // Vendedor escaneia — POST /api/entregas/confirmar
    async confirmarEntrega(req, res) {
        try {
            const { token } = req.body;
            const lojaUserId = req.userId; // vem do middleware de auth

            if (!token) {
                return res.status(400).json({ error: 'Token do QR Code é obrigatório.' });
            }

            const resultado = await confirmarEntregaPorQRCode(token, lojaUserId);
            return res.status(200).json(resultado);

        } catch (error) {
            console.error('Erro ao confirmar entrega:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    // Cliente vê o QR Code — GET /api/entregas/qrcode/:encomendaId
    async obterQRCode(req, res) {
        try {
            const { encomendaId } = req.params;
            const usuarioId = req.userId;

            const resultado = await obterQRCodeEncomenda(encomendaId, usuarioId);
            return res.status(200).json(resultado);

        } catch (error) {
            console.error('Erro ao obter QR Code:', error);
            return res.status(403).json({ error: error.message });
        }
    }
}

module.exports = new EntregaController();