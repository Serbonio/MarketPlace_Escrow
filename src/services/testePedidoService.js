// testPedidoService.js
const sequelize = require('../config/database');
const PedidoService = require('./pedidoService');

async function testarPedido() {
  try {
    // 1️⃣ Dados de teste: usuário e produtos do seed
    const usuario_id = 1; // id de um usuário do seed de teste
    const items = [
      { produto_id: 2, quantidade: 2 },
      { produto_id: 3, quantidade: 1 }
    ];

    // 2️⃣ Criar pedido
    const resultado = await PedidoService.PedidoService(usuario_id, items);

    console.log('✅ Pedido criado com sucesso:');
    console.log(JSON.stringify(resultado, null, 2));

  } catch (err) {
    console.error('❌ Erro ao criar pedido:', err.message);
  } finally {
    await sequelize.close(); // fecha a conexão
  }
}

testarPedido();
