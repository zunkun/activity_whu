const jwt = require('jsonwebtoken');
const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const Activities = require('../models/Activities');
const EnrollForms = require('../models/EnrollForms');
const deptStaffService = require('../services/deptStaffService');
const { Op } = require('sequelize');
const DingDepts = require('../models/DingDepts');
const DeptStaffs = require('../models/DeptStaffs');

router.prefix('/api/auth');

/**
* @api {post} /api/activities 创建活动
* @apiName activities-create
* @apiGroup 活动管理
* @apiDescription 创建活动
* @apiHeader {String} authorization 登录token
* @apiParam {String} title 活动标题
* @apiParam {Number} type 活动类型 1-常规活动 2-专项活动
* @apiParam {String[]} images 活动图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiParam {Date} startTime 开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} endTime 结束时间 格式 2019-08-24 08:00:00
* @apiParam {Date} enrollStartTime 报名开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} enrollEndTime 报名截止时间 格式 2019-08-24 08:00:00
* @apiParam {Number} personNum 可参与人数
* @apiParam {String[]} descImages 活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiParam {String} descText 活动详情文字
* @apiParam {Object[]} enrollforms 报名自定义表单
* @apiParam {Number} enrollforms.sequence 报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列
* @apiParam {String} enrollforms.title 标题，比如姓名、手机号
* @apiParam {Number} enrollforms.type 类型 1-单行文本 2-选择
* @apiParam {Bool} [enrollforms.mustfill] 是否必填，true必填 false 选填,默认false
* @apiParam {Object[]} enrollforms.options 自定义表单条目选项
* @apiParam {Number} enrollforms.options.sequence 选项条目序号，比如1,2,3
* @apiParam {String} enrollforms.options.title 选项标题
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiParam {Number[]} [specialUserIds] 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiParam {String} address 活动地址
* @apiParam {Boolean} [singed] 是否需要签到 true 需要签到 false 不需要签到，默认 false 不需要签到
* @apiParam {Number} [signType] 签到方式 1-扫码签到 2-位置签到，当signed = true 时需要填写当前值
* @apiParam {Number} [distance] 位置签到距离，单位m 当signType=2位置签到时需要填写当前值
* @apiParam {String} contactMobile 联系人手机号
* @apiParam {String} contactName 联系人姓名
* @apiParamExample {json} 请求body示例
* {
*  title: '上海一日游',
*  type: 1, // 常规活动
*  images: ['a.jpg', 'b.png', 'c.jpg'],
*  startTime: '2019-10-23 08:00:00',
*  startTime: '2019-10-23 18:00:00',
*  enrollStartTime: '2019-10-01 08:00:00',
*  enrollEndTime: '2019-10-20 18:00:00',
*  personNum: 100,
*  descText: '游览上海著名景点',
*  descImages: ['d.jpg', 'e.png', 'f.jpg'],
*  deptIds: [1,2,3],
*  specialUserIds: ['userId1', 'userId2', 'userId3'],
*  address: '上海市三门路复旦软件园',
*  singed: true,
*  signType: 2, // 签到方式 1-扫码签到 2-位置签到
*  distance: 100, // signType = 2 时填写
*  contactMobile: '156xxx',
*  contactName: '刘遵坤',
*  enrollforms: [{
*    sequence: 1,
*    title: '姓名',
*    type: 1,
*    mustfill: true,
*   }, {
*    sequence: 2,
*    title: '性别',
*    type: 2,
*    mustfill: false,
*    options: ["男", "女"]
*  }]
*}
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	const dataKey = new Set(Object.keys(data));
	let valid = true; // 传参是否正确

	[ 'tite', 'type', 'startTime', 'endTime', 'enrollStartTime', 'enrollEndTime',
		'personNum', 'address', 'contactMobile', 'contactName' ].map(key => {
		if (!dataKey.has(key) || !data[key]) {
			valid = false;
		}
	});
	// 签到参数鉴别是否合法
	if (data.signed && (!data.signType || ((data.signed === 2 && !data.distance)))) {
		valid = false;
	}
	// 验证自定义表单form是否合法
	if (!data.enrollforms) valid = false;
	for (let form of data.enrollforms) {
		if (!form.sequence || !form.title || !form.type) {
			valid = false;
			break;
		}
		if (form.type === 2 && (!form.options || !form.options.length)) {
			valid = false;
			break;
		}
	}

	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}

	const timestamp = Date.now();
	const activityData = {
		sequence: Number(data.sequence),
		title: data.title,
		type: data.type,
		images: data.images || [],
		startTime: new Date(data.startTime),
		endTime: new Date(data.endTime),
		enrollStartTime: new Date(data.enrollStartTime),
		enrollEndTime: new Date(data.enrollEndTime),
		personNum: Number(data.personNum),
		descImages: data.descImages,
		descText: data.descText,
		enrollforms: data.enrollforms,
		contactMobile: data.contactMobile,
		contactName: data.contactName,
		address: data.address,
		signed: !!data.signed,
		signType: data.signed ? Number(data.signType) : null,
		distance: Number(data.signType) === 2 ? Number(data.distance) : null,
		userId: user.userId,
		userName: user.userName,
		mobile: user.mobile,
		role: user.role,
		timestamp,
		reviewStatus: 0,
		cancel: false
	};

	const deptIds = [];
	const depts = [];
	if (data.deptIds && data.deptIds.length) {
		for (let deptId of data.deptIds) {
			const dept = await deptStaffService.getDeptInfo(deptId);
			depts.push({ deptId, deptName: dept.deptName });
			deptIds.push(deptId);
		}
	}

	const specialUserIds = [];
	const specialUsers = [];
	if (data.specialUserIds && data.specialUserIds.length) {
		for (let userId of data.specialUserIds) {
			let staff = await deptStaffService.getStaff(userId);
			specialUsers.push({ userId, userName: staff.userName });
			specialUserIds.push(userId);
		}
	}
	activityData.deptIds = deptIds;
	activityData.depts = depts;
	activityData.specialUserIds = specialUserIds;
	activityData.specialUsers = specialUsers;

	const activity = await Activities.create(activityData);

	// 保存自定义列表
	for (let form of data.enrollforms) {
		form.timestamp = timestamp;
		form.activityId = activity.id;
		await EnrollForms.create(form);
	}

	ctx.body = ResService.success({ id: activity.id, title: activity.title });
	await next();
});

/**
* @api {post} /api/activities/review 审核活动
* @apiName activities-review
* @apiGroup 活动管理
* @apiDescription 审核活动
* @apiHeader {String} authorization 登录token
* @apiParam {String} reviewStatus 状态 1-审核通过 2-拒绝 3-撤销活动
* @apiParam {Number} activityId 活动ID
* @apiParam {String} [rejectReason] 驳回拒绝原因
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/review', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));

	let { reviewStatus, activityId, rejectReason } = ctx.request.body;
	reviewStatus = Number(reviewStatus);
	if (!reviewStatus || !activityId) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	const updateData = { reviewStatus };
	if (reviewStatus === 1 || reviewStatus === 2) {
		updateData.reviewerUserId = user.userId;
		updateData.reviewerUserName = user.userName;
		updateData.reviewerMobile = user.mobile;
		updateData.reviewerRole = user.role;
	}

	if (reviewStatus === 2) {
		updateData.rejectReason = rejectReason;
	}

	await Activities.update(updateData, { where: { id: activityId, cancel: false } });
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {post} /api/activities/cancel 撤销活动
* @apiName activities-cancel
* @apiGroup 活动管理
* @apiDescription 撤销活动
* @apiHeader {String} authorization 登录token
* @apiParam {String} reviewStatus 审核结果 1-审核通过 2-拒绝
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/cancel', async (ctx, next) => {
	let { activityId } = ctx.request.body;

	if (!activityId) {
		ctx.body = ResService.fail('参数错误');
		return;
	}

	await Activities.update({ cancel: true }, { where: { id: activityId } });
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {get} /api/activities/:id 活动详情
* @apiName activities-detail
* @apiGroup 活动管理
* @apiDescription 获取活动详情
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiSuccess {String} data.title 活动标题
* @apiSuccess {Number} data.type 活动类型 1-常规活动 2-专项活动
* @apiSuccess {String[]} data.images 活动图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiSuccess {Date} data.startTime 开始时间 格式 2019-08-23 08:00:00
* @apiSuccess {Date} data.endTime 结束时间 格式 2019-08-24 08:00:00
* @apiSuccess {Date} data.enrollStartTime 报名开始时间 格式 2019-08-23 08:00:00
* @apiSuccess {Date} data.enrollEndTime 报名截止时间 格式 2019-08-24 08:00:00
* @apiSuccess {Number} data.personNum 可参与人数
* @apiSuccess {String[]} data.descImages 活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiSuccess {String} data.descText 活动详情文字
* @apiSuccess {Object[]} data.enrollforms 自定义报名表单项列表
* @apiSuccess {Number} data.enrollforms.id 报名项ID
* @apiSuccess {Number} data.enrollforms.sequence 报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列
* @apiSuccess {String} data.enrollforms.title 标题，比如姓名、手机号
* @apiSuccess {Number} data.enrollforms.type 类型 1-单行文本 2-选择
* @apiSuccess {Bool} data.enrollforms.mustfill 是否必填，true必填 false 选填
* @apiSuccess {String[]} data.enrollforms.options 自定义表单条目选项,比如 ["男", "女"]
* @apiSuccess {Number[]} data.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.depts  投票范围
* @apiSuccess {String} data.depts.deptId  部门id
* @apiSuccess {String} data.depts.deptName 部门名称
* @apiSuccess {Object[]} data.specialUsers  特殊选择参与人员
* @apiSuccess {String} data.specialUsers.userId  特殊选择参与人员userId
* @apiSuccess {String} data.specialUsers.userName  特殊选择参与人员userName
* @apiSuccess {String} data.address 活动地址
* @apiSuccess {Boolean} data.singed 是否需要签到 true 需要签到 false 不需要签到
* @apiSuccess {Number} data.signType 签到方式 1-扫码签到 2-位置签到
* @apiSuccess {Number} data.distance 位置签到距离，单位m 当signType=2位置签到时有此值
* @apiSuccess {String} data.contactMobile 联系人手机号
* @apiSuccess {String} data.contactName 联系人姓名
* @apiSuccess {String} data.top 是否置顶 true置顶 false不置顶
* @apiSuccess {String} data.userId 发起人userId
* @apiSuccess {String} data.userName 发起人userName
* @apiSuccess {String} data.mobile 发起人手机号
* @apiSuccess {String} data.role 发起人身份
* @apiSuccess {String} data.reviewerUserId 审核人userId
* @apiSuccess {String} data.reviewerUserName 审核人userName
* @apiSuccess {String} data.reviewerMobile 审核人手机号
* @apiSuccess {String} data.reviewerRole 审核人身份
* @apiSuccess {String} data.reviewStatus 审核状态 0-审核中 1-审核通过 2-拒绝
* @apiSuccess {String} data.rejectReason 驳回拒绝原因
* @apiSuccess {String} data.createdAt 创建时间
* @apiSuccess {Boolean} data.cancel 是否撤销 true-撤销
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/:id', async (ctx, next) => {
	const id = ctx.params.id;

	let activity = await Activities.findOne({ where: { id } });
	if (!activity) {
		ctx.body = ResService.fail('系统无法查询到活动信息');
		return;
	}
	activity = activity.toJSON();
	activity.enrollforms = await EnrollForms.findAll({ where: { activityId: id } });

	ctx.body = ResService.success(activity);
	await next();
});

/**
* @api {get} /api/activities?limit=&page=&keywords=&status=&type= 活动列表
* @apiName activities-lists
* @apiGroup 活动管理
* @apiDescription 活动列表，目前是PC端管理活动列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {String} [keywords] 关键字
* @apiParam {Number} [status] 活动状态，0/null-全部 10-待审核 20-审核通过  21-预热中 22-报名中 23-进行中 24-已结束 30-驳回拒绝， 默认为0 表示查询全部状态
* @apiParam {String} [type] 活动类型 1-常规活动 2-专项活动，默认为1
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动列表
* @apiParam {Number} id 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 返回结果
* @apiSuccess {Number} data.count 总共活动条数
* @apiSuccess {Object[]} data.rows 当前页活动列表
* @apiSuccess {Number}  data.rows.id 活动ID
* @apiSuccess {String}  data.rows.title 活动标题
* @apiSuccess {Number}  data.rows.type 活动类型 1-常规活动 2-专项活动
* @apiSuccess {String[]}  data.rows.images 活动图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiSuccess {Date}  data.rows.startTime 开始时间 格式 2019-08-23 08:00:00
* @apiSuccess {Date}  data.rows.endTime 结束时间 格式 2019-08-24 08:00:00
* @apiSuccess {Date}  data.rows.enrollStartTime 报名开始时间 格式 2019-08-23 08:00:00
* @apiSuccess {Date}  data.rows.enrollEndTime 报名截止时间 格式 2019-08-24 08:00:00
* @apiSuccess {Number}  data.rows.personNum 可参与人数
* @apiSuccess {String[]}  data.rows.descImages 活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiSuccess {String}  data.rows.descText 活动详情文字
* @apiSuccess {Number[]} data.rows.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.rows.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.rows.depts  投票范围
* @apiSuccess {String} data.rows.depts.deptId  部门id
* @apiSuccess {String} data.rows.depts.deptName 部门名称
* @apiSuccess {Object[]} data.rows.specialUsers  特殊选择参与人员
* @apiSuccess {String} data.rows.specialUsers.userId  特殊选择参与人员userId
* @apiSuccess {String} data.rows.specialUsers.userName  特殊选择参与人员userName
* @apiSuccess {String} data.rows.address 活动地址
* @apiSuccess {Boolean} data.rows.singed 是否需要签到 true 需要签到 false 不需要签到
* @apiSuccess {Number} data.rows.signType 签到方式 1-扫码签到 2-位置签到
* @apiSuccess {Number} data.rows.distance 位置签到距离，单位m 当signType=2位置签到时有此值
* @apiSuccess {String} data.rows.contactMobile 联系人手机号
* @apiSuccess {String} data.rows.contactName 联系人姓名
* @apiSuccess {String} data.rows.top 是否置顶 true置顶 false不置顶
* @apiSuccess {String} data.rows.userId 发起人userId
* @apiSuccess {String} data.rows.userName 发起人userName
* @apiSuccess {String} data.rows.mobile 发起人手机号
* @apiSuccess {String} data.rows.role 发起人身份
* @apiSuccess {String} data.rows.reviewerUserId 审核人userId
* @apiSuccess {String} data.rows.reviewerUserName 审核人userName
* @apiSuccess {String} data.rows.reviewerMobile 审核人手机号
* @apiSuccess {String} data.rows.reviewerRole 审核人身份
* @apiSuccess {String} data.rows.reviewStatus 审核状态 0-审核中 1-审核通过 2-拒绝
* @apiSuccess {String} data.rows.rejectReason 驳回拒绝原因
* @apiSuccess {String} data.rows.createdAt 创建时间
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/', async (ctx, next) => {
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let where = { cancel: false };
	let currentTime = new Date();
	if (query.keywords) {
		where.title = { [Op.like]: `%${query.keywords}%` };
		where.descText = { [Op.like]: `%${query.keywords}%` };
	}
	where.type = Number(query.type) || 1;

	// 活动状态
	let status = Number(query.status) || 0;
	switch (status) {
	case 10: // 待审核
		where.reviewStatus = 0;
		break;
	case 20: // 审核通过
		where.reviewStatus = 1;
		break;
	case 21: // 预热中
		where.reviewStatus = 1;
		where.enrollStartTime = { [Op.gt]: currentTime };
		break;
	case 22: // 报名中
		where.reviewStatus = 1;
		where.enrollStartTime = { [Op.lte]: currentTime };
		where.enrollEndTime = { [Op.gte]: currentTime };
		break;
	case 23: // 进行中
		where.reviewStatus = 1;
		where.startTime = { [Op.lte]: currentTime };
		where.endTime = { [Op.gte]: currentTime };
		break;
	case 24: // 已结束
		where.reviewStatus = 1;
		where.endTime = { [Op.lt]: currentTime };
		break;
	case 30:
		where.reviewStatus = 2;
		break;
	default:
		break;
	}
	const res = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {get} /api/activities/lists?limit=&page=&status=&type= 我可以参与的活动列表
* @apiName activities-lists
* @apiGroup 活动管理
* @apiDescription 活动列表，目前是PC端管理活动列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {Number} [status] 活动状态， 21-预热中 22-报名中 23-进行中 24-已结束 默认为0 表示查询全部状态
* @apiParam {String} [type] 活动类型 1-常规活动 2-专项活动，默认为1
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动列表
* @apiParam {Number} id 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 返回结果
* @apiSuccess {Number} data.count 总共活动条数
* @apiSuccess {Object[]} data.rows 当前页活动列表
* @apiSuccess {Number}  data.rows.id 活动ID
* @apiSuccess {String}  data.rows.title 活动标题
* @apiSuccess {Number}  data.rows.type 活动类型 1-常规活动 2-专项活动
* @apiSuccess {String[]}  data.rows.images 活动图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiSuccess {Date}  data.rows.startTime 开始时间 格式 2019-08-23 08:00:00
* @apiSuccess {Date}  data.rows.endTime 结束时间 格式 2019-08-24 08:00:00
* @apiSuccess {Date}  data.rows.enrollStartTime 报名开始时间 格式 2019-08-23 08:00:00
* @apiSuccess {Date}  data.rows.enrollEndTime 报名截止时间 格式 2019-08-24 08:00:00
* @apiSuccess {Number}  data.rows.personNum 可参与人数
* @apiSuccess {String[]}  data.rows.descImages 活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiSuccess {String}  data.rows.descText 活动详情文字
* @apiSuccess {Number[]} data.rows.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.rows.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.rows.depts  投票范围
* @apiSuccess {String} data.rows.depts.deptId  部门id
* @apiSuccess {String} data.rows.depts.deptName 部门名称
* @apiSuccess {Object[]} data.rows.specialUsers  特殊选择参与人员
* @apiSuccess {String} data.rows.specialUsers.userId  特殊选择参与人员userId
* @apiSuccess {String} data.rows.specialUsers.userName  特殊选择参与人员userName
* @apiSuccess {String} data.rows.address 活动地址
* @apiSuccess {Boolean} data.rows.singed 是否需要签到 true 需要签到 false 不需要签到
* @apiSuccess {Number} data.rows.signType 签到方式 1-扫码签到 2-位置签到
* @apiSuccess {Number} data.rows.distance 位置签到距离，单位m 当signType=2位置签到时有此值
* @apiSuccess {String} data.rows.contactMobile 联系人手机号
* @apiSuccess {String} data.rows.contactName 联系人姓名
* @apiSuccess {String} data.rows.top 是否置顶 true置顶 false不置顶
* @apiSuccess {String} data.rows.userId 发起人userId
* @apiSuccess {String} data.rows.userName 发起人userName
* @apiSuccess {String} data.rows.mobile 发起人手机号
* @apiSuccess {String} data.rows.role 发起人身份
* @apiSuccess {String} data.rows.reviewerUserId 审核人userId
* @apiSuccess {String} data.rows.reviewerUserName 审核人userName
* @apiSuccess {String} data.rows.reviewerMobile 审核人手机号
* @apiSuccess {String} data.rows.reviewerRole 审核人身份
* @apiSuccess {String} data.rows.reviewStatus 审核状态 0-审核中 1-审核通过 2-拒绝
* @apiSuccess {String} data.rows.rejectReason 驳回拒绝原因
* @apiSuccess {String} data.rows.createdAt 创建时间
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/lists', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let currentTime = new Date();

	const where = { cancel: false, type: Number(query.type) || 1 };

	// 我所在部门
	let deptIds = [];
	const deptStaffs = await DeptStaffs.findAll({ where: { userId: user.userId } });
	for (let deptStaff of deptStaffs) {
		let dept = await DingDepts.findOne({ where: { deptId: deptStaff.deptId } });
		deptIds = deptIds.concat(dept.deptPaths);
	}
	deptIds = Array.from(new Set(deptIds));
	if (!where[Op.or]) where[Op.or] = [];
	where[Op.or].push({ deptIds: { [Op.overlap]: deptIds } });
	where[Op.or].push({ specialUserIds: { [Op.contains]: [ user.userId ] } });

	// 活动状态
	let status = Number(query.status) || 0;
	switch (status) {
	case 21: // 预热中
		where.reviewStatus = 1;
		where.enrollStartTime = { [Op.gt]: currentTime };
		break;
	case 22: // 报名中
		where.reviewStatus = 1;
		where.enrollStartTime = { [Op.lte]: currentTime };
		where.enrollEndTime = { [Op.gte]: currentTime };
		break;
	case 23: // 进行中
		where.reviewStatus = 1;
		where.startTime = { [Op.lte]: currentTime };
		where.endTime = { [Op.gte]: currentTime };
		break;
	case 24: // 已结束
		where.reviewStatus = 1;
		where.endTime = { [Op.lt]: currentTime };
		break;
	default:
		break;
	}
	const res = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });

	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {post} /api/activities/top 置顶操作
* @apiName activities-top
* @apiGroup 活动管理
* @apiDescription 置顶操作
* @apiHeader {String} authorization 登录token
* @apiParam {Number[]} activityIds 活动id表，例如 [1,2,3]
* @apiParam {Number} [top] false-不置顶 true-置顶, 默认 false 不置顶
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/top', async (ctx, next) => {
	let { activityIds, top } = ctx.request.body;
	top = !!top;
	return Activities.update({ top }, { where: { id: { [Op.in]: activityIds } } })
		.then(() => {
			ctx.body = ResService.success({});
			next();
		}).catch(error => {
			console.error('设置活动当前活动置顶状态失败', error);
			ctx.body = ResService.fail('设置失败');
			next();
		});
});

/**
* @api {post} /api/activities/updateforms 修改报名表单
* @apiName activities-modify-enrollforms
* @apiGroup 活动管理
* @apiDescription 修改报名表单
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiParam {Object[]} enrollforms 报名自定义表单
* @apiParam {Number} enrollforms.sequence 报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列
* @apiParam {String} enrollforms.title 标题，比如姓名、手机号
* @apiParam {Number} enrollforms.type 类型 1-单行文本 2-选择
* @apiParam {Bool} [enrollforms.mustfill] 是否必填，true必填 false 选填,默认false
* @apiParam {String[]} enrollforms.options 自定义表单条目选项,比如 ["男", "女"]
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/updateforms', async (ctx, next) => {
	const { activityId, enrollforms } = ctx.request.body;

	let activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统无法查询到活动');
		return;
	}
	const timestamp = Date.now();
	let valid = true;

	for (let form of enrollforms) {
		if (!form.sequence || !form.title || !form.type) {
			valid = false;
			break;
		}
		if (form.type === 2 && (!form.options || !form.options.length)) {
			valid = false;
			break;
		}
	}

	if (!enrollforms || !enrollforms.length || !valid) {
		ctx.body = ResService.fail('报名表单参数错误');
		return;
	}

	// 保存自定义列表
	for (let form of enrollforms) {
		form.timestamp = timestamp;
		form.activityId = activityId;
		await EnrollForms.create(form);
	}

	await Activities.update({ timestamp }, { where: { id: activityId } });
	await EnrollForms.destroy({ where: { activityId, timestamp: { [Op.ne]: timestamp } } });
	ctx.body = ResService.success({});
	await next();
});

module.exports = router;
