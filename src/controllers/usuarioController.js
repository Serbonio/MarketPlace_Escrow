const usuarioService = require('../services/usuarioService');

class UsuarioController {

  async create(req, res) {
    try {
      const usuario = await usuarioService.criarUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  }

  async show(req, res) {
    try {
      const usuario = await usuarioService.buscarUsuario(req.params.id);
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const usuario = await usuarioService.atualizarUsuario(
        req.params.id,
        req.body
      );
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await usuarioService.removerUsuario(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new UsuarioController();
