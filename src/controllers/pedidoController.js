// src/controllers/PedidoController.js
const PedidoService = require('../services/pedidoService');
const pedidoService = new PedidoService(); // Instancia o service

class PedidoController {

    async criarPedido(req, res) {
        try {
            // 1. Receber dados da requisição (geralmente do corpo - body)
            const { usuario_id, itens } = req.body;
            console.log('Dados recebidos para criar pedido:', { usuario_id, itens });
            // 2. Validação básica de entrada
            if (!usuario_id || !itens) {
                return res.status(400).json({ error: 'Dados incompletos' });
            }

            // 3. Chamar o Service
            const pedidoCriado = await pedidoService.createPedido({ usuario_id, itens });

            // 4. Enviar resposta de sucesso (201 - Created)
            return res.status(201).json(pedidoCriado);

        } catch (error) {
            // Tratamento de erro centralizado
            console.error(error);
            return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }
}

module.exports = new PedidoController(); // Exporta a instância 