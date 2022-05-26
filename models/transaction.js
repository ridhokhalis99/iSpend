'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User)
    }

    get transactionDate(){
      return (this.updatedAt).toISOString().split('T')[0]
    }
  }
  Transaction.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `name can't be null`},
        notEmpty: { msg: `name can't be empty`}
      }
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: `nominal can't be null`},
        notEmpty: { msg: `nominal can't be empty`}
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `category can't be null`},
        notEmpty: { msg: `category can't be empty`}
      }
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};