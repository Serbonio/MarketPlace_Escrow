// require("dotenv").config()

process.env.APP_PAY_REF_APP_KEY

let cachedToken=null;
let tokenExpiry = null;

async function getToken(){
    // Verificar a valdiade do token
    if(cachedToken && token && Date.now()<tokenExpiry - 60000){
        return cachedToken;
    }

    const params = new URLSearchParams({
        grant_type:'client_credentials',
        client_id: process.env.APP_PAY_CLIENT_ID,
        client_secret:process.env.APP_PAY_SECRET_KEY,
        resourse: process.env.APP_PAY_RESOURCE
    });

    const response = await fetch(process.env.APP_PAY_TOKEN_URL,{
            method: 'POST',
            headers: {'Content-type': 'application/x-www-fomr-urlencoded'},
            body: params 
     })

     const data = response.json();

     cachedToken = data.acess_token;

     tokenExpiry = Date.now() + parseInt(data.expires_in) * 1000;
     
     return cachedToken;
}

module.exports = {getToken}