const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Clients = sequelize.define('clients', {

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


module.exports = Clients