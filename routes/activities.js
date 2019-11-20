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
const Messages = require('../models/Messages');
const Enrolls = require('../models/Enrolls');
const StaffSigns = require('../models/StaffSigns');
const GroupService = require('../services/GroupService');

const qr = require('qr-image');
const _ = require('lodash');

router.prefix('/api/activities');

/**
* @api {post} /api/activities 创建活动
* @apiName activities-create
* @apiGroup 活动管理
* @apiDescription 创建活动
* @apiHeader {String} authorization 登录token
* @apiParam {String} title 活动标题
* @apiParam {Number} [type] 活动类型 1-常规活动 2-专项活动 默认1 常规活动 分会可以不用传此字段
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
* @apiParam {Boolean} [signed] 是否需要签到 true 需要签到 false 不需要签到，默认 false 不需要签到
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
*  signed: true,
*  signType: 2, // 签到方式 1-扫码签到 2-位置签到
*  distance: 100, // signType = 2 时填写
*  contactMobile: '156xxx',
*  contactName: '刘遵坤',
*}
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动信息
* @apiSuccess {Number} data.id 活动ID
* @apiSuccess {Boolean} data.needReview 是否需要提交审核
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let roles = await Roles.findAll({ where: { userId: user.userId } });
	let isManagerRole = false;
	let isHighRole = false;
	let managerRole; // 分会管理角色
	let highRole; // 总会管理角色
	let allSubDeptIds = []; // 当前管理员所管理部门的所有子部门ID数组
	let roleDeptIds = []; // // 表示当前人员所管理的所有部门ID
	for (let role of roles) {
		if (role.role === 1) {
			isHighRole = true;
			highRole = role;
		}
		if (role.role === 2) {
			isManagerRole = true;
			managerRole = role;
		}
		for (let deptId of role.deptIds) {
			let subdeptIds = await deptStaffService.getSubDeptIds(deptId);
			allSubDeptIds = allSubDeptIds.concat(subdeptIds);
		}
		roleDeptIds = roleDeptIds.concat(role.deptIds);
	}

	if (!isManagerRole && !isHighRole) {
		ctx.body = ResService.fail('您不是管理员，无权创建活动');
		return;
	}
	const data = ctx.request.body;
	const dataKey = new Set(Object.keys(data));
	let valid = true; // 传参是否正确

	[ 'title', 'startTime', 'endTime', 'enrollStartTime', 'enrollEndTime',
		'personNum' ].map(key => {
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
		type: data.type || 1,
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
		roleDeptIds,
		mobile: user.mobile,
		role: user.role,
		timestamp,
		reviewStatus: 10,
		cancel: false
	};

	let needReview = false;

	const specialUserIds = [];
	const specialUsers = [];
	if (data.specialUserIds && data.specialUserIds.length) {
		for (let userId of data.specialUserIds) {
			let staff = await deptStaffService.getStaff(userId);
			specialUsers.push({ userId, userName: staff.userName });
			specialUserIds.push(userId);
		}
	}

	// 如果指定人员，则为指定人员,人员不决定是否需要审核
	if (specialUserIds.length) {
		activityData.specialUserIds = specialUserIds;
		activityData.specialUsers = specialUsers;
	}

	const deptIds = [];
	const depts = [];
	if (data.deptIds && data.deptIds.length) {
		for (let deptId of data.deptIds) {
			const dept = await deptStaffService.getDeptInfo(deptId);
			depts.push({ deptId, deptName: dept.deptName });
			deptIds.push(deptId);
		}
	}
	if (deptIds.length) {
		activityData.deptIds = deptIds;
		activityData.depts = depts;

		for (let deptId of deptIds) {
			if (allSubDeptIds.indexOf(deptId) === -1) {
				activityData.reviewStatus = 10;
				needReview = true;
				break;
			}
		}
	}
	// 如果是总会管理员，则不需要审核
	if (isHighRole) {
		needReview = false;
	}
	// 如果不需要审核，则状态设置为审核通过
	if (!needReview) {
		activityData.reviewStatus = 30;
	}

	// 如果没有指定人员范围则默认为当前管理员所在的分会或总会部门，不需要审核
	if (!deptIds.length && !specialUserIds.length) {
		if (managerRole) {
			activityData.deptIds = managerRole.deptIds;
			activityData.depts = managerRole.depts;
		}
		if (highRole) {
			activityData.deptIds = highRole.deptIds;
			activityData.depts = highRole.depts;
		}
		activityData.reviewStatus = 30;
		needReview = false;
	}

	const activity = await Activities.create(activityData);
	if (activity.reviewStatus === 30) {
		GroupService.setUserAndDept(user.userId, activity.id, activity);
	}

	ctx.body = ResService.success({ id: activity.id, title: activity.title, needReview });
	await next();
});

/**
* @api {post} /api/activities/update 修改活动
* @apiName activities-update
* @apiGroup 活动管理
* @apiDescription 修改活动,活動开始之后，不可再修改活动时间和报名时间
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 活动ID
* @apiParam {String} title 活动标题
* @apiParam {Number} type 活动类型 1-常规活动 2-专项活动
* @apiParam {String[]} images 活动图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiParam {Date} [startTime] 开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} [endTime] 结束时间 格式 2019-08-24 08:00:00
* @apiParam {Date} [enrollStartTime] 报名开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} [enrollEndTime] 报名截止时间 格式 2019-08-24 08:00:00
* @apiParam {Number} personNum 可参与人数
* @apiParam {String[]} descImages 活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]
* @apiParam {String} descText 活动详情文字
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiParam {Number[]} [specialUserIds] 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiParam {Number} latitude 地址经度
* @apiParam {Number} longitude 地址纬度
* @apiParam {String} address 活动地址
* @apiParam {Boolean} [signed] 是否需要签到 true 需要签到 false 不需要签到，默认 false 不需要签到
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
*  signed: true,
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

	[ 'title', 'type', 'startTime', 'endTime', 'enrollStartTime', 'enrollEndTime',
		'personNum' ].map(key => {
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
	let currentTime = new Date();
	if (activity.startTime <= currentTime) {
		delete activityData.startTime;
		delete activityData.endTime;
		delete activityData.enrollStartTime;
		delete activityData.enrollEndTime;
	}

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
	let activity = await Activities.findOne({ where: { id: activityId } });
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
	MessageService.start2Reviewer(activityId, activity);
	MessageService.start2Creator(activityId, activity);
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
	let { reviewStatus, activityId, rejectReason } = ctx.request.body;
	let role = await Roles.findOne({ where: { userId: user.userId, role: 1 } });
	if (!role) {
		ctx.body = ResService.fail('您非总会管理员，无权审批活动');
		return;
	}
	let allSubDeptIds = [];
	for (let deptId of role.deptIds) {
		let subdeptIds = await deptStaffService.getSubDeptIds(deptId);
		allSubDeptIds = allSubDeptIds.concat(subdeptIds);
	}
	let activity = await Activities.findOne({ where: { id: activityId } });
	if (!activity) {
		ctx.body = ResService.fail('系统中无当前活动');
		return;
	}
	if (activity.status !== 20) {
		ctx.body = ResService.fail('当前活动不需要审核');
		return;
	}
	// 当前管理员所管理部门子部门ID表与活动发起者所管理部门ID有交集，则该活动发起者发起的活动归当前管理员管理
	if (!_.intersection(allSubDeptIds, activity.roleDeptIds).length) {
		ctx.body = ResService.fail('您没有权限审核该活动');
		return;
	}

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

	// 给活动创建者发消息
	MessageService.finish2Creator(reviewStatus, activityId, rejectReason);

	// 创建群
	if (reviewStatus === 30) {
		GroupService.setUserAndDept(activity.userId, activityId, activity);
	}
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

	await Activities.update({ reviewStatus: 10, cancel: true }, { where: { id: activityId } });
	// 更新消息状态
	Messages.update({ finish: true }, { where: { activityId } });
	GroupService.deleteDept(activityId);
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {post} /api/activities/delete 删除活动
* @apiName activities-delete
* @apiGroup 活动管理
* @apiDescription 删除活动
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/delete', async (ctx, next) => {
	let { activityId } = ctx.request.body;
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	if (activity.userId !== user.userId) {
		ctx.body = ResService.fail('您非本活动创建人，无权删除本活动');
		return;
	}

	// 更新消息状态
	Messages.destroy({ where: { activityId } });
	await Activities.destroy({ where: { id: activityId } });
	// 删除校友活动部门
	GroupService.deleteDept(activityId);
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {get} /api/activities/qrcode?activityId= 活动二维码
* @apiName activities-qrcode
* @apiGroup 活动管理
* @apiDescription 活动二维码，前端  img 标签 src = /activity_api/api/activities/qrcode?activityId=
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动列表
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 二维码
* @apiSuccess {String}  data.rows.rejectReason 拒绝原因
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/qrcode', async (ctx, next) => {
	var activityId = ctx.query.activityId;
	try {
		var img = qr.image(activityId, { size: 10 });

		ctx.type = 'image/png';
		ctx.body = img;
	} catch (e) {
		ctx.body = ResService.fail('QRCODE NOT FOUND');
	}
});

/**
* @api {get} /api/activities/messages?limit=&page= 我的消息
* @apiName activities-message-lists
* @apiGroup 活动管理
* @apiDescription 我的消息列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 活动列表
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 返回结果
* @apiSuccess {Number} data.count 总共消息条数
* @apiSuccess {Object[]} data.rows 当前页消息列表
* @apiSuccess {Number}  data.rows.id 消息ID
* @apiSuccess {String}  data.rows.isRead 当前消息是否已读
* @apiSuccess {String}  data.rows.userId 活动创建人userId
* @apiSuccess {String}  data.rows.userName 活动创建人
* @apiSuccess {String}  data.rows.title 活动标题
* @apiSuccess {Date}  data.rows.createTime 活动发起时间
* @apiSuccess {Number}  data.rows.type 消息类型 1-审核提示消-息给管理者  2-审核结束消息-给发起者 3-活动发起式提示消息-给发起者
* @apiSuccess {String}  data.rows.text 消息内容
* @apiSuccess {Boolean}  data.rows.finish 审批否处理完毕，如果审核操作结束或者撤销活动，则当前字段为true
* @apiSuccess {Number}  data.rows.reviewStatus 活动审核状态 20-审核中 30-审核通过 40-拒绝
* @apiSuccess {String}  data.rows.rejectReason 拒绝原因
* @apiSuccess {Object[]} data.rows.reviewUsers 审核活动的管理员列表
* @apiSuccess {String} data.rows.reviewUsers.userId 审核者userId
* @apiSuccess {String} data.rows.reviewUsers.userName 审核者userName
* @apiSuccess {String} data.rows.reviewUsers.mobile 手机
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/messages', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;

	let roles = await Roles.findAll({ where: { userId: user.userId, role: { [Op.in]: [ 1, 2 ] } } });
	if (!roles || !roles.length) {
		ctx.body = ResService.success([]);
		return;
	}

	const where = { [Op.or]: [ { userId: user.userId, type: { [Op.in]: [ 2, 3 ] } } ] };
	let role = await Roles.findOne({ where: { userId: user.userId, role: 1 } });
	let allSubDeptIds = []; // 所管理部门所有子部门ID
	for (let deptId of role.deptIds) {
		let subdeptIds = await deptStaffService.getSubDeptIds(deptId);
		allSubDeptIds = allSubDeptIds.concat(subdeptIds);
	}
	if (role) {
		where[Op.or] = [
			{ userId: user.userId, type: { [Op.in]: [ 2, 3 ] } }, // 分会管理员收到审核结果信息
			{ type: 1, roleDeptIds: { [Op.overlap]: allSubDeptIds } } // 总会管理员收到所管理部门的子部门发起的审核信息
		];
	}

	let messages = await Messages.findAndCountAll({
		where,
		limit,
		offset,
		order: [ [ 'createdAt', 'DESC' ], [ 'type', 'ASC' ] ]
	});

	const res = { count: messages.count, rows: [] };
	for (let message of messages.rows) {
		message = message.toJSON();

		let readUserIds = message.readUserIds || [];
		if (readUserIds.indexOf(user.userId) === -1) {
			readUserIds.push(user.userId);
			Messages.update({ readUserIds }, { where: { id: message.id } });
		}
		message.isRead = true;
		delete message.readUserIds;
		res.rows.push(message);
	}

	ctx.body = ResService.success(res);
});

/**
* @api {post} /api/activities/readmsg 设置消息已读【废弃】
* @apiName activities-message-read
* @apiGroup 活动管理
* @apiDescription 设置消息已读
* @apiHeader {String} authorization 登录token
* @apiParam {Number} messageId 消息ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/readmsg', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { messageId } = ctx.request.body;

	let message = await Messages.findOne({ id: messageId });
	if (!message) {
		ctx.body = ResService.fail('参数错误');
		return;
	}

	let readUserIds = message.readUserIds || [];
	if (readUserIds.indexOf(user.userId) === -1) {
		readUserIds.push(user.userId);
		await Messages.update({ readUserIds }, { where: { id: messageId } });
	}
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {get} /api/activities/msgnoread 获取未读消息条数
* @apiName activities-message-no-read
* @apiGroup 活动管理
* @apiDescription 获取未读消息条数
* @apiHeader {String} authorization 登录token
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 返回结果
* @apiSuccess {Number} data.count 当前未读消息条数
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/msgnoread', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));

	let roles = await Roles.findAll({ where: { userId: user.userId, role: { [Op.in]: [ 1, 2 ] } } });
	if (!roles || !roles.length) {
		ctx.body = ResService.success([]);
		return;
	}

	let allWhere = { [Op.or]: [ { userId: user.userId, type: { [Op.in]: [ 2, 3 ] } } ] };
	let role = await Roles.findOne({ where: { userId: user.userId, role: 1 } });
	if (role) {
		allWhere[Op.or] = [
			{ userId: user.userId, type: { [Op.in]: [ 2, 3 ] } },
			{ type: 1 }
		];
	}
	let readWhere = { readUserIds: { [Op.contains]: [ user.userId ] } };

	let readCount = await Messages.count({ where: readWhere });
	let allCount = await Messages.count({ where: allWhere });
	ctx.body = ResService.success({ count: allCount - readCount });
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
* @apiSuccess {Number}  data.rows.enrollNum 已报名人数
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
* @apiSuccess {Boolean} data.rows.signed 是否需要签到 true 需要签到 false 不需要签到
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
* @apiSuccess {Number} data.rows.status 活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝
* @apiSuccess {Boolean} data.rows.signAuth 当前时间是否可以签到
* @apiSuccess {Boolean} data.rows.meSigned 我在当前活动中是否已签到
* @apiSuccess {Date} data.rows.signTime 我在当前活动的签到时间
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
	// 当前校友所在部门在活动范围部门子部门中
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
	const activities = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
	const res = { count: activities.count, rows: [] };
	for (let activity of activities.rows) {
		activity = activity.toJSON();
		activity.enrollNum = await Enrolls.count({ where: { activityId: activity.id, status: 1 } });

		let reviewStatus = activity.reviewStatus;
		let enrollStartTime = activity.enrollStartTime;
		let enrollEndTime = activity.enrollEndTime;
		let startTime = activity.startTime;
		let endTime = activity.endTime;
		let status = reviewStatus;
		if ([ 10, 20, 40 ].indexOf(reviewStatus) > -1) {
			status = reviewStatus;
		} else if (reviewStatus === 30) {
			if (currentTime < enrollStartTime) {
				status = 31;
			}
			if (currentTime >= enrollStartTime && currentTime <= enrollEndTime) {
				status = 32;
			}
			if (currentTime < startTime) {
				if (currentTime < enrollStartTime) {
					status = 31;
				} else if (currentTime >= enrollStartTime && currentTime <= enrollEndTime) {
					status = 32;
				} else {
					status = 35;
				}
			}
			if (currentTime >= startTime && currentTime <= endTime) {
				status = 33;
			}
			if (currentTime > endTime) {
				status = 34;
			}
		}
		activity.status = status;
		activity.meSigned = false;
		activity.signTime = null;
		activity.signAuth = false; // 当前时间是否可以签到
		let staffsign = await StaffSigns.findOne({ where: { activityId: activity.id, userId: user.userId } });
		// 当前活动是否已签到
		if (activity.signed) {
			if (staffsign) {
				activity.meSigned = true;
				activity.signTime = staffsign.createdAt;
				activity.signAuth = false;
			} else {
				if (currentTime >= startTime && currentTime <= endTime) {
					activity.signAuth = true;
				}
			}
		}

		res.rows.push(activity);
	}

	ctx.body = ResService.success(res);
});

/**
* @api {get} /api/activities/:id?type= 活动详情
* @apiName activities-detail
* @apiGroup 活动管理
* @apiDescription 获取活动详情
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 活动ID
* @apiParam {Number} type 活动详情权限 1-移动端参与活动 2--管理员管理活动 默认为1
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
* @apiSuccess {Boolean} data.signed 是否需要签到 true 需要签到 false 不需要签到
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
* @apiSuccess {Number} data.status 活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝
* @apiSuccess {String} data.rejectReason 驳回拒绝原因
* @apiSuccess {Boolean} data.highAuthority 是否能够审批该活动
* @apiSuccess {Boolean} data.needReview 是否需要提交审核
* @apiSuccess {Boolean} data.cancelAuthority 是否有撤销权限
* @apiSuccess {Boolean} data.signAuth 当前时间是否可以签到
* @apiSuccess {Boolean} data.meSigned 我在当前活动中是否已签到
* @apiSuccess {Date} data.signTime 我在当前活动的签到时间
* @apiSuccess {String} data.createdAt 创建时间
* @apiSuccess {Boolean} data.cancel 是否撤销 true-撤销
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/:id', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let type = ctx.query.type || 1;

	const id = ctx.params.id;

	let activity = await Activities.findOne({ where: { id } });
	if (!activity) {
		ctx.body = ResService.fail('系统无法查询到活动信息');
		return;
	}

	// 我所在部门
	let deptIds = [];
	const deptStaffs = await DeptStaffs.findAll({ where: { userId: user.userId } });
	for (let deptStaff of deptStaffs) {
		let dept = await DingDepts.findOne({ where: { deptId: deptStaff.deptId } });
		deptIds = deptIds.concat(dept.deptPaths);
	}
	deptIds = Array.from(new Set(deptIds));
	let auth = false;
	if (activity.specialUserIds && activity.specialUserIds.indexOf(user.userId) > -1) {
		auth = true;
	}
	if (activity.deptIds && _.intersection(activity.deptIds, deptIds).length) {
		auth = true;
	}
	if (!auth && type === 2) { // 管理活动访问活动详情权限
		let roles = await Roles.findAll({ where: { userId: user.userId, role: { [Op.in]: [ 1, 2 ] } } });

		let allSubDeptIds = []; // 个人所管理的部门表
		for (let role of roles) {
			for (let deptId of role.deptIds) {
				let subdeptIds = await deptStaffService.getSubDeptIds(deptId);
				allSubDeptIds = allSubDeptIds.concat(subdeptIds);
			}
		}
		if (allSubDeptIds.length && _.intersection(activity.roleDeptIds, allSubDeptIds).length) {
			auth = true;
		}
	}
	if (!auth) {
		ctx.body = ResService.fail('您没有权限访问当前活动');
		return;
	}

	activity = activity.toJSON();

	let creatorDeptIds = [];
	let creatorStaffDepts = await DeptStaffs.findAll({ where: { userId: activity.userId } });
	for (let staffdept of creatorStaffDepts) {
		creatorDeptIds.push(staffdept.deptId);
	}
	const role = await Roles.findOne({ where: { userId: user.userId, role: 1 } });

	let highRole = false;

	let allSubDeptIds = []; // 个人作为总会管理员所管理所有子部门列表
	if (role) {
		highRole = true;
		for (let deptId of role.deptIds) {
			let subdeptIds = await deptStaffService.getSubDeptIds(deptId);
			allSubDeptIds = allSubDeptIds.concat(subdeptIds);
		}
	}

	activity.highAuthority = false;
	// 有审核权限 1. 总会管理员
	// 2.所管理子部门ID表与当前活动创建人所管理的部门ID有交集
	if (highRole && _.intersection(allSubDeptIds, activity.roleDeptIds).length) {
		activity.highAuthority = true;
	}

	let currentTime = new Date();
	let reviewStatus = activity.reviewStatus;
	let enrollStartTime = activity.enrollStartTime;
	let enrollEndTime = activity.enrollEndTime;
	let startTime = activity.startTime;
	let endTime = activity.endTime;
	let status = reviewStatus;
	if ([ 10, 20, 40 ].indexOf(reviewStatus) > -1) {
		status = reviewStatus;
	} else if (reviewStatus === 30) {
		if (currentTime < enrollStartTime) {
			status = 31;
		}
		if (currentTime >= enrollStartTime && currentTime <= enrollEndTime) {
			status = 32;
		}
		if (currentTime < startTime) {
			if (currentTime < enrollStartTime) {
				status = 31;
			} else if (currentTime >= enrollStartTime && currentTime <= enrollEndTime) {
				status = 32;
			} else {
				status = 35;
			}
		}
		if (currentTime >= startTime && currentTime <= endTime) {
			status = 33;
		}
		if (currentTime > endTime) {
			status = 34;
		}
	}
	activity.status = status;

	// 是否需要提交审核,表示没法发送审核消息
	activity.needReview = false;
	if (activity.status === 10 && activity.userId === user.userId) {
		let message = await Messages.findOne({ where: { type: 1, activityId: id } });
		if (!message) {
			activity.needReview = true;
		}
	}
	// 是否有撤销活动的权限
	activity.cancelAuthority = false;
	if (activity.userId === user.userId) {
		activity.cancelAuthority = true;
	}

	activity.meSigned = false;
	activity.signTime = null;
	activity.signAuth = false; // 当前时间是否可以签到
	let staffsign = await StaffSigns.findOne({ where: { activityId: activity.id, userId: user.userId } });
	// 当前活动是否已签到
	if (activity.signed) {
		if (staffsign) {
			activity.meSigned = true;
			activity.signTime = staffsign.createdAt;
			activity.signAuth = false;
		} else {
			if (currentTime >= startTime && currentTime <= endTime) {
				activity.signAuth = true;
			}
		}
	}

	ctx.body = ResService.success(activity);
	await next();
});

/**
* @api {get} /api/activities?limit=&page=&keywords=&status=&type= 活动列表
* @apiName activities-pc-lists
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
* @apiSuccess {Number}  data.rows.enrollNum 已报名人数
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
* @apiSuccess {Boolean} data.rows.signed 是否需要签到 true 需要签到 false 不需要签到
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
* @apiSuccess {Number} data.rows.reviewStatus 审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝
* @apiSuccess {Number} data.rows.status 活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝
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
		if (!where[Op.or]) where[Op.or] = [];
		where[Op.or].push({ title: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ descText: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ userName: { [Op.like]: `%${query.keywords}%` } });
	}
	if (query.type) {
		where.type = Number(query.type) || 1;
	}

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
	let allSubDeptIds = []; // 个人所管理的部门表
	for (let role of roles) {
		for (let deptId of role.deptIds) {
			let subdeptIds = await deptStaffService.getSubDeptIds(deptId);
			allSubDeptIds = allSubDeptIds.concat(subdeptIds);
		}
	}
	if (!where[Op.or]) {
		where[Op.or] = [
			{ userId: user.userId }, // 自己创建的活动
			{ userId: { [Op.ne]: user.userId }, roleDeptIds: { [Op.overlap]: allSubDeptIds }, reviewStatus: { [Op.ne]: 10 } } // 自己所管理的部门子部门id表与活动创建人所管理的部门ID表有交集，则可管理活动, 不是自己管理的活动编辑装填就不要看了
		];
	}

	const activities = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
	const res = { count: activities.count, rows: [] };
	for (let activity of activities.rows) {
		activity = activity.toJSON();
		activity.enrollNum = await Enrolls.count({ where: { activityId: activity.id, status: 1 } });
		let reviewStatus = activity.reviewStatus;
		let enrollStartTime = activity.enrollStartTime;
		let enrollEndTime = activity.enrollEndTime;
		let startTime = activity.startTime;
		let endTime = activity.endTime;
		let status = reviewStatus;
		if ([ 10, 20, 40 ].indexOf(reviewStatus) > -1) {
			status = reviewStatus;
		} else if (reviewStatus === 30) {
			if (currentTime < enrollStartTime) {
				status = 31;
			}
			if (currentTime >= enrollStartTime && currentTime <= enrollEndTime) {
				status = 32;
			}
			if (currentTime < startTime) {
				if (currentTime < enrollStartTime) {
					status = 31;
				} else if (currentTime >= enrollStartTime && currentTime <= enrollEndTime) {
					status = 32;
				} else {
					status = 35;
				}
			}
			if (currentTime >= startTime && currentTime <= endTime) {
				status = 33;
			}
			if (currentTime > endTime) {
				status = 34;
			}
		}
		activity.status = status;

		res.rows.push(activity);
	}
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
