'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {

    static associate(models) {
      Profile.belongsTo(models.User)
    }
  }
  Profile.init({
    fullName: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    monthlySalary: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};