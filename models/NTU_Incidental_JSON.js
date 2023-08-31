const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const NTU_Incidental_JSON = sequelize.define('ntu_incidental_jsons', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    "entery-no": {
        type: DataTypes.INTEGER,
    },
    "job-no": {
        type: DataTypes.STRING,
    },

    "job-task-no": {
        type: DataTypes.INTEGER,
    },

    "posting-date": {
        type: DataTypes.DATE
    },
    "document-no": {
        type: DataTypes.INTEGER
    },
    "document-date": {
        type: DataTypes.DATE
    },
    "type": {
        type: DataTypes.STRING
    },
    "no": {
        type: DataTypes.INTEGER
    },
    "description": {
        type: DataTypes.STRING
    },
    "currency-code": {
        type: DataTypes.STRING
    },
    "quantity": {
        type: DataTypes.INTEGER
    },
    "unit-of-measure-code": {
        type: DataTypes.STRING
    },
    "direct-unit-cost-lcy": {
        type: DataTypes.STRING
    },
    "unit-cost": {
        type: DataTypes.STRING
    },
    "unit-cost-lcy": {
        type: DataTypes.STRING
    },
    "unit-price": {
        type: DataTypes.STRING
    },
    "unit-price-lcy": {
        type: DataTypes.STRING
    },
    "total-cost": {
        type: DataTypes.STRING
    },
    "total-cost-lcy": {
        type: DataTypes.INTEGER
    },
    "total-price": {
        type: DataTypes.STRING
    },
    "total-price-lcy": {
        type: DataTypes.INTEGER
    },
    "global-dimention-1-code": {
        type: DataTypes.STRING
    },
    "global-dimention-2-code": {
        type: DataTypes.STRING
    },
    "dimention-set-id": {
        type: DataTypes.INTEGER
    },
    "external-document-no": {
        type: DataTypes.STRING
    },

}, {

});


module.exports = NTU_Incidental_JSON