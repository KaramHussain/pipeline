const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Categories = sequelize.define('categories', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    workingDays: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    feeRate: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {

});


module.exports = Categories


