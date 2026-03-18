// services/stockService.js
const { produtoRepo } = require('../repositories/index');
const sequelize = require('../config/database');

/**
 * Verifica se há stock suficiente para todos os itens
 * Chamado ANTES de criar o pedido
 * Não altera nada — só lê
 */
async function validarStockParaPedido(items) {
    const produtoIds = items.map(i => i.produto_id);
    const produtos = await produtoRepo.findByIds(produtoIds);

    const erros = [];
    const validados = [];

    for (const item of items) {
        const produto = produtos.find(p => String(p.id) === String(item.produto_id));

        if (!produto) {
            erros.push({
                produto_id: item.produto_id,
                erro: 'Produto não encontrado'
            });
            continue;
        }

        if (produto.status !== 'ativo') {
            erros.push({
                produto_id: item.produto_id,
                nome: produto.nome,
                erro: 'Produto não está disponível'
            });
            continue;
        }

        if (produto.estoque < item.quantidade) {
            erros.push({
                produto_id: item.produto_id,
                nome: produto.nome,
                stockDisponivel: produto.estoque,
                quantidadePedida: item.quantidade,
                erro: `Stock insuficiente. Disponível: ${produto.estoque}, Pedido: ${item.quantidade}`
            });
            continue;
        }

        validados.push({ produto, quantidade: item.quantidade });
    }
    console.log(validados, erros)
    return { valido: erros.length === 0, erros, validados };
}

/**
 * Decrementa o stock de um produto com lock de linha
 * Chamado APÓS confirmação do pagamento
 * Retorna se conseguiu decrementar ou se o stock acabou
 */
async function decrementarStock(produtoId, quantidade, transaction) {
    // Lock UPDATE — impede que dois pagamentos simultâneos
    // leiam o mesmo stock ao mesmo tempo
    console.log(produtoId, quantidade)
    const produto = await produtoRepo.findById(produtoId, {
        lock: transaction.LOCK.UPDATE,
        transaction
    });
    if (!produto) {
        return {
            sucesso: false,
            motivo: 'Produto não encontrado',
            produto_id: produtoId
        };
    }

    // Verificar stock AGORA (pode ter mudado desde o pedido)
    if (produto.estoque < quantidade) {
        return {
            sucesso: false,
            motivo: 'Stock esgotado',
            produto_id: produtoId,
            nome: produto.nome,
            stockActual: produto.estoque,
            quantidadePedida: quantidade
        };
    }

    // Decrementar
    await produtoRepo.decrementEstoque(produtoId, quantidade, { transaction });
    await produto.reload({transaction});

    return {
        sucesso: true,
        produto_id: produtoId,
        nome: produto.nome,
        stockAnterior: produto.estoque + quantidade,
        stockActual: produto.estoque
    };
}

/**
 * Processa o decremento de todos os itens de uma encomenda
 * Dentro de uma transacção — se um falhar, reverte tudo
 */
async function processarStockEncomenda(itensEncomenda, transaction) {
    const resultados = [];
    const falhas = [];
    console.log(itensEncomenda)
    for (const item of itensEncomenda) {
        const resultado = await decrementarStock(
            item.produto_id,
            item.quantidade,
            transaction
        );
        console.log(resultado)

        if (resultado.sucesso) {
            resultados.push(resultado);
        } else {
            falhas.push(resultado);
        }
    }

    return {
        sucesso: falhas.length === 0,
        resultados,
        falhas
    };
}

module.exports = {
    validarStockParaPedido,
    decrementarStock,
    processarStockEncomenda
};