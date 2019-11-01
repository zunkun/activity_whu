const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const { Op } = require('sequelize');
const util = require('../core/util');
const Components = require('../models/Components');

router.prefix('/api/forms');

/**
* @api {post} /api/forms 创建表单
* @apiName forms-create
* @apiGroup 报名表单
* @apiDescription 创建表单,返回表单ID
* @apiHeader {String} authorization 登录token
* @apiParam {Object[]} forms 表单
* @apiParam {String} forms.componentName 组件名称
* @apiParam {String} forms.componentType 组件类型
* @apiParam {String} forms.componentSet 组件属性设置类型
* @apiParam {Object} forms.attribute 组件属性
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 返回数据
* @apiSuccess {Number} data.formId 表单ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	const { forms } = ctx.request.body;

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

	let formId = util.genTimeString();
	let timestamp = Date.now();
	for (let i = 0, len = forms.length; i < len; i++) {
		let form = forms[i];
		await Components.create({
			formId,
			sequence: i + 1,
			componentName: form.componentName,
			componentType: form.componentType,
			componentSet: form.componentSet,
			attribute: form.attribute,
			timestamp
		});
	}

	ctx.body = ResService.success({ formId });
});

/**
* @api {post} /api/forms/update 修改表单
* @apiName forms-create
* @apiGroup 报名表单
* @apiDescription 修改表单
* @apiHeader {String} authorization 登录token
* @apiParam {String} formId 表单ID
* @apiParam {Object[]} forms 表单
* @apiParam {String} [forms.id] 组件ID,若是新建的组件则不需要传该值
* @apiParam {String} forms.componentName 组件名称
* @apiParam {String} forms.componentType 组件类型
* @apiParam {String} forms.componentSet 组件属性设置类型
* @apiParam {Object} forms.attribute 组件属性
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 返回数据
* @apiSuccess {Number} data.formId 表单ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/update', async (ctx, next) => {
	const { formId, forms } = ctx.request.body;
	let timestamp = Date.now();
	if (!formId || !forms || !Array.isArray(forms) || !forms.length) {
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
	}

	let count = await Components.count({ where: { formId } });
	if (!count) {
		ctx.boy = ResService.fail('没有当前表单，不做更新');
		return;
	}

	for (let i = 0, len = forms.length; i < len; i++) {
		let form = forms[i];
		if (form.id) {
			await Components.update({
				formId,
				sequence: i + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				timestamp
			}, { where: { formId, id: form.id } });
		} else {
			await Components.create({
				formId,
				sequence: i + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				timestamp
			});
		}
	}

	await Components.destroy({ wehre: { formId, timestamp: { [Op.ne]: timestamp } } });

	ctx.body = ResService.success({ });
});

/**
* @api {get} /api/forms/:formId 获取表单
* @apiName forms-info
* @apiGroup 报名表单
* @apiDescription 获取表单
* @apiHeader {String} authorization 登录token
* @apiParam {String} formId 表单ID
* @apiSuccess {Number} errcode 成功为0
* @apiParam {Object[]} data 表单数据
* @apiSuccess {String} data.formId 表单ID
* @apiSuccess {String} data.sequence 组件排序
* @apiSuccess {String} data.id 组件ID
* @apiSuccess {String} data.componentName 组件名称
* @apiSuccess {String} data.componentType 组件类型
* @apiSuccess {String} data.componentSet 组件属性设置类型
* @apiSuccess {Object} data.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/:formId', async (ctx, next) => {
	const formId = ctx.params.formId;

	let forms = await Components.findAll({
		where: { formId },
		attributes: { exclude: [ 'timestamp' ] },
		order: [ [ 'sequence', 'ASC' ] ]
	});

	ctx.body = ResService.success(forms);
	await next();
});

module.exports = router;
