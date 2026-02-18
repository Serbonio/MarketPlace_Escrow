const { tr } = require('@faker-js/faker');
const lojaService = require('../services/lojaService');

class LojaController {
  async create(req, res) {
    try {
      // Assumindo que você quer salvar qual usuário criou a loja
      // const dadosComUsuario = { ...req.body, usuario_id: req.userId };
      console.log('Dados recebidos para criar loja:', req.body);
      const loja = await lojaService.criarLoja(req.userId, req.body);
      res.status(201).json(loja);
      console.log('Loja criada com sucesso:', loja);
    } catch (error) {
      res.status(400).json({ error: error.message });

    }
  }

  async index(req, res) {
    try {
      // Recebe o status via query string (?status=ativa)
      const { status } = req.query;
      const lojas = await lojaService.listarLojas(status);
      res.json(lojas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const loja = await lojaService.buscarLoja(req.params.id);
      res.json(loja);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async lojaPorUsuarioID(req, res){
    try{
      const lojaUsuario = await lojaService.buscarLojaByUsuarioID(req.params.id)

      
      
      res.json(lojaUsuario
      );
    }catch (error){
      res.status(404).json({error: error.message})
    }
  }

  async update(req, res) {
    try {
      const usuario = { id: req.userId, tipo: req.userTipo };
      const loja = await lojaService.atualizarLoja(req.params.id, usuario, req.body);
      res.json(loja);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async alterarStatus(req, res) {
    try {
      const usuario = { id: req.userId, tipo: req.userTipo };
      const { status } = req.body;
      const loja = await lojaService.alterarStatusLoja(req.params.id, usuario, status);
      res.json(loja);
    } catch (error) {
      res.status(400).json({ error: error.message });
    } 
  } 

  async delete(req, res) {
    try {
      await lojaService.removerLoja(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new LojaController();