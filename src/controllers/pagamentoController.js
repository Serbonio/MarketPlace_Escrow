const PagamentoService = require('../services/pagamento.pedidoService');
const {initiatePayment, verificadorPagamento} = require('../services/pagamentoService')
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

    async pagarPedido(req, res){
        try {
            const { method, amount, orderId, phone, email } = req.body;

            const payment = await initiatePayment({
            method,   // 'REF' ou 'GPO'
            amount,
            orderId,
            phone,      // só necessário para GPO
            email,
        });

            // Para REF: devolver a referência para mostrar ao cliente
            // Para GPO: devolver que está pendente (cliente recebe push no telemóvel)
            res.json({
            success: true,
            pagamento: payment.id,
            status: payment.status,
            reference: payment.referencia_numero || null,
            entity: payment.referencia_entidade || null,
            dueDate: payment.referencia_validade || null
            });

        } catch (err) {
            console.error('Erro ao criar pagamento:', err);
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async verificarStatusPagamento (req, res) {
      try {
        const payment = await verificadorPagamento(req.params.paymentId);
    
        if (!payment) {
          return res.status(404).json({ error: 'Pagamento não encontrado' });
        }
    
        res.json({
          paymentId: payment.id,
          status: payment.pagamento_status,  // pending, paid, failed
          confirmedAt: payment.confirmed_at
        });
    
      } catch (err) {
        console.error({error:err})
        res.status(500).json({ error: err.message });
      }
    }
}
module.exports = new PagamentoController();