const Sequelize = require('sequelize');
const config = require('../../config');
const pgConfig = config.mysql;
const mysql = new Sequelize(pgConfig.database, pgConfig.username, pgConfig.password, {
	host: pgConfig.host,
	port: pgConfig.port,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
	// logging: process.env.NODE_ENV === 'development' ? console.log : false
});

module.exports = mysql;
