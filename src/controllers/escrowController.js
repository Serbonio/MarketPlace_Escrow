const {liberarEscrow} = require("../services/pedidoService");

class EscrowController{
    async liberarEncomenda(req, res){
        const {encomenda_id,confirmado_por}= req.body;
    console.log(encomenda_id)
    console.log(confirmado_por)
    try{
    const escrow =await liberarEscrow(encomenda_id, confirmado_por);
    res.status(200).json(escrow);
    }catch(error){
        res.status(400).json(error)
        console.error(error)
    }
}
}

module.exports=new EscrowController();