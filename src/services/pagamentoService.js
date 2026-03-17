// services/paymentService.js
const { createREFCharge } = require('./external/appPay/payments/ref');
const { createGPOCharge } = require('./external/appPay/payments/gpo');

const {pagamentoRepo} = require('../repositories/index');

async function initiatePayment({ method, amount, orderId, phone, email}) { 
  // 1. Gerar merchantTransactionId único
//   const merchantTransactionId = `${method}${orderId}${Date.now().toString().slice(-4)}`;

  let result;

  // 2. Chamar a AppyPay conforme o método
  if (method === 'REF') {
    result = await createREFCharge({ amount, orderId, customerPhone:phone, customerEmail:email });
  } else if (method === 'GPO') {
    result = await createGPOCharge({ amount, phoneNumber: phone, orderId, description:`Pedido: ${orderId}` });
  }

  // 3. Guardar na base de dados
  const payment = await pagamentoRepo.create({
    pedido_id:orderId,
    merchant_transaction_id:result.merchantTransactionId,
    gateway_transaction_id: result.transactionId,
    pagamento_metodo: method,
    pagamento_status: 'pendente',
    valor_pago:amount,
    referencia_numero: result.reference || null,
    referencia_entidade: result.entity || null,
    referencia_validade: result.dueDate || null,
    gateway_response: JSON.stringify(result)
  });

  return payment;
 }

async function verificadorPagamento(pagamento_id){
  return await pagamentoRepo.findById(pagamento_id)
}

module.exports = { initiatePayment, verificadorPagamento };