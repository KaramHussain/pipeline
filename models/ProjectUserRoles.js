

const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ProjectUserRoles = sequelize.define('project_user_roles', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
    },

    roleId: {
        type: DataTypes.INTEGER,
    },



}, {

});


module.exports = ProjectUserRoles