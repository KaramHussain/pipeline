

const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Partners = sequelize.define('partners', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },


}, {

});


module.exports = Partners