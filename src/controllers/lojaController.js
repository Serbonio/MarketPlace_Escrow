const lojaService = require('../services/lojaService');

class LojaController {

  async create(req, res) {
    try {
      const loja = await lojaService.criarLoja(req.user.id, req.body);
      res.status(201).json(loja);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const lojas = await lojaService.listarLojas();
    res.json(lojas);
  }

  async show(req, res) {
    try {
      const loja = await lojaService.buscarLoja(req.params.id);
      res.json(loja);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const loja = await lojaService.atualizarLoja(
        req.params.id,
        req.user,
        req.body
      );
      res.json(loja);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await lojaService.removerLoja(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = new LojaController();
