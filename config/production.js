module.exports = {
	PORT: 3029,
	postgres: {
		host: '10.113.6.11',
		port: 5432,
		database: 'whu',
		username: 'whu',
		password: 'abcd1234'
	},
	secret: 'whu',
	baseDeptId: 1,
	dingBaseUri: 'https://oapi.dingtalk.com',
	corpId: 'ding2f9d4c2c3863312935c2f4657eb6378f',
	corpName: '武汉大学校友总会',
	agentId: '307499347',
	appkey: 'dingeqmpgxeavkrr5dyc',
	appsecret: 'dpK569l_-z5eKjNXc49dEu2Zyszlrqo7s6a1ceWvk0uloDRZNvC7DaRUNiMHJfSF',
	nonceStr: 'afasdzwe',
	roleCron: '0 */10 0 * * *' // 每隔10分钟同步角色列表
};
