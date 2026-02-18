const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  categoria_pai_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categorias',
      key: 'id'
    }
  }
}, {
  tableName: 'Categorias',
  underscored: true
});

Categoria.associate = (models) => {
  // Relacionamento Pai/Filho (Subcategorias)
  Categoria.hasMany(models.Categoria, { foreignKey: 'categoria_pai_id', as: 'subcategorias' });
  Categoria.belongsTo(models.Categoria, { foreignKey: 'categoria_pai_id', as: 'pai' });
  
  Categoria.hasMany(models.Produto, { foreignKey: 'categoria_id', as: 'produtos' });
};

module.exports = Categoria;