'use strict';

const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const jwt = require('koa-jwt');
const fs = require('fs');
const path = require('path');
const config = require('./config');

app.use(bodyparser({
	enableTypes: [ 'json', 'form', 'text' ]
}));
app.use(json());
app.use(logger());

app.use(jwt({ secret: config.secret }).unless({
	path: [ /^\/api\/auth/, /^\/api\/constants/, /^\/api\/files/, /^\/apidoc/ ]
}));

// 请求出错日志
app.on('error', (error) => {
	console.error('请求出错: ', error);
});

app.use(require('koa-static')(path.join(__dirname, '/public')));

/**
 * 初始化路由
 */
function initRouters (pathRoute) {
	let routersPath = path.join(__dirname, 'routes');
	let files = fs.readdirSync(routersPath);

	files.forEach(file => {
		let stat = fs.lstatSync(path.join(routersPath, file));
		if (stat.isDirectory()) {
			initRouters(pathRoute ? path.join(pathRoute, file) : file);
		} else {
			if (file.endsWith('.js')) {
				let _router = require(path.join(routersPath, file));
				app.use(_router.routes());
				app.use(_router.allowedMethods());
			}
		}
	});
}
initRouters();

module.exports = app;
