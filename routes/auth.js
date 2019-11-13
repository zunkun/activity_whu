const jwt = require('jsonwebtoken');
const ResService = require('../core/ResService');
const DingStaffs = require('../models/DingStaffs');
const DeptStaffs = require('../models/DeptStaffs');
const Roles = require('../models/Roles');
const dingding = require('../core/dingding');
const Router = require('koa-router');
const router = new Router();
const config = require('../config');
const rp = require('request-promise');

router.prefix('/api/auth');

/**
* @api {get} /api/auth/jsconfig 系统配置
* @apiName jsconfig
* @apiGroup 鉴权
* @apiDescription 系统配置
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 项目列表
* @apiSuccess {Object} data.corpId 企业corpId
* @apiSuccess {Object} data.corpName 企业名称
* @apiSuccess {String} data.agentId 当前应用agentId
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/jsconfig', async (ctx, next) => {
	ctx.body = ResService.success({
		corpId: config.corpId,
		agentId: config.agentId
	});
});

/**
* @api {get} /api/auth/signature?platform=&url= 签名
* @apiName signature
* @apiGroup 鉴权
* @apiDescription 签名，所有平台公用一个接口，不同的是 platform和url参数不同
* @apiParam {String} platform 生成签名的平台, 例如 vote_mobile-投票移动端 vote_pc 投票PC端
* @apiParam {String} url 当前网页的URL，不包含#及其后面部分
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 项目列表
* @apiSuccess {Object} data.corpId 企业corpId
* @apiSuccess {String} data.agentId 当前应用agentId
* @apiSuccess {Object} data.url 当前页面url
* @apiSuccess {Object} data.timeStamp 时间戳
* @apiSuccess {Object} data.signature 签名
* @apiSuccess {Object} data.nonceStr 	随机串
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.get('/signature', async (ctx, next) => {
	let { platform, url } = ctx.query;
	if (!url || !platform) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
	const signature = await dingding.getJsApiSign({ platform, url });
	ctx.body = ResService.success(signature);
	await next();
});

/**
* @api {get} /api/auth/login?code=&userId= 用户登录
* @apiName login
* @apiGroup 鉴权
* @apiDescription 用户登录
* @apiParam {String} code 钉钉免登code
* @apiParam {String} [userId] 测试环境中使用，没有code,携带钉钉用户的userId
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 项目列表
* @apiSuccess {Object} data.user 钉钉获取当前用户信息
* @apiSuccess {String} data.user.userId 用户userId
* @apiSuccess {String} data.user.userName 用户userName
* @apiSuccess {String} data.user.jobnumber 工号
* @apiSuccess {String} data.user.avatar 图像
* @apiSuccess {String} data.user.mobile 手机
* @apiSuccess {Boolean} data.user.access 当前用户有进入活动管理页面的权限，即是否是管理员，当前 access = true 时，roles 才有效
* @apiSuccess {Object[]} data.user.roles 用户角色表
* @apiSuccess {Number} data.user.roles.role 角色 1-总会管理员 2-分会管理员 3-普通校友
* @apiSuccess {Number} data.user.roles.deptId 当前角色所管理的部门ID
* @apiSuccess {String} data.user.roles.deptName 当前角色所管理部门名称
* @apiSuccess {Object[]} data.user.depts 部门信息
* @apiSuccess {Number} data.user.depts.deptId 部门deptId
* @apiSuccess {String} data.user.depts.deptName 部门名称
* @apiSuccess {String} data.token token信息,需要鉴权的api中请在header中携带此token
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/login', async (ctx, next) => {
	let code = ctx.query.code;
	try {
		const userInfo = await dingding.getuserinfo(code);
		if (userInfo.errcode !== 0) {
			ctx.body = ResService.fail(userInfo.errmsg, userInfo.errcode);
		}
		let user = await DingStaffs.findOne({ where: { userId: userInfo.userid } });

		if (!user) {
			const userRes = await dingding.getUser(userInfo.userid);
			if (userRes.errcode !== 0) {
				ctx.body = ResService.fail(user.errmsg, user.errcode);
			}

			user = { userId: user.userid, userName: user.name, jobnumber: user.jobnumber, mobile: user.mobile, access: false };
		} else {
			user = user.toJSON();
			user.access = !!user.activity;
		}
		if (!user) {
			ctx.body = ResService.fail('获取用户信息失败', 404);
			return;
		}
		try {
			let res = await rp.get(`http://alumnihome1893-1.whu.edu.cn/renzheng/whu/alumniResource/getActivityRights?dingtalkId=${user.userId}`);
			res = JSON.parse(res);

			if (res && res.success) {
				user.access = res.content ? res.content.access : false;
			}
		} catch (error) {
			user.access = false;
		}

		let roles = await Roles.findAll({ where: { userId: user.userId } });
		user.roles = [];
		for (let role of roles) {
			user.roles.push({
				role: role.role,
				deptId: role.deptId,
				deptName: role.deptNae
			});
		}
		if (!roles.length) {
			user.roles.push({ role: 3 });
		}
		let deptIds = [];
		let deptStaffs = await DeptStaffs.findAll({ where: { userId: user.userId } });
		for (let deptStaff of deptStaffs) {
			deptIds.push(deptStaff.deptId);
		}
		user.deptIds = deptIds;

		const token = jwt.sign(user, config.secret);
		ctx.body = ResService.success({ user, token: 'Bearer ' + token });
	} catch (error) {
		console.log(`登录鉴权失败 code: ${code}`, error);
		ctx.body = ResService.fail(`登录鉴权失败 code: ${code}`, 500);
	}
	await next();
});

router.get('/login2', async (ctx, next) => {
	const user = {
		id: 31,
		userId: '4508346520949170',
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

	let roles = await Roles.findAll({ where: { userId: user.userId } });
	user.roles = [];
	for (let role of roles) {
		user.roles.push({
			role: role.role,
			deptId: role.deptId,
			deptName: role.deptNae
		});
	}
	if (!roles.length) {
		user.roles.push({ role: 3 });
	}
	const token = jwt.sign(user, config.secret);
	ctx.body = ResService.success({ user, token: 'Bearer ' + token });
});

module.exports = router;
