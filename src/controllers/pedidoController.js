// src/controllers/PedidoController.js
const PedidoService = require('../services/pedidoService');
const pedidoService = require('../repositories/index'); // Instancia o service
const genericPedidoService = require('../services/genericPedidoService');
class PedidoController {

    async criarPedido(req, res) {
        try {
            // 1. Receber dados da requisição (geralmente do corpo - body)
            const { usuario_id, items } = req.body;
            console.log('Dados recebidos para criar pedido:', { usuario_id, items });
            // 2. Validação básica de entrada
            if (!usuario_id || !items) {
                return res.status(400).json({ error: 'Dados incompletos' });
            }

            // 3. Chamar o Service
            const pedidoCriado = await pedidoService.createPedido({ usuario_id, items });

            // 4. Enviar resposta de sucesso (201 - Created)
            return res.status(201).json(pedidoCriado);

        } catch (error) {
            // Tratamento de erro centralizado
            console.error(error);
            return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }
    async listarPedidos(req, res) {
        try {
            const pedidos = await genericPedidoService.listarPedidos();
            return res.status(200).json(pedidos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }
    async obterPedidos(req, res) {
        try {
            const pedidos = await genericPedidoService.listarPedidos();
            return res.status(200).json(pedidos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }
    async cancelarPedido(req, res) {
        try {
            const { id } = req.params;
            const pedidoCancelado = await genericPedidoService.cancelarPedido(id, 'cancelado');
            return res.status(200).json(pedidoCancelado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }
}

module.exports = new PedidoController(); // Exporta a instância 