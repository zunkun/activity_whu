const jwt = require('jsonwebtoken');
const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const Activities = require('../models/Activities');
const deptStaffService = require('../services/deptStaffService');
const { Op } = require('sequelize');
const DingDepts = require('../models/DingDepts');
const DeptStaffs = require('../models/DeptStaffs');
const Roles = require('../models/Roles');
const config = require('../config');
const MessageService = require('../services/MessageService');

router.prefix('/api/activities');

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
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiParam {Number[]} [specialUserIds] 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiParam {Number} latitude 地址经度
* @apiParam {Number} longitude 地址纬度
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
*  latitude: 223.234,
*  longitude: 113.234,
*  address: '上海市三门路复旦软件园',
*  singed: true,
*  signType: 2, // 签到方式 1-扫码签到 2-位置签到
*  distance: 100, // signType = 2 时填写
*  contactMobile: '156xxx',
*  contactName: '刘遵坤',
*}
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let role = await Roles.findOne({ where: { userId: user.userId, role: { [Op.in]: [ 1, 2 ] } } });
	if (!role) {
		ctx.body = ResService.fail('您不是管理员，无权创建活动');
		return;
	}
	const data = ctx.request.body;
	const dataKey = new Set(Object.keys(data));
	let valid = true; // 传参是否正确

	[ 'title', 'type', 'startTime', 'endTime', 'enrollStartTime', 'enrollEndTime',
		'personNum', 'latitude', 'longitude', 'address', 'contactMobile', 'contactName' ].map(key => {
		if (!dataKey.has(key) || !data[key]) {
			valid = false;
		}
	});
	// 签到参数鉴别是否合法
	if (data.signed && (!data.signType || ((data.signed === 2 && !data.distance)))) {
		valid = false;
	}

	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}

	const timestamp = Date.now();
	const activityData = {
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
		contactMobile: data.contactMobile,
		contactName: data.contactName,
		latitude: data.latitude,
		longitude: data.longitude,
		address: data.address,
		signed: !!data.signed,
		signType: data.signed ? Number(data.signType) : null,
		distance: Number(data.signType) === 2 ? Number(data.distance) : null,
		userId: user.userId,
		userName: user.userName,
		mobile: user.mobile,
		role: user.role,
		timestamp,
		reviewStatus: 10,
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
	activityData.deptIds = deptIds.length ? deptIds : [ 1 ];
	activityData.depts = depts || [ { deptId: 1, deptName: config.corpName } ];
	activityData.specialUserIds = specialUserIds;
	activityData.specialUsers = specialUsers;

	const activity = await Activities.create(activityData);

	ctx.body = ResService.success({ id: activity.id, title: activity.title });
	await next();
});

/**
* @api {post} /api/activities/update 修改活动
* @apiName activities-update
* @apiGroup 活动管理
* @apiDescription 修改活动
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 活动ID
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
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiParam {Number[]} [specialUserIds] 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiParam {Number} latitude 地址经度
* @apiParam {Number} longitude 地址纬度
* @apiParam {String} address 活动地址
* @apiParam {Boolean} [singed] 是否需要签到 true 需要签到 false 不需要签到，默认 false 不需要签到
* @apiParam {Number} [signType] 签到方式 1-扫码签到 2-位置签到，当signed = true 时需要填写当前值
* @apiParam {Number} [distance] 位置签到距离，单位m 当signType=2位置签到时需要填写当前值
* @apiParam {String} contactMobile 联系人手机号
* @apiParam {String} contactName 联系人姓名
* @apiParamExample {json} 请求body示例
* {
*  id: 1,
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
*  latitude: 223.234,
*  longitude: 113.234,
*  address: '上海市三门路复旦软件园',
*  singed: true,
*  signType: 2, // 签到方式 1-扫码签到 2-位置签到
*  distance: 100, // signType = 2 时填写
*  contactMobile: '156xxx',
*  contactName: '刘遵坤',
*}
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/update', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let role = await Roles.findOne({ where: { userId: user.userId, role: { [Op.in]: [ 1, 2 ] } } });
	if (!role) {
		ctx.body = ResService.fail('您不是管理员，无权管理活动');
		return;
	}
	const data = ctx.request.body;
	let activity = Activities.findOne({ where: { id: data.id } });
	if (!data.id || !activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}

	const dataKey = new Set(Object.keys(data));
	let valid = true; // 传参是否正确

	[ 'tite', 'type', 'startTime', 'endTime', 'enrollStartTime', 'enrollEndTime',
		'personNum', 'latitude', 'longitude', 'address', 'contactMobile', 'contactName' ].map(key => {
		if (!dataKey.has(key) || !data[key]) {
			valid = false;
		}
	});
	// 签到参数鉴别是否合法
	if (data.signed && (!data.signType || ((data.signed === 2 && !data.distance)))) {
		valid = false;
	}

	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}

	const timestamp = Date.now();
	const activityData = {
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
		contactMobile: data.contactMobile,
		contactName: data.contactName,
		latitude: data.latitude,
		longitude: data.longitude,
		address: data.address,
		signed: !!data.signed,
		signType: data.signed ? Number(data.signType) : null,
		distance: Number(data.signType) === 2 ? Number(data.distance) : null,
		timestamp
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
	activityData.deptIds = deptIds.length ? deptIds : [ 1 ];
	activityData.depts = depts || [ { deptId: 1, deptName: config.corpName } ];
	activityData.specialUserIds = specialUserIds;
	activityData.specialUsers = specialUsers;
	await Activities.update(activityData, { where: { id: data.id } });

	ctx.body = ResService.success({ });
	await next();
});

/**
* @api {post} /api/activities/sendreview 提交审核
* @apiName activities-send-review
* @apiGroup 活动管理
* @apiDescription 提交审核活动
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.post('/sendreview', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	const { activityId } = data;
	let activity = Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}

	if (activity.reviewStatus === 20) {
		ctx.body = ResService.fail('当前活动已在审核中');
		return;
	}

	if (activity.reviewStatus === 30 || activity.reviewStatus === 40) {
		ctx.body = ResService.fail('当前活动已被总会审核过');
		return;
	}

	if (activity.reviewStatus !== 10) {
		ctx.body = ResService.fail('当前活动已发起过审核操作');
		return;
	}
	if (activity.userId !== user.userId) {
		ctx.body = ResService.fail('您非本活动创建者，无权发送审核');
		return;
	}

	await Activities.update({ reviewStatus: 20 }, { where: { id: activityId } });
	// 给审核者发送消息
	MessageService.sendReviewMsg(activityId, activity);
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {post} /api/activities/review 审核活动
* @apiName activities-review
* @apiGroup 活动管理
* @apiDescription 审核活动
* @apiHeader {String} authorization 登录token
* @apiParam {String} reviewStatus 审核状态 30-审核通过 40-拒绝
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
	let role = await Roles.findOne({ where: { userId: user.userId, role: 1 } });
	if (!role) {
		ctx.body = ResService.fail('您非总会管理员，无权审批活动');
		return;
	}
	let { reviewStatus, activityId, rejectReason } = ctx.request.body;
	reviewStatus = Number(reviewStatus);
	if (!reviewStatus || !activityId) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	const updateData = { reviewStatus };
	if (reviewStatus === 30 || reviewStatus === 40) {
		updateData.reviewerUserId = user.userId;
		updateData.reviewerUserName = user.userName;
		updateData.reviewerMobile = user.mobile;
		updateData.reviewerRole = user.role;
	}

	if (reviewStatus === 40) {
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
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/cancel', async (ctx, next) => {
	let { activityId } = ctx.request.body;
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	if (activity.userId !== user.userId) {
		ctx.body = ResService.fail('您非本活动创建人，无权撤销本活动');
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
* @apiSuccess {Number[]} data.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.depts  投票范围
* @apiSuccess {String} data.depts.deptId  部门id
* @apiSuccess {String} data.depts.deptName 部门名称
* @apiSuccess {Object[]} data.specialUsers  特殊选择参与人员
* @apiSuccess {String} data.specialUsers.userId  特殊选择参与人员userId
* @apiSuccess {String} data.specialUsers.userName  特殊选择参与人员userName
* @apiSuccess {Number} data.latitude 活动经度
* @apiSuccess {Number} data.longitude 活动纬度
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
* @apiSuccess {String} data.reviewStatus 审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝
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
	ctx.body = ResService.success(activity);
	await next();
});

/**
* @api {get} /api/activities?limit=&page=&keywords=&status=&type= 活动列表
* @apiName activities-lists
* @apiGroup 活动管理
* @apiDescription 活动列表，目前是PC端管理活动列表,分会管理员只能看到自己创建的活动列表以及其管辖分会的活动列表，而总会管理员能够看到所有的活动列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {String} [keywords] 关键字
* @apiParam {Number} [status] 活动状态，0/null-全部 10-编辑中 20-待审核 30-审核通过  31-预热中 32-报名中 33-进行中 34-已结束 40-驳回拒绝， 默认为0 表示查询全部状态
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
* @apiSuccess {Number} data.rows.latitude 活动经度
* @apiSuccess {Number} data.rows.longitude 活动纬度
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
* @apiSuccess {String} data.rows.reviewStatus 审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝
* @apiSuccess {String} data.rows.rejectReason 驳回拒绝原因
* @apiSuccess {String} data.rows.createdAt 创建时间
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
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
	case 10: // 编辑中
		where.reviewStatus = 10;
		break;
	case 20: // 待审核
		where.reviewStatus = 20;
		break;
	case 30: // 审核通过
		where.reviewStatus = 30;
		break;
	case 31: // 预热中
		where.reviewStatus = 30;
		where.enrollStartTime = { [Op.gt]: currentTime };
		break;
	case 32: // 报名中
		where.reviewStatus = 30;
		where.enrollStartTime = { [Op.lte]: currentTime };
		where.enrollEndTime = { [Op.gte]: currentTime };
		break;
	case 33: // 进行中
		where.reviewStatus = 30;
		where.startTime = { [Op.lte]: currentTime };
		where.endTime = { [Op.gte]: currentTime };
		break;
	case 34: // 已结束
		where.reviewStatus = 30;
		where.endTime = { [Op.lt]: currentTime };
		break;
	case 40:
		where.reviewStatus = 40;
		break;
	default:
		break;
	}

	const roles = await Roles.findAll({ where: { userId: user.userId, role: { [Op.in]: [ 1, 2 ] } } });
	if (!roles || !roles.length) {
		ctx.body = ResService.fail('非管理员不得管理活动');
		return;
	}

	let deptIds = []; // 个人所管理的部门表
	for (let role of roles) {
		if (!where[Op.or]) where[Op.or] = [];
		if (role.role === 2) { // 分会管理员
			deptIds = deptIds.concat(role.deptIds);
		}
	}

	if (deptIds.length) {
		// 当前管理员所管理分会所有管理员发布的活动都可管理
		let allroles = await Roles.findAll({ where: { deptIds: { [Op.overlap]: deptIds } } });

		let allUserIds = [];
		for (let role of allroles) {
			allUserIds.push(role.userId);
		}
		// 此处有漏洞，不过可以通过制定变更
		if (allUserIds.length) {
			where.userId = { [Op.in]: allUserIds };
		}
	}

	const res = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {get} /api/activities/lists?limit=&page=&status=&type= 我可以参与的活动列表
* @apiName activities-lists
* @apiGroup 活动管理
* @apiDescription 活动列表，目前是移动端管理活动列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {Number} [status] 活动状态， 31-预热中 32-报名中 33-进行中 34-已结束 默认为0 表示查询全部状态
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
* @apiSuccess {Number} data.rows.latitude 活动经度
* @apiSuccess {Number} data.rows.longitude 活动纬度
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
* @apiSuccess {String} data.rows.reviewStatus 审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝
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
	case 31: // 预热中
		where.reviewStatus = 30;
		where.enrollStartTime = { [Op.gt]: currentTime };
		break;
	case 32: // 报名中
		where.reviewStatus = 30;
		where.enrollStartTime = { [Op.lte]: currentTime };
		where.enrollEndTime = { [Op.gte]: currentTime };
		break;
	case 33: // 进行中
		where.reviewStatus = 30;
		where.startTime = { [Op.lte]: currentTime };
		where.endTime = { [Op.gte]: currentTime };
		break;
	case 34: // 已结束
		where.reviewStatus = 30;
		where.endTime = { [Op.lt]: currentTime };
		break;
	default:
		where.reviewStatus = 30;
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

module.exports = router;
