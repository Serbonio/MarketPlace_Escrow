const usuarioService = require('../services/usuarioService');
const authService = require('../services/authService');

class AuthController {

  async register(req, res) {
    try {
      const usuario = await usuarioService.criarUsuario(req.body);
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await usuarioService.validarLogin(email, senha);
      const token = authService.gerarToken(usuario);

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
