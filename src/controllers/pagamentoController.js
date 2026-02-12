const PagamentoService = require('../services/pagamento.pedidoService');
const pagamentoService = new PagamentoService();

class PagamentoController {
    async processarPagamento(req, res) {
        try {
            // Assume que o pagador_id vem da sessão/auth do usuário
            const { pedido_id } = req.body;
            const pagador_id = req.user.id; 

            const resultado = await pagamentoService.pagarPedido({ 
                pedido_id, 
                pagador_id 
            });

            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
module.exports = new PagamentoController();