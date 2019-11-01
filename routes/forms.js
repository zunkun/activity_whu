const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const { Op } = require('sequelize');
const Components = require('../models/Components');
const Activities = require('../models/Activities');

router.prefix('/api/forms');

/**
* @api {post} /api/forms 保存表单
* @apiName forms-create
* @apiGroup 报名表单
* @apiDescription 保存报名表单
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiParam {Object[]} forms 表单
* @apiParam {String} forms.componentName 组件名称
* @apiParam {String} forms.componentType 组件类型
* @apiParam {String} forms.componentSet 组件属性设置类型
* @apiParam {Object} forms.attribute 组件属性
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	const { activityId, forms } = ctx.request.body;
	let activity = Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}
	if (!forms || !Array.isArray(forms) || !forms.length) {
		ctx.body = ResService.fail('请设置表单');
		return;
	}

	let valid = true;
	for (let form of forms) {
		[ 'componentName', 'componentType', 'componentSet', 'attribute' ].map(key => {
			if (!form[key]) valid = false;
		});
	}
	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}

	let timestamp = Date.now();
	for (let i = 0, len = forms.length; i < len; i++) {
		let form = forms[i];
		await Components.create({
			activityId,
			sequence: i + 1,
			componentName: form.componentName,
			componentType: form.componentType,
			componentSet: form.componentSet,
			attribute: form.attribute,
			timestamp
		});
	}
	await Components.destroy({ where: { activityId, timestamp: { [Op.ne]: timestamp } } });

	ctx.body = ResService.success({});
});

/**
* @api {get} /api/forms/info?activityId= 获取表单
* @apiName forms-info
* @apiGroup 报名表单
* @apiDescription 获取表单
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiParam {Object[]} data 表单数据
* @apiSuccess {Number} data.activityId 活动ID
* @apiSuccess {String} data.sequence 组件排序
* @apiSuccess {String} data.id 组件ID
* @apiSuccess {String} data.componentName 组件名称
* @apiSuccess {String} data.componentType 组件类型
* @apiSuccess {String} data.componentSet 组件属性设置类型
* @apiSuccess {Object} data.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/info', async (ctx, next) => {
	const activityId = ctx.params.formId;
	let activity = Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}

	let forms = await Components.findAll({
		where: { activityId },
		attributes: { exclude: [ 'timestamp' ] },
		order: [ [ 'sequence', 'ASC' ] ]
	});

	ctx.body = ResService.success(forms);
	await next();
});

module.exports = router;
