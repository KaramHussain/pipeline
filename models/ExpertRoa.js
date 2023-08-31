const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ExpertRoa = sequelize.define('expert_roa', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    expertName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    workingDays: {
        type: DataTypes.FLOAT,
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
    categoryId: {
        type: DataTypes.INTEGER,
    },
    expertPositionId: {
        type: DataTypes.INTEGER,
    },
    partnerId: {
        type: DataTypes.INTEGER,
    },
    net_fee: {
        type: DataTypes.FLOAT,
    },
    management_fee: {
        type: DataTypes.FLOAT,
    },
    est_margin_per_wd: {
        type: DataTypes.FLOAT,
    },
    est_percent_margin: {
        type: DataTypes.FLOAT,
    },
    expert_fee: {
        type: DataTypes.FLOAT,
    },
    expert_allowance: {
        type: DataTypes.FLOAT,
    },
    transport: {
        type: DataTypes.FLOAT,
    },
    misc: {
        type: DataTypes.FLOAT,
    },

}, {
    
});
module.exports = ExpertRoa
