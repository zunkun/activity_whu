#!/usr/bin/env node
require('console-stamp')(console, { pattern: 'yyyy-mm-dd\'T\'HH:MM:ss:l' });
// require('../services/init');
if (process.env.NODE_ENV === 'production') {
	console.log('正式环境');
} else {
	console.log('测试环境');
}

const app = require('../app');
const http = require('http');

const config = require('../config');

const port = process.env.PORT || config.PORT || 4000;

const server = http.createServer(app.callback());
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError (error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	switch (error.code) {
	case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
	case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
	default:
		throw error;
	}
}

function onListening () {
	console.log('Listening on ' + port);
}
module.exports = server;
