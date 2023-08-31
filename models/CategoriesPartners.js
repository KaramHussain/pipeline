const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const CategoryPartners = sequelize.define('category_partners', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    workingDays: {
        type: DataTypes.FLOAT,
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
    partnerId: {
        type: DataTypes.INTEGER,
    },
    categoryId: {
        type: DataTypes.INTEGER,
    },

}, {

});


module.exports = CategoryPartners


