const {UsuarioService} = require('../services/usuarioService');
// const usuarioService = new UsuarioService();
async function criarUsuario() {
    try {
        // Teste de criação de usuário
        const novoUsuario = {
            nome: 'Teste Usuário',
            email: 'teste@gmail.com',
            senha: 'senha123',
            telefone: '1234567890',
            status: 'ativo',
        };
        const resultadoCriacao = await usuarioService.criarUsuario(novoUsuario);
        console.log('Resultado da criação:', resultadoCriacao);
    } catch (error) {
        console.error('Erro durante os testes:', error.message);
    }
}
async function logarUsuario() {
    try {
        // Teste de login
        const email = 'celene@gmail.com';
        const senha = 'senha123';
        const resultadoLogin = await usuarioService.validarLogin(email, senha);
        console.log('Resultado do login:', resultadoLogin);
    } catch (error) {
        console.error('Erro durante os testes:', error.message);
    }
}

function trocarSenhaPara123456(){
    const bcrypt = require("bcrypt");
    console.log(bcrypt.hashSync("123456",10))
}


// logarUsuario();
trocarSenhaPara123456()