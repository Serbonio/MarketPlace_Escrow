const {apiCall} = require('../client')

// payments/ref.js

const REF_PAYMENT_METHOD = `REF_${process.env.APPY_PAY_REF_APP_KEY}`;

async function createREFCharge({ amount, orderId, customerPhone, customerEmail }) {
  const merchantTransactionId = `R${orderId}${Date.now().toString().slice(-6)}`;

  // OPÇÃO A: Deixar o gateway gerar a referência (recomendado)
  const body = {
    amount,
    currency: 'AOA',
    description: `Pedido ${orderId}`,
    merchantTransactionId,
    paymentMethod: REF_PAYMENT_METHOD,
    // sem paymentInfo = gateway gera a referência automaticamente
    notify: {
      name: 'Cliente',
      telephone: customerPhone,   // SMS com referência
      email: customerEmail,       // Email com referência
      smsNotification: false,
      emailNotification: false
    }
  };

   // ✅ Log para ver o que está a ser enviado
  console.log('=== REF Charge Request ===');
  console.log('REF_PAYMENT_METHOD:', REF_PAYMENT_METHOD);
  console.log('Body enviado:', JSON.stringify(body, null, 2));

  // OPÇÃO B: Você define a referência (deve ser única, 9-15 dígitos)
  // body.paymentInfo = {
  //   referenceNumber: "123456789",
  //   dueDate: "2024-12-31T23:59:59"
  // };

  const { status, data } = await apiCall('POST', '/charges', body, false);
   // ✅ Log para ver o que a AppyPay respondeu
  console.log('=== REF Charge Response ===');
  console.log('Status HTTP:', status);
  console.log('Resposta completa:', JSON.stringify(data, null, 2));

  if ((status === 200 || status===202) && data.responseStatus.successful) {
    const ref = data.responseStatus.reference;
    return {
      success: true,
      transactionId: data.id,
      merchantTransactionId,
      reference: ref.referenceNumber, // ex: "123456789"
      entity: ref.entity,             // ex: "00348"
      dueDate: ref.dueDate,
      status: 'pendente' // cliente ainda não pagou
    };
  }
 const errorMsg = data.responseStatus?.message || data.error_description || JSON.stringify(data);
  console.error('Erro AppyPay:', errorMsg);
  throw new Error(errorMsg);
}

module.exports = { createREFCharge };
// ```

// **Fluxo REF:**
// ```
// Seu sistema cria cobrança → Recebe referência + entidade
// → Mostra ao cliente: "Pague na referência 123456789, Entidade 00348"
// → Cliente paga no ATM/App (pode demorar horas/dias)
// → AppyPay envia Webhook com confirmação
// → Você actualiza o pedido para "pago"