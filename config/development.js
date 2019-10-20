module.exports = {
	PORT: 4000,
	mysql: {
		host: '119.27.170.247',
		port: 3306,
		database: 'whu',
		username: 'root',
		password: '!Asbcd1234'
	},
	postgres: {
		host: '119.27.170.247',
		port: 5432,
		database: 'whu',
		username: 'whu',
		password: 'abcd1234'
	},
	secret: 'whu',
	baseDeptId: 1,
	dingBaseUri: 'https://oapi.dingtalk.com',
	corpId: 'dingcbcbb63d3edd5478',
	corpName: '上海铭悦软件有限公司',
	agentId: '302567497',
	appkey: 'dingi36m7pcjlcqapbci',
	appsecret: 'rL9MrWWxdIaFquO-LtMKHsg_kAD8eMggbRAufVbCPCjtu-5iyE8RKi3C5nMln-lq',
	nonceStr: 'afasdzwe',
	deptCron: '0 0 6 * * *', // 每日6时同步部门列表
	roleCron: '0 0 */1 * *', // 每隔1个小时同步角色列表
	videoPath: '/apps/files/video/',
	imagePath: '/apps/files/image/'
};
