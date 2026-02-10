const Produto = require('../models/Produto');

class ProdutoRepository {
    create(data) {
        return Produto.create(data);
    }

    findAll(filters = {}) {
        return Produto.findAll({ where: filters });
    }

    findById(id) {
        return Produto.findByPk(id);
    }

    async update(id, data) {
        return await Produto.update(data, { where: { id } });
    }

    delete(id) {
        return Produto.destroy({ where: { id } });
    }
}

module.exports = new ProdutoRepository();