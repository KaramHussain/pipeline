const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const UserActivity = sequelize.define('useractivities', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  route: {
    type: DataTypes.STRING,
    allowNull: false
  },
  beforeChanges: {
    type: DataTypes.JSON,
    allowNull: true
  },
  afterChanges: {
    type: DataTypes.JSON,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
},{
    timestamps: false
});

module.exports = UserActivity;