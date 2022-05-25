'use strict';

const fs =  require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/transactions.json', 'utf-8'))
    data.forEach(transaction => {
      transaction.createdAt = new Date()
      transaction.updatedAt = new Date()
    })
    return queryInterface.bulkInsert('Transactions', data, {})
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Transactions', null, {})
  }
};
