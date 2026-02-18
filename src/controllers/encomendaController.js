const encomendaService = require('../services/encomendaService');

async function listarEncomendas(req, res) {
    try {
        const encomendas = await encomendaService.listarEncomendas();
        res.json(encomendas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar encomendas' });
    }  
}

async function listarEncomendasPorPedido(req, res) {
    try {
        const pedidoId = req.params.pedidoId;
        const encomendas = await encomendaService.listarEncomendasPorPedido(pedidoId);
        res.json(encomendas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar encomendas por pedido' });
    }   
}

async function listarEncomendaPorId(req, res) {
    try {
        const id = req.params.id;
        const encomenda = await encomendaService.listarEncomendaPorId(id);
        if (encomenda) {
            res.json(encomenda);
        } else {
            res.status(404).json({ error: 'Encomenda não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar encomenda por ID' });
    }
}

async function actualizarStatus(req, res) {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const updatedEncomenda = await encomendaService.actualizarStatus(id, status);
        if (updatedEncomenda) {
            res.json(updatedEncomenda);
        } else {
            res.status(404).json({ error: 'Encomenda não encontrada para atualização' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status da encomenda' });
    }       
}

module.exports = {
    listarEncomendas,
    listarEncomendasPorPedido,
    listarEncomendaPorId,
    actualizarStatus
}