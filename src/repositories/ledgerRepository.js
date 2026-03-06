// src/repositories/LedgerRepository.js
const BaseRepository = require('./BaseRepository');
const {Ledger} = require('../models');

class LedgerRepository extends BaseRepository {
    constructor() {
        super(Ledger);
    }

    /**
     * Calcula o saldo atual de uma entidade (usuário ou sistema)
     * @param {number|null} entidade_id 
     * @param {string} entidade_tipo 
     * @param {Object} options - Opções da transação Sequelize
     * @returns {number} Saldo atual
     */
    
    async findByEntidade(entidadeTipo, entidadeId, options = {}) {
        return await this.findAll({
            where: {
                entidade_tipo: entidadeTipo,
                entidade_id: entidadeId
            },
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findLastSaldo(entidadeTipo, entidadeId, options = {}) {
        return await this.model.findOne({
            where: {
                entidade_tipo: entidadeTipo,
                entidade_id: entidadeId
            },
            order: [['created_at', 'DESC']],
            ...options
        });
    }
    
    async calculateCurrentBalance(entidade_id, entidade_tipo, options = {}) {
        // Busca todos os registros da entidade
        const registros = await this.findAll({
            where: {
                entidade_tipo,
                entidade_id: entidade_id || null
            },
            ...options
        });

        // Calcula o saldo: soma créditos, subtrai débitos
        const saldo = registros.reduce((sum, registro) => {
            const valor = parseFloat(registro.valor);
            return registro.tipo === 'credito' ? sum + valor : sum - valor;
        }, 0);

        return saldo;
    }
}
module.exports = LedgerRepository;