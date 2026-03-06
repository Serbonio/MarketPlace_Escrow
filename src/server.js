const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
//     await sequelize.sync({ alter: false });
// console.log('📦 Models sincronizados');
    await sequelize.authenticate();
    console.log('✅ Banco de dados conectado');


    app.listen(PORT, () => {
      console.log(`🔥 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error.message);
  }
})();
