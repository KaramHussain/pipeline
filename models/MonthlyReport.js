const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const MonthlyReport = sequelize.define(
	'monthly_report',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		activity: {
			type: DataTypes.STRING,
		},

		status: {
			type: DataTypes.STRING,
		},
		date: {
			type: DataTypes.DATE,
		},
		type: {
			type: DataTypes.STRING,
		},
		submission_deadline: {
			type: DataTypes.DATE,
		},
		month: {
			type: DataTypes.INTEGER,
		},
		year: {
			type: DataTypes.INTEGER,
		},
		projectId: {
			type: DataTypes.INTEGER,
		},

		closed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
);
module.exports = MonthlyReport;
