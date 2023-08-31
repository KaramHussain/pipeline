const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ExpertRoaMonthly = sequelize.define('expert_roa_monthly', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    expertId: {
        type: DataTypes.INTEGER,
    },
    workingDays: {
        type: DataTypes.FLOAT,
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
    month: {
        type: DataTypes.INTEGER,
    },
    year: {
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
    closed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
freezeTableName:'expert_roa_monthly'
});
module.exports = ExpertRoaMonthly
