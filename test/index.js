process.env.NODE_ENV = 'development';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const app = require('../bin/www');
process.request = require('supertest')(app);
const jwt = require('jsonwebtoken');
const config = require('../config');
const user = {
	id: 31,
	userId: '4508346521365159',
	userName: '刘遵坤',
	jobnumber: '',
	avatar: 'https://static.dingtalk.com/media/lADPDgQ9qUPUYknNAYDNAYA_384_384.jpg',
	mobile: '15618871296',
	isAdmin: true,
	isBoss: false,
	position: '流程管理平台研发中心高级工程师',
	email: '',
	role: 3
};
process.token = 'Bearer ' + jwt.sign({ userId: user.userId, userName: user.userName, jobnumber: user.jobnumber, mobile: user.mobile }, config.secret);
console.log(process.token);
process.user = user;
console.log(process.token, process.user);

console.log('-------------API 测试-------------');

describe('测试 /api/questionnaires', () => {
	require('./api/questionnaires');
});

// describe('测试 /api/votes', () => {
// 	require('./api/votes');
// });
