// services/pagamentoService.js
const sequelize = require('../config/database');
const {
    pedidoRepo,
    encomendaRepo,
    transacaoRepo,
    escrowRepo,
    ledgerRepo
} = require('../repositories/index');

class PagamentoService {

    async pagarPedido({ pedido_id, pagador_id }) {
        
        // 1️⃣ Iniciar transação
        return await sequelize.transaction(async (t) => {

            // 2️⃣ Buscar pedido (com lock FOR UPDATE)
            const pedido = await pedidoRepo.findById(pedido_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!pedido) throw new Error('Pedido não encontrado');
            if (pedido.status !== 'criado') throw new Error('Pedido não pode ser pago');
            if (pedido.usuario_id !== pagador_id) throw new Error('Usuário não autorizado');

            // 4️⃣ Buscar encomendas do pedido (com lock)
            const encomendas = await encomendaRepo.findByPedidoId(pedido_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!encomendas || encomendas.length === 0) throw new Error('Pedido inválido (sem encomendas)');

            // 5️⃣ Calcular total do pedido (revalidação)
            const totalCalculado = encomendas.reduce((sum, e) => sum + parseFloat(e.total), 0);
            if (totalCalculado !== parseFloat(pedido.total)) {
                throw new Error('Inconsistência de valores entre pedido e encomendas');
            }

            // 7️⃣ Criar escrow e Transação por encomenda
            const escrowsCriados = [];

            for (const encomenda of encomendas) {
                // 6️⃣ Criar Transação de Pagamento para esta encomenda
                const transacaoPagamento = await transacaoRepo.create({
                    encomenda_id: encomenda.id, 
                    pedido_id: pedido.id,
                    tipo: 'pagamento',
                    valor: encomenda.total, 
                    status: 'confirmada'
                }, { transaction: t });

                // Criar Escrow
                const escrow = await escrowRepo.create({
                    encomenda_id: encomenda.id,
                    valor: encomenda.total,
                    status: 'ativo'
                }, { transaction: t });

                // 8️⃣ & 9️⃣ Criar ledger (débito/crédito) usando a transação específica
                // ... dentro do loop das encomendas no PagamentoService.js

                // 8️⃣ & 9️⃣ Criar ledger (débito/crédito)
                
                // 1. Calcular Saldo Resultante para o Usuário
                const saldoAnteriorUsuario = await ledgerRepo.calculateCurrentBalance(pagador_id, 'usuario', { transaction: t });
                const novoSaldoUsuario = parseFloat(saldoAnteriorUsuario) - parseFloat(encomenda.total);

                await ledgerRepo.create({
                    entidade_tipo: 'usuario',
                    entidade_id: pagador_id,
                    transacao_id: transacaoPagamento.id,
                    tipo: 'debito',
                    valor: encomenda.total,
                    saldo_resultante: novoSaldoUsuario // 💡 Enviando o saldo calculado
                }, { transaction: t });

                // 2. Calcular Saldo Resultante para o Sistema
                const saldoAnteriorSistema = await ledgerRepo.calculateCurrentBalance(null, 'sistema', { transaction: t });
                const novoSaldoSistema = parseFloat(saldoAnteriorSistema) + parseFloat(encomenda.total);

                await ledgerRepo.create({
                    entidade_tipo: 'sistema',
                    entidade_id: null,
                    transacao_id: transacaoPagamento.id,
                    tipo: 'credito',
                    valor: encomenda.total,
                    saldo_resultante: novoSaldoSistema // 💡 Enviando o saldo calculado
                }, { transaction: t });
                
// ...

                escrowsCriados.push({
                    encomenda_id: encomenda.id,
                    escrow_id: escrow.id,
                    valor: escrow.valor
                });
            } // 💡 Fim do loop das encomendas

            // 🔄 Atualizar status do Pedido (UMA VEZ)
            await pedidoRepo.update(pedido, { status: 'pago' }, { transaction: t });

            // 🔄 Atualizar status das Encomendas (DENTRO DO LOOP OU AQUI)
            for (const encomenda of encomendas) {
                await encomendaRepo.update(encomenda.id, { status: 'paga' }, { transaction: t });
            }

            // 🔐 COMMIT automático
            return {
                pedido_id: pedido.id,
                status: 'pago',
                escrows: escrowsCriados
            };
        });
    }
}

module.exports = PagamentoService;