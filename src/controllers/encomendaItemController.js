const encomendaItemService = require('../services/encomendaItemService')

async function getDetalhes(req ,res){
    try {
        const itens = await encomendaItemService.listarItensDaEncomenda(req.params.id);
        res.json({ sucesso: true, itens });
    } catch (error) {
        res.status(400).json({ sucesso: false, erro: error.message });
    }
}

module.exports= {getDetalhes};