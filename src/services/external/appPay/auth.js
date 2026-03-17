require('dotenv').config();

let cachedToken = null;
let tokenExpiry = null;

async function getToken() {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    // ✅ Ver o que está nas variáveis de ambiente
    console.log('=== AppyPay Auth Debug ===');
    console.log('TOKEN_URL:', process.env.APP_PAY_TOKEN_URL);
    console.log('CLIENT_ID:', process.env.APP_PAY_CLIENT_ID);
    console.log('RESOURCE:', process.env.APP_PAY_RESOURCE);
    console.log('SECRET existe?', !!process.env.APP_PAY_CLIENT_SECRET);

    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.APP_PAY_CLIENT_ID,
        client_secret: process.env.APP_PAY_CLIENT_SECRET,
        resource: process.env.APP_PAY_RESOURCE
    });

    const response = await fetch(process.env.APP_PAY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    // ✅ Ver o status e o conteúdo bruto antes de fazer .json()
    console.log('Status da resposta:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    const rawText = await response.text();
    console.log('Resposta bruta:', rawText.substring(0, 300));

    // ✅ Só fazer parse se for JSON
    let data;
    try {
        data = JSON.parse(rawText);
    } catch (e) {
        throw new Error(`AppyPay token URL devolveu HTML. Status: ${response.status}. URL usado: ${process.env.APP_PAY_TOKEN_URL}`);
    }

    if (!data.access_token) {
        console.error('Resposta sem token:', data);
        throw new Error(`Sem access_token: ${JSON.stringify(data)}`);
    }

    cachedToken = data.access_token;
    tokenExpiry = Date.now() + parseInt(data.expires_in) * 1000;

    console.log('Token obtido com sucesso');
    return cachedToken;
}

module.exports = { getToken };