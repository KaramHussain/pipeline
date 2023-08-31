const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ExpertPositions = sequelize.define('expert_positions', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    projectId: {
        type: DataTypes.INTEGER,
    },

}, {

});
module.exports = ExpertPositions