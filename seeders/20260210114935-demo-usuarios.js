'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 2. Defina o custo do hash (salt rounds)
    const saltRounds = 10;
    
    // 3. Gere o hash da senha
    const hashedPassword = await bcrypt.hash('SenhaSecreta123', saltRounds);

    const usuarios = [];
    for (let i = 0; i < 50; i++) {
        const telefoneFake = `92${faker.string.numeric(7)}`;
        usuarios.push({
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        telefone: telefoneFake,
        senha: hashedPassword, // Use a mesma senha para todos os usuários de teste
        tipo: faker.helpers.arrayElement(['cliente', 'vendedor']),
        status: faker.helpers.arrayElement(['ativo', 'suspenso']),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('usuario', usuarios, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuario', null, {});
  }
};
