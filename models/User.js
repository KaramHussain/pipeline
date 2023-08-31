const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const { getHashValue, } = require("../helpers/hash.helper");
const constant = require('../config/constant');


const User = sequelize.define('users', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  gender: {
    type: DataTypes.STRING,
    defaultValue: 'Male'
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: constant.userRoles.USER
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },



  profile: {
    type: DataTypes.STRING,
  },
  msId: {
    type: DataTypes.STRING,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  lastLogin: {
    type: DataTypes.DATE,

  },

}, {

});

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await getHashValue(user.password)
  }
});


module.exports = User
