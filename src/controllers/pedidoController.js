// src/controllers/PedidoController.js
const pedidoService = require('../services/pedidoService');
const genericPedidoService = require('../services/genericPedidoService');
class PedidoController {

    async criarPedido(req, res) {
    try {
        // 1. Receber dados da requisição
        // O usuario_id idealmente vem do token (req.userId), mas mantive conforme sua lógica
        const { usuario_id, items, dadosCheckout } = req.body;
        console.log(usuario_id, items, dadosCheckout)
        console.log('Dados recebidos para processar checkout:', { 
            usuario_id, 
            total_items: items?.length,
            metodo: dadosCheckout?.metodo_pagamento 
        });

        // 2. Validação básica de entrada
        if (!usuario_id || !items || items.length === 0 || !dadosCheckout) {
            return res.status(400).json({ error: 'Dados de pedido ou entrega incompletos.' });
        }

        // Validação extra: garantir campos obrigatórios do snapshot de entrega
        const camposObrigatorios = ['nome_completo', 'telefone_contacto', 'provincia', 'cidade', 'endereco_completo', 'metodo_pagamento'];
        for (const campo of camposObrigatorios) {
            if (!dadosCheckout[campo]) {
                return res.status(400).json({ error: `O campo ${campo} é obrigatório para a entrega.` });
            }
        }

        // 3. Chamar o Service Maestro (processarCheckout)
        // Este service agora cuida da transação de criação e da lógica de pagamento
        const resultadoCheckout = await pedidoService.processarCheckout(
            usuario_id, 
            items, 
            dadosCheckout
        );

        // 4. Enviar resposta baseada no status do pagamento
        if (resultadoCheckout.sucesso) {
            return res.status(201).json({
                message: 'Pedido realizado e pago com sucesso!',
                ...resultadoCheckout
            });
        } else {
            // Caso o pagamento falhe, retornamos 202 (Accepted) ou 200 indicando que o pedido existe mas aguarda pagamento
            return res.status(202).json({
                message: 'Pedido registrado, mas o pagamento não foi processado.',
                ...resultadoCheckout
            });
        }

    } catch (error) {
        console.error('Erro no Controller de Pedido:', error);
        return res.status(500).json({ 
            error: error.message || 'Erro interno ao processar o checkout.' 
        });
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
    async listarPedidosUsuario(req,res){
       try{
        const usuario_id = req.params.id
        const pedidos= await genericPedidoService.listarPedidosUsuario(usuario_id);
        return res.status(200).json({pedidos})
       }catch(error) {
        console.error(error)
        return res.status(500).json({error:error.message||'Erro interno do servidor'})
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