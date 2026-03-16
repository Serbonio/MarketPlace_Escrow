const {getToken} = require("./auth");
require("dotenv").config();

async function apiCall(method, endpoint, body=null, async=false){
    const token = await getToken();

    const headers = {
        'Content-Type':'application/json',
        'Authorization':`Beaurer ${token}`,
        'Accept-Language': 'pt-BR',
        'Accept': async 
        ? 'application/vnd.appypay.asyncapi+json'
        :'application/json'
    };

    const options = {method, headers};
    if(body) options.body = JSON.stringify(body)
    
    const response = await fetch(`${process.env.APP_PAY_BASE_URL}${endpoint}`, options)
    const data = response.json();

    return {status: response.status, data}
}

module.exports = {apiCall};