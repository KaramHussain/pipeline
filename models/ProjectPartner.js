

const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ProjectPartner = sequelize.define('project_partners', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    partnerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
    },

}, {

});


module.exports = ProjectPartner