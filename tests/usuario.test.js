const usuario = require('../src/services/usuarioService');
const usuarioController = require('../src/controllers/usuarioController');
describe('Testes para o serviço de usuario',()=>{

    test('Deve listar os usuarios', async()=>{
        const usuarios = await usuario.listarUsuarios();
        expect(usuarios).toBeDefined();
    }),
    test('Deve permitir actualizar o perfil do usuario', async()=>{
        const id = 54; // ID do usuário a ser atualizado
        const data = {
            nome: 'Booka',
            email: 'serboniocassio05@gmail.com',
            telefone: '919 999 999',
            status: 'ativo'};
        const usuarioAtualizado = await usuario.atualizarUsuario(id, data);
        expect(usuarioAtualizado).toBeDefined();
        expect(usuarioAtualizado.nome).toBe(data.nome);
        expect(usuarioAtualizado.email).toBe(data.email);
        expect(usuarioAtualizado.telefone).toBe(data.telefone);
        // expect(usuarioAtualizado.status).toBe(data.status);
    });
})
describe('Testes para o controller de usuario',()=>{
    test('Teste para actualizar o perfil do usuario', async()=>{
        const req = {
            userId: 54, // ID do usuário a ser atualizado
            body: {
                nome: 'Booka',
                email: 'serboniocassio05@gmail.com',
                telefone: '919 999 999',
                status: 'ativo' 
            }
        };
        const res = {
            json: jest.fn()
        };
        await usuarioController.update(req, res);
        expect(res.json).toHaveBeenCalled();
    });
})