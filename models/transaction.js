'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {

    static associate(models) {
      Transaction.belongsTo(models.User)
    }
  }
  Transaction.init({
    name: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};