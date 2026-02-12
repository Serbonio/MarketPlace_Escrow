const escrowService = require('./escrowService');
const sequelize = require('../config/database');
const {
    encomendaRepo,
    escrowRepo
} = require('../repositories/index');

const EscrowService = new escrowService();
async function rodarTeste(){
    console.log('Iniciando teste de liberação de escrow...');
    const encomenda_id=3;
    const usuario_id=1;
    try{
        console.log('Tentando liberar escrow para encomenda_id:', encomenda_id);
        const encomenda_antes = await encomendaRepo.findById(encomenda_id);
        const escrow_antes = await escrowRepo.findByEncomendaId(encomenda_id);
        console.log('Status antes da liberação - Encomenda:', encomenda_antes.status, 'Escrow:', escrow_antes.status);

        const resultado = await EscrowService.liberarEscrow({encomenda_id: encomenda_id, confirmado_por: usuario_id})
        console.log('✅ Escrow liberado:', JSON.stringify(resultado, null, 2));

        const encomenda_depois = await encomendaRepo.findById(encomenda_id);
        const escrow_depois = await escrowRepo.findByEncomendaId(encomenda_id);
        console.log('Status depois da liberação - Encomenda:', encomenda_depois.status, 'Escrow:', escrow_depois.status);


    }catch(error){
        console.error('❌ Erro ao liberar escrow:', error.message);
    }finally{
        await sequelize.close();
    }
}

rodarTeste();