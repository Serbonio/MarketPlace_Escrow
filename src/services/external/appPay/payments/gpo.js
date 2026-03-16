const { apiCall } = require('../client');

require('dotenv').config()

const GPO_PAYMENT_METHOD = `GPO_${process.env.APP_PAY_GPO_APP_KEY}`

async function createGPOcharge({amount, phoneNumber, orderId, description}){
    // Gerar merchantTransactionId
    const merchantTransactionId = `G${orderId}${Date.now().toString().slice(-6)}`

    const body = {
        amount, 
        currency:'AOA', 
        description: description,
        merchantTransactionId,
        paymeny_method: GPO_PAYMENT_METHOD,
        payment_info:{
            phoneNumber: phoneNumber,
        },
        options:{
            MerchantOrigin:'Mercantix'
        }
    };

const {status, data} = await apiCall('POST', '/charges', body, true);

// Transacao aceite ou não
    if(status ==202){
    return {
        sucess:true,
        transactiionId: data.id,
        merchantTransactionId,
        status: 'pending'
    }
}
    if(status==200 && data.responseStatus.sucessful){
    return{
        sucess:true, 
        transactionId: data.id,
        merchantTransactionId,
        status:'sucess'
    }
}
    throw new Error(data.responseStatus.message)
}

async function getChargeStatus(transactiionId){
    const {data} = await apiCall('GET', `charges/${transactiionId}`)
    return data.payment
}

module.exports = {createGPOcharge, getChargeStatus}