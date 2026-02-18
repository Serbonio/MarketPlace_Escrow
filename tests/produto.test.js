const produtoService = require('../src/services/produtoService');
const produtoController = require('../src/controllers/produtoController');
describe('Testes para o serviço de produto',()=>{
    test('Deve listar os produtos', async()=>{
        const produtos = await produtoService.listarProdutos();
        expect(produtos).toBeDefined();
    }),
    test('Testa Controller listar produtos', async()=>{
        const req = {
            query: {}
        };
        const res = {
            json: jest.fn()
        };
        await produtoController.listarProdutos(req, res);
        expect(res.json).toHaveBeenCalled();
    }   )
});