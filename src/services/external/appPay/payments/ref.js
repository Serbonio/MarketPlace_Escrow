const {apiCall} = require('../client')

// payments/ref.js

const REF_PAYMENT_METHOD = `REF_${process.env.APPYPAY_REF_APP_KEY}`;

async function createREFCharge({ amount, orderId, dueDate, customerPhone, customerEmail }) {
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
      smsNotification: true,
      emailNotification: true
    }
  };

  // OPÇÃO B: Você define a referência (deve ser única, 9-15 dígitos)
  // body.paymentInfo = {
  //   referenceNumber: "123456789",
  //   dueDate: "2024-12-31T23:59:59"
  // };

  const { status, data } = await apiCall('POST', '/charges', body, false);

  if (status === 200 && data.responseStatus.successful) {
    const ref = data.responseStatus.reference;
    return {
      success: true,
      transactionId: data.id,
      merchantTransactionId,
      reference: ref.referenceNumber, // ex: "123456789"
      entity: ref.entity,             // ex: "00348"
      dueDate: ref.dueDate,
      status: 'pending' // cliente ainda não pagou
    };
  }

  throw new Error(data.responseStatus?.message || 'Erro ao criar referência');
}

module.exports = { createREFCharge };
```

**Fluxo REF:**
```
// Seu sistema cria cobrança → Recebe referência + entidade
// → Mostra ao cliente: "Pague na referência 123456789, Entidade 00348"
// → Cliente paga no ATM/App (pode demorar horas/dias)
// → AppyPay envia Webhook com confirmação
// → Você actualiza o pedido para "pago"