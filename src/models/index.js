const Usuario = require('./Usuario');
const Loja = require('./Loja');

Usuario.hasOne(Loja, { foreignKey: 'usuario_id' });
Loja.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
  Usuario,
  Loja,
};
