// // Importe os modelos
// const Produto = require('../src/models/Produto');
// const Categoria = require('../src/models/Categoria');
// const ProdutoImagem = require('../src/models/ProdutoImagem');
// const Loja = require('../src/models/Loja');
// const Usuario = require('../src/models/Usuario');

// // FORÇAR ASSOCIAÇÕES (O pulo do gato 🐱)
// const models = { Produto, Categoria, ProdutoImagem, Loja, Usuario };

// Object.keys(models).forEach(modelName => {
//     if (models[modelName].associate) {
//         models[modelName].associate(models);
//     }
// });// Dica: Se você tiver um models/index.js, use: const { Loja, Usuario } = require('../src/models');

// describe('🚀 Testes de Fluxo Marketplace', () => {
    
//     // Limpeza rápida antes de começar
//     // No seu tests/integration.test.js
// beforeAll(async () => {
//     // Desativa a verificação de chaves estrangeiras para limpar tudo sem erros
//     await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
//     await sequelize.sync({ force: true });
//     await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
// });
//     afterAll(async () => {
//         await sequelize.close();
//     });

//  test('Deve completar o ciclo: Criar Usuario, Loja, Categoria e Produto', async () => {
//     // 1. Criar Usuário (Dono da Loja)
//     // Supondo que sua Loja pertença a um Usuário
//     const usuario = await sequelize.models.Usuario.create({
//         nome: 'Dono da Loja',
//         email: 'dono@teste.com',
//         senha: '123' // Use os campos reais do seu model Usuario
//     });

//     // 2. Criar Loja vinculada ao Usuário
//     const loja = await sequelize.models.Loja.create({
//         usuario_id: usuario.id,
//         nome: 'Minha Loja de Teste',
//         slug: 'minha-loja-teste',
//         status: 'ativo'
//     });

//     // 3. Criar Categoria
//     const categoria = await CategoriaService.criarCategoria({
//         nome: 'Eletrônicos',
//         slug: 'eletronicos'
//     });

//     // 4. Criar Produto (Agora todas as FKs existem!)
//     const dadosProd = {
//         loja_id: loja.id,
//         categoria_id: categoria.id,
//         nome: 'Smartphone Pro',
//         preco: 2500.00,
//         sku: 'SM-PRO-001',
//         status: 'ativo',
//         visibilidade: 'publico'
//     };

//     const imagens = [
//         { url: 'capa.jpg', principal: true }
//     ];

//     const produto = await ProdutoService.criarProdutoCompleto(dadosProd, imagens);

//     // Validações Finais
//     expect(produto.id).toBeDefined();
//     expect(produto.loja_id).toBe(loja.id);
//     expect(produto.imagens[0].url).toBe('capa.jpg');
//     expect(produto.categoria.nome).toBe('Eletrônicos');
// });

//     test('Deve falhar ao criar SKU duplicado (Validação de Regra)', async () => {
//         const dadosDuplicados = { loja_id: 1, nome: 'Clone', preco: 10, sku: 'SM-PRO-001' };
        
//         await expect(
//             ProdutoService.criarProdutoCompleto(dadosDuplicados, [])
//         ).rejects.toThrow();
//     });
// });