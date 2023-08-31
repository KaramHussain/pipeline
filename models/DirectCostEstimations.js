const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ExpertPositions = sequelize.define('direct_cost_estimation', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    expenseDetail: {
        type: DataTypes.STRING,
    },
    cost: {
        type: DataTypes.FLOAT,
    },

    noOfUnit: {
        type: DataTypes.STRING,
        allowNull: false
    },

    projectId: {
        type: DataTypes.INTEGER,
    },

}, {

});
module.exports = ExpertPositions