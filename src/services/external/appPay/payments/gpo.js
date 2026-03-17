const { apiCall } = require('../client');

require('dotenv').config()

const GPO_PAYMENT_METHOD = `GPO_${process.env.APPY_PAY_GPO_APP_KEY}`

async function createGPOCharge({amount, phoneNumber, orderId, description}){
    // Gerar merchantTransactionId
    const merchantTransactionId = `G${orderId}${Date.now().toString().slice(-6)}`

    const body = {
        amount, 
        currency:'AOA', 
        orderId,
        description: description,
        merchantTransactionId,
        paymentMethod: GPO_PAYMENT_METHOD,
        paymentInfo:{
            phoneNumber: phoneNumber,
        },
        // options:{
        //     MerchantOrigin:'Mercantix'
        // }
    };

const {status, data} = await apiCall('POST', '/charges', body, true);
console.log(data)
// Transacao aceite ou não
    if(status ==202){
    return {
        success:true,
        transactionId: data.id,
        merchantTransactionId,
        status: 'pending'
    }
}
    if(status==200 && data.responseStatus.successful){
    return{
        sucess:true, 
        transactionId: data.id,
        merchantTransactionId,
        status:'sucess'
    }
}
    throw new Error(data.responseStatus.message)
}

async function getChargeStatus(transactionId){
    const {data} = await apiCall('GET', `charges/${transactionId}`)
    return data.payment
}

module.exports = {createGPOCharge, getChargeStatus}