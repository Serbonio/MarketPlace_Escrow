// services/escrowService.js
const sequelize = require('../config/database');
const {
    encomendaRepo,
    pedidoRepo,
    escrowRepo,
    transacaoRepo,
    ledgerRepo
} = require('../repositories/index');

class EscrowService {

    /**
     * Libera o dinheiro do escrow da loja para a loja
     * @param {Object} input
     * @param {number} input.encomenda_id
     * @param {number} input.confirmado_por - usuario_id que está confirmando
     */
    async liberarEscrow({ encomenda_id, confirmado_por }) {
        
        // 1️⃣ Iniciar transação
        return await sequelize.transaction(async (t) => {

            // 2️⃣ Buscar encomenda (com lock)
            const encomenda = await encomendaRepo.findById(encomenda_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!encomenda) throw new Error('Encomenda não encontrada');
            if (encomenda.status !== 'paga') throw new Error('Encomenda não está pronta para liberação');

            // 3️⃣ Validar quem confirma
            const pedido = await pedidoRepo.findById(encomenda.pedido_id, { transaction: t });
            if (pedido.usuario_id !== confirmado_por) {
                throw new Error('Usuário não autorizado a liberar este escrow');
            }

            // 4️⃣ Buscar escrow (lock)
            const escrow = await escrowRepo.findByEncomendaId(encomenda_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!escrow) throw new Error('Escrow inexistente');
            if (escrow.status !== 'ativo') throw new Error('Escrow não pode ser liberado');

            // 5️⃣ Criar transação de liberação
            const transacaoLiberacao = await transacaoRepo.create({
                encomenda_id: encomenda.id,
                tipo: 'liberacao',
                valor: escrow.valor,
                status: 'confirmada'
            }, { transaction: t });

            // 6️⃣ Ledger — débito do sistema
            const saldoAnteriorSistema = await ledgerRepo.calculateCurrentBalance(null, 'sistema', { transaction: t });
            const novoSaldoSistema = parseFloat(saldoAnteriorSistema) - parseFloat(escrow.valor);

            await ledgerRepo.create({
                entidade_tipo: 'sistema',
                entidade_id: null,
                transacao_id: transacaoLiberacao.id,
                tipo: 'debito',
                valor: escrow.valor,
                saldo_resultante: novoSaldoSistema
            }, { transaction: t });

            // 7️⃣ Ledger — crédito da loja
            const saldoAnteriorLoja = await ledgerRepo.calculateCurrentBalance(encomenda.loja_id, 'loja', { transaction: t });
            const novoSaldoLoja = parseFloat(saldoAnteriorLoja) + parseFloat(escrow.valor);

            await ledgerRepo.create({
                entidade_tipo: 'loja',
                entidade_id: encomenda.loja_id,
                transacao_id: transacaoLiberacao.id,
                tipo: 'credito',
                valor: escrow.valor,
                saldo_resultante: novoSaldoLoja
            }, { transaction: t });

            // 8️⃣ Atualizar estados
            await escrowRepo.update(escrow.id, { status: 'liberado' }, { transaction: t });
            await encomendaRepo.update(encomenda.id, { status: 'concluida' }, { transaction: t });

            // 9️⃣ Verificar se o pedido pode ser fechado
            const encomendasPendentes = await encomendaRepo.count({
                where: {
                    pedido_id: encomenda.pedido_id,
                    status: { [require('sequelize').Op.not]: 'concluida' }
                },
                transaction: t
            });

            if (encomendasPendentes === 0) {
                await pedidoRepo.update(pedido, { status: 'concluido' }, { transaction: t });
            } else {
                await pedidoRepo.update(pedido, { status: 'parcialmente_concluido' }, { transaction: t });
            }

            // 🔐 COMMIT (automático pela transaction managed)
            return {
                encomenda_id: encomenda.id,
                escrow_id: escrow.id,
                loja_id: encomenda.loja_id,
                valor_liberado: escrow.valor,
                status: 'liberado'
            };
        });
    }
}

module.exports = EscrowService;