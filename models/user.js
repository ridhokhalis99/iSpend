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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: `username can't be null`},
        notEmpty: { msg: `username can't be empty`}
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `password can't be null`},
        notEmpty: { msg: `password can't be empty`}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `email can't be null`},
        notEmpty: { msg: `email can't be empty`},
        isEmail: {msg: `email must be in email format`}
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `role can't be null`},
        notEmpty: { msg: `role can't be empty`}
      }
    },
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