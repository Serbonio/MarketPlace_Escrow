const usuarioService = require('../services/usuarioService');
const authService = require('../services/authService');

class UsuarioController {

  async create(req, res) {
    try {
      console.log('Dados recebidos para cadastro:', req.body); // Log dos dados recebidos
      const usuario = await usuarioService.criarUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });

    }
  }

  async login(req, res) {
      try {
        const { email, senha } = req.body;
        console.log('Dados recebidos para login:', req.body); // Log dos dados recebidos
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
        console.error({error:error.message})
        res.status(401).json({ error: error.message });
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

  async myPerfil(req,res){
    try {
      const usuario = await usuarioService.listarPerfil(req.usuario.id);
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
// Implementação do método update
  async update(req, res) {
    try {
      console.log(req.body)
      const usuario = await usuarioService.atualizarUsuario(
        req.params.id,
        req.body
      );
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async alterarSenha(req, res) {
    try {
      const { senha } = req.body;
      const usuarioId = req.params.id;
      console.log(usuarioId, senha);
      await usuarioService.atualizarSenha(usuarioId, senha);
      res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    } 
  }

  async actualizarStatus(req, res) {
    try {
      const { status } = req.body;  
      const { usuario, message } = await usuarioService.actualizarStatus(req.params.id, status);
      res.json({usuario, message});
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
