const { liberarEscrow } = require("../src/services/pedidoService");
// Importamos os mocks para podermos controlar o comportamento deles
jest.mock('../src/repositories/index');
const { 
    encomendaRepo, 
    pedidoRepo, 
    escrowRepo, 
    ledgerRepo 
} = require('../src/repositories/index');

describe("Fazendo teste ao Servico de Liberacao de Escrow", () => {
    
    // Limpa os mocks antes de cada teste para não interferir
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.only("Testando liberar Escrow", async () => {
        const encomendaId = 107;
        const confirmadoPor = 61;

        // --- CONFIGURANDO OS MOCKS (Simulando o comportamento do banco) ---
        
        // Simular a busca da encomenda
        encomendaRepo.findById.mockResolvedValue({
            id: encomendaId,
            pedido_id: 1,
            loja_id: 2,
            status: 'paga' // Status esperado pela sua função
        });

        // Simular a busca do pedido para validar o usuário
        pedidoRepo.findById.mockResolvedValue({
            id: 1,
            usuario_id: confirmadoPor
        });

        // Simular a busca do escrow
        escrowRepo.findByEncomendaId.mockResolvedValue({
            id: 5,
            valor: 100.00,
            status: 'retido'
        });

        // Simular updates e creates (simplesmente resolvem a promessa)
        ledgerRepo.create.mockResolvedValue({});
        escrowRepo.update.mockResolvedValue([1]);
        encomendaRepo.update.mockResolvedValue([1]);
        pedidoRepo.update.mockResolvedValue([1]);
        encomendaRepo.count.mockResolvedValue(0); // Pedido totalmente concluído

        // --- EXECUÇÃO ---
        const escrowProcess = await liberarEscrow(encomendaId, confirmadoPor);

        // --- ASSERÇÕES ---
        expect(escrowProcess).toHaveProperty("sucesso", true);
        expect(encomendaRepo.update).toHaveBeenCalledWith(
            encomendaId, 
            expect.objectContaining({ status: 'entregue' }), 
            expect.any(Object)
        );
    });
});