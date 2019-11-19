const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const { Op } = require('sequelize');
const Components = require('../models/Components');
const Activities = require('../models/Activities');
const Forms = require('../models/Forms');

router.prefix('/api/forms');

/**
* @api {post} /api/forms 保存表单
* @apiName forms-create
* @apiGroup 报名表单
* @apiDescription 保存报名表单
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiParam {Object[]} meforms 报名人自己的表单组件表
* @apiParam {String} meforms.componentName 组件名称
* @apiParam {String} meforms.componentType 组件类型
* @apiParam {String} meforms.componentSet 组件属性设置类型
* @apiParam {Object} meforms.attribute 组件属性
* @apiParam {Number} familyNum 家属最多人数，默认1
* @apiParam {Object[]} familyforms 家属表单
* @apiParam {String} familyforms.componentName 组件名称
* @apiParam {String} familyforms.componentType 组件类型
* @apiParam {String} familyforms.componentSet 组件属性设置类型
* @apiParam {Object} familyforms.attribute 组件属性
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let { meforms, activityId, familyNum, familyforms } = ctx.request.body;
	familyNum = Number(familyNum) || 1;
	let activity = Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}
	if (!meforms || !Array.isArray(meforms)) {
		meforms = [];
	}
	if (!familyforms || !Array.isArray(familyforms)) {
		familyforms = [];
	}

	if (!familyforms.length && !meforms.length) {
		ctx.body = ResService.fail('请设置表单信息');
		return;
	}

	let valid = true;

	for (let form of meforms) {
		[ 'componentName', 'componentType', 'componentSet', 'attribute' ].map(key => {
			if (!form[key]) valid = false;
		});
	}
	for (let form of familyforms) {
		[ 'componentName', 'componentType', 'componentSet', 'attribute' ].map(key => {
			if (!form[key]) valid = false;
		});
	}
	if (!valid) {
		ctx.body = ResService.fail('请正确设置表单');
		return;
	}

	let timestamp = Date.now();
	let meform = await Forms.findOne({ where: { activityId, type: 1 } });
	let familyform = await Forms.findOne({ where: { activityId, type: 2 } });

	// 如果有个人信息表单
	if (meforms.length) {
		if (!meform) {
			meform = await Forms.create({
				activityId,
				type: 1,
				personNum: 1,
				timestamp
			});
		} else {
			await Forms.update({ timestamp }, { where: { activityId, type: 1 } });
		}

		for (let i = 0, len = meforms.length; i < len; i++) {
			let form = meforms[i];
			await Components.create({
				activityId,
				sequence: i + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				type: 1,
				timestamp
			});
		}
	} else {
		await Forms.destroy({ where: { activityId, type: 1 } });
	}

	// 如果有家属信息表单
	if (familyforms.length) {
		if (!familyform) {
			familyform = await Forms.create({
				activityId,
				type: 2,
				personNum: familyNum,
				timestamp
			});
		} else {
			await Forms.update({ timestamp, personNum: familyNum }, { where: { activityId, type: 2 } });
		}

		for (let i = 0, len = familyforms.length; i < len; i++) {
			let form = familyforms[i];
			await Components.create({
				activityId,
				sequence: i + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				type: 2,
				timestamp
			});
		}
	} else {
		await Forms.destroy({ where: { activityId, type: 2 } });
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
* @apiParam {Object} data 表单数据
* @apiParam {Object[]} data.meforms 报名人自己的表单组件表
* @apiSuccess {Number} data.meforms.activityId 活动ID
* @apiSuccess {String} data.meforms.sequence 组件排序
* @apiSuccess {String} data.meforms.id 组件ID
* @apiSuccess {String} data.meforms.componentName 组件名称
* @apiSuccess {String} data.meforms.componentType 组件类型
* @apiSuccess {String} data.meforms.componentSet 组件属性设置类型
* @apiSuccess {Object} data.meforms.attribute 组件属性
* @apiParam {Number} data.familyNum 家属最多人数
* @apiParam {Object[]} data.familyforms 家属表单组件表
* @apiSuccess {Number} data.familyforms.activityId 活动ID
* @apiSuccess {String} data.familyforms.sequence 组件排序
* @apiSuccess {String} data.familyforms.id 组件ID
* @apiSuccess {String} data.familyforms.componentName 组件名称
* @apiSuccess {String} data.familyforms.componentType 组件类型
* @apiSuccess {String} data.familyforms.componentSet 组件属性设置类型
* @apiSuccess {Object} data.familyforms.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/info', async (ctx, next) => {
	const activityId = ctx.query.activityId;
	let activity = Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}
	let meforms = [];
	let familyforms = [];
	let familyNum = 0;
	let meform = await Forms.findOne({ where: { activityId, type: 1 } });
	let familyform = await Forms.findOne({ where: { activityId, type: 2 } });

	// 个人组件表单
	if (meform) {
		meforms = await Components.findAll({
			where: { activityId, type: 1 },
			attributes: { exclude: [ 'timestamp' ] },
			order: [ [ 'sequence', 'ASC' ] ]
		});
	}

	// 家属组件表单
	if (familyform) {
		familyNum = familyform.personNum || 1;
		familyforms = await Components.findAll({
			where: { activityId, type: 2 },
			attributes: { exclude: [ 'timestamp' ] },
			order: [ [ 'sequence', 'ASC' ] ]
		});
	}

	ctx.body = ResService.success({
		meforms,
		familyNum,
		familyforms
	});
	await next();
});

module.exports = router;
