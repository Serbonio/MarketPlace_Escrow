const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProdutoImagem = sequelize.define('ProdutoImagem', {
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'produto', key: 'id' }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ordem: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  principal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'ProdutoImagens',
  underscored: true
});

ProdutoImagem.associate = (models) => {
  ProdutoImagem.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
};

module.exports = ProdutoImagem;