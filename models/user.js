'use strict';

const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasOne(models.Profile)
      User.hasMany(models.Transaction)
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (record, options) => {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(record.password, salt)
        record.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};