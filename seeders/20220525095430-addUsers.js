'use strict';

const fs =  require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
    data.forEach(user => {
      user.createdAt = new Date()
      user.updatedAt = new Date()
    })
    return queryInterface.bulkInsert('Users', data, {})
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
