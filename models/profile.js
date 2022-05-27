'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User)
    }

    age(){
      const diffMilliSeconds = Math.abs( new Date() - this.birthDate)
      const diffYears = Math.floor(diffMilliSeconds / (1000 * 60 * 60 * 24 * 365)) 
      return diffYears
    }
  }
  Profile.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `full name can't be null`},
        notEmpty: { msg: `full name can't be empty`}
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `gender can't be null`},
        notEmpty: { msg: `gender can't be empty`}
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: `birth date can't be null`},
        notEmpty: { msg: `birth date can't be empty`},
        isBefore: {args: (new Date()).toISOString().split('T')[0], msg: 'birth date must be before today'}
      }
    },
    monthlySalary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: `monthly salary can't be null`},
        notEmpty: { msg: `monthly salary can't be empty`}
      }
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};