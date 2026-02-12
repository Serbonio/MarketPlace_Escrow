const PagamentoService = require('./pagamento.pedidoService');
const sequelize = require('../config/database');

const pagamentoService = new PagamentoService();

async function rodarTeste() {
    try {
        console.log('Iniciando pagamento...');
        
        const resultado = await pagamentoService.pagarPedido({
            pedido_id: 6, // ID existente no seu banco
            pagador_id: 1 // ID do usuário que fez o pedido
        });

        console.log('✅ Pagamento realizado:', resultado);
    } catch (error) {
        console.error('❌ Erro no pagamento:', error.message);
    } finally {
        await sequelize.close();
    }
}

rodarTeste();