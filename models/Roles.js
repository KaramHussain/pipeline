

const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Roles = sequelize.define('roles', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    create_project: {
        type: DataTypes.BOOLEAN,
    },

    assign_role: {
        type: DataTypes.BOOLEAN,
    },

    enter_project_data: {
        type: DataTypes.BOOLEAN,
    },

    view_project: {
        type: DataTypes.BOOLEAN,
    },

}, {

});


module.exports = Roles