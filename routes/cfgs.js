const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const jwt = require('jsonwebtoken');

const StaffCfgs = require('../models/StaffCfgs');

router.prefix('/api/cfgs');

/**
* @api {post} /api/cfgs 保存导出设置
* @apiName cfgs-create
* @apiGroup 设置管理
* @apiDescription 保存导出设置
* @apiHeader {String} authorization 登录token
* @apiParam {String} catalog 设置分类，比如 activity-活动列表导出设置 enroll-报名信息列表导出设置
* @apiParam {Object} config 设置对象
* @apiParam {Object} cfgs.attribute 组件属性
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { catalog, config } = ctx.request.body;
	if (!catalog || !config) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
	let staffcfg = await StaffCfgs.findOne({ where: { userId: user.userId, catalog } });
	if (staffcfg) {
		StaffCfgs.update({ config }, { where: { id: staffcfg.id } });
	} else {
		StaffCfgs.create({ userId: user.userId, userName: user.userName, catalog, config });
	}

	ctx.body = ResService.success({});
});

/**
* @api {get} /api/cfgs/info?catalog= 获取设置
* @apiName cfgs-info
* @apiGroup 设置管理
* @apiDescription 获取设置信息
* @apiHeader {String} authorization 登录token
* @apiParam {String} catalog 设置分类，比如 activity-活动列表导出设置 enroll-报名信息列表导出设置
* @apiSuccess {Number} errcode 成功为0
* @apiParam {Object} data 表单数据
* @apiSuccess {Number} data.catalog 设置分类
* @apiSuccess {String} data.config 设置
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/info', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { catalog } = ctx.request.body;
	if (!catalog) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
	let staffcfg = await StaffCfgs.findOne({ where: { userId: user.userId, catalog } });
	if (!staffcfg) {
		ctx.body = ResService.fail('系统中没有当前用户的设置');
		return;
	}
	ctx.body = ResService.success({ catalog, config: staffcfg.config });
	await next();
});

module.exports = router;
