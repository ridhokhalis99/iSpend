'use strict';

const fs =  require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/profiles.json', 'utf-8'))
    data.forEach(profile => {
      profile.createdAt = new Date()
      profile.updatedAt = new Date()
    })
    return queryInterface.bulkInsert('Profiles', data, {})
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Profiles', null, {})
  }
};
