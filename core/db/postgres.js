const Sequelize = require('sequelize');
const config = require('../../config');
const pgConfig = config.postgres;
const postgres = new Sequelize(pgConfig.database, pgConfig.username, pgConfig.password, {
	host: pgConfig.host,
	port: pgConfig.port,
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
	// logging: false
});

module.exports = postgres;
