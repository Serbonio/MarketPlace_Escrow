// services/entregaService.js
const { encomendaRepo, pedidoRepo, escrowRepo } = require('../repositories/index');

/**
 * Chamado quando o vendedor/entregador escaneia o QR Code
 * 
 * @param token    — string lida no QR Code
 * @param lojaUserId — ID do utilizador da loja que está a escanear
 */
async function confirmarEntregaPorQRCode(token, lojaUserId) {

    // 1. Encontrar a encomenda pelo token
    const encomenda = await encomendaRepo.findOne({
        where: { delivery_token: token }
    });

    if (!encomenda) {
        throw new Error('QR Code inválido ou não encontrado.');
    }

    // 2. Verificar se a encomenda pertence à loja do utilizador
    const loja = await lojaRepo.findByUsuarioId(lojaUserId);

    if (!loja) {
        throw new Error('Utilizador não tem loja associada.');
    }

    if (String(encomenda.loja_id) !== String(loja.id)) {
        throw new Error('Este QR Code não pertence à sua loja.');
    }

    // 3. Verificar se ainda não foi entregue (evitar duplo scan)
    if (encomenda.status === 'entregue') {
        throw new Error('Esta encomenda já foi entregue anteriormente.');
    }

    if (encomenda.status === 'cancelada') {
        throw new Error('Esta encomenda foi cancelada.');
    }
 
    // 4. Verificar se o pedido pai está pago
    const pedido = await pedidoRepo.findById(encomenda.pedido_id);

    if (pedido.payment_status !== 'pago ') {
        throw new Error('O pagamento desta encomenda ainda não foi confirmado.');
    }

    // 5. Marcar como entregue
    await encomendaRepo.update(encomenda.id, {
        status: 'entregue',
        entregue_em: new Date(),
    });

    // 6. Liberar Escrow automaticamente após entrega confirmada
    const escrow = await escrowRepo.findByEncomendaId(encomenda.id);

    if (escrow && escrow.status === 'ativo') {
        await escrowRepo.update(escrow.id, {
            status: 'liberado'
        });
        // Registar movimento no ledger — crédito para a loja
        const transacao = await transacaoRepo.create({
            encomenda_id: encomenda.id,
            pedido_id: null,
            tipo_evento: 'liberacao_escrow',
            status: 'paga',
            valor: encomenda.total
        });

        await ledgerRepo.create({
            entidade_tipo: 'sistema',
            entidade_id: loja.id,
            transacao_id: transacao.id,
            tipo_movimento: 'debito',
            valor: encomenda.total
        });

        await ledgerRepo.create({
            entidade_tipo: 'loja',
            entidade_id: loja.id,
            transacao_id: transacao.id,
            tipo_movimento: 'credito',
            valor: encomenda.total
        });
    }

    // 7. Verificar se todas as encomendas do pedido foram entregues
    const { Op } = require('sequelize');
    const encomendasPendentes = await encomendaRepo.count({
        where: {
            pedido_id: encomenda.pedido_id,
            status: { [Op.not]: ['entregue', 'cancelada']}
        }
    });

    if (encomendasPendentes === 0) {
        await pedidoRepo.update(encomenda.pedido_id, { status: 'concluido' });
    }

    return {
        sucesso: true,
        mensagem: 'Entrega confirmada com sucesso!',
        encomendaId: encomenda.id,
        pedidoId: encomenda.pedido_id,
        escrowLiberado: !!escrow, 
        pedidoConcluido: encomendasPendentes===0
    };
}

/**
 * Retorna o QR Code para o cliente visualizar
 * Só o dono do pedido pode ver
 */
async function obterQRCodeEncomenda(encomendaId, usuarioId) {

    const encomenda = await encomendaRepo.findById(encomendaId);

    if (!encomenda) {
        throw new Error('Encomenda não encontrada.');
    }

    // Verificar que é o dono do pedido
    const pedido = await pedidoRepo.findById(encomenda.pedido_id);

    if (String(pedido.usuario_id) !== String(usuarioId)) {
        throw new Error('Não autorizado a ver este QR Code.');
    }

    // if (!encomenda.qr_code) {
    //     throw new Error('QR Code ainda não gerado.');
    // }

    return {
        encomendaId: encomenda.id,
        status: encomenda.status,
        token: encomenda.delivery_token
    };
}

module.exports = { confirmarEntregaPorQRCode, obterQRCodeEncomenda };