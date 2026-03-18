// services/qrCodeService.js
const crypto = require('crypto');
const QRCode = require('qrcode');

const SECRET_KEY = process.env.QR_SECRET_KEY || 'chave-secreta-forte-aqui';

/**
 * Gera um token único para uma encomenda
 * O token é um HMAC-SHA256 dos dados da encomenda
 */
function gerarDeliveryToken(encomendaId, lojaId, usuarioId) {
    // Dados que compõem o token
    console.log(encomendaId, lojaId, usuarioId)
    const payload = `${encomendaId}-${lojaId}-${usuarioId}-${Date.now()}`;

    // HMAC garante unicidade + impossibilidade de falsificação
    const token = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(payload)
        .digest('hex');

    return token;
}

/**
 * Gera a imagem do QR Code em Base64
 * O QR contém apenas o token — nenhuma info sensível visível
 */
async function gerarQRCode(token) {
    try {
        // Retorna Base64 da imagem PNG
        const qrCodeBase64 = await QRCode.toDataURL(token, {
            errorCorrectionLevel: 'H', // Alta tolerância a erros
            type: 'image/png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        return qrCodeBase64;
    } catch (error) {
        throw new Error(`Erro ao gerar QR Code: ${error.message}`);
    }
}

/**
 * Gera token + QR Code juntos
 */
async function gerarTokenEQRCode(encomendaId, lojaId, usuarioId) {
    const token = gerarDeliveryToken(encomendaId, lojaId, usuarioId);
    const qrCode = await gerarQRCode(token);

    return { token, qrCode };
}

module.exports = { gerarDeliveryToken, gerarQRCode, gerarTokenEQRCode };