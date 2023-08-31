const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Projects = sequelize.define('projects', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    jobno: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    startDate: {
        type: DataTypes.DATE,
    },

    clientId: {
        type: DataTypes.INTEGER,
    },

    userId: {
        type: DataTypes.INTEGER,
    },

    est_hr_budget: {
        type: DataTypes.FLOAT,
    },

    est_om_budget: {
        type: DataTypes.FLOAT,
    },
    management_rate: {
        type: DataTypes.FLOAT,
    },

    est_inc_bud: {
        type: DataTypes.FLOAT,
    },

    est_ver_bud: {
        type: DataTypes.FLOAT,
    },

    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

}, {

});



module.exports = Projects


