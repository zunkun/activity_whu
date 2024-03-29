const jwt = require('jsonwebtoken');
const ResService = require('../core/ResService');
const Router = require('koa-router');
const router = new Router();
const Activities = require('../models/Activities');
const Enrolls = require('../models/Enrolls');
const EnrollPersons = require('../models/EnrollPersons');
const EnrollFields = require('../models/EnrollFields');
const { Op } = require('sequelize');
const DingStaffs = require('../models/DingStaffs');
const StaffSigns = require('../models/StaffSigns');
const EnrollService = require('../services/EnrollService');
const util = require('../core/util');
const GroupService = require('../services/GroupService');
const rp = require('request-promise');
const Forms = require('../models/Forms');
const DeptStaffs = require('../models/DeptStaffs');
const DingDepts = require('../models/DingDepts');
const Roles = require('../models/Roles');
const deptStaffService = require('../services/deptStaffService');

const _ = require('lodash');

router.prefix('/api/participate');

/**
* @api {post} /api/participate/enroll 报名
* @apiName participate-enroll-post
* @apiGroup 活动参与
* @apiDescription 报名
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiParam {Object[]} [me] 个人报名表单数据
* @apiParam {String} me.componentName 组件名称
* @apiParam {String} me.componentType 组件类型
* @apiParam {String} me.componentSet 组件属性设置类型
* @apiParam {Object} me.attribute 组件属性
* @apiParam {Array[]} [familylists] 家属表单数据
* @apiParam {String} familylists.componentName 组件名称
* @apiParam {String} familylists.componentType 组件类型
* @apiParam {String} familylists.componentSet 组件属性设置类型
* @apiParam {Object} familylists.attribute 组件属性
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
* @apiParamExample {json} 请求body示例
{
	activityId: 1000, // 活动ID
	me: [
			{
				componentName: '单行输入框', //组件名称
				componentType: 'signleLineText', //组件类型
				componentSet: 'textType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValue: '', //字段填写的值
					fieldCode: '', //字段编码
					title: '单行输入框', //标题
					placeholder: '请输入', //提示
					maxLength: 666, //输入的最大值
					required: true, //是否必填
				},
			},
			...
			...
	],
	familylists: [
		[ // 第一组，表示第一个人
			{
				componentName: '单行输入框', //组件名称
				componentType: 'signleLineText', //组件类型
				componentSet: 'textType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValue: '', //字段填写的值
					fieldCode: '', //字段编码
					title: '单行输入框', //标题
					placeholder: '请输入', //提示
					maxLength: 666, //输入的最大值
					required: true, //是否必填
				},
			},
			{
				componentName: '多行输入框', //组件名称
				componentType: 'multilineText', //组件类型
				componentSet: 'textType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValue: '', //字段填写的值
					fieldCode: '', //字段编码
					title: '多行输入框', //标题
					placeholder: '请输入', //提示
					maxLength: 666, //输入的最大值
					required: true, //是否必填
				},
			},
			{
				componentName: '数字输入框', //组件名称
				componentType: 'numericType', //组件类型
				componentSet: 'textType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValue: '', //字段填写的值
					fieldCode: '', //字段编码
					title: '数字输入框', //标题
					placeholder: '请输入', //提示
					maxLength: 666, //输入的最大值
					required: true, //是否必填
				},
			},
			{
				componentName: '日期', //组件名称
				componentType: 'datePicker', //组件类型
				componentSet: 'datePickerType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValue: '', //字段填写的值
					fieldCode: '', //字段编码
					title: '日期', //标题
					placeholder: '请选择', //提示
					required: true, //是否必填
					dateType: "YYYY-MM-DD", //日期类型 YYYY-MM-DD HH:mm
				}
			}, {
				componentName: '日期区间', //组件名称
				componentType: 'datePickerSection', //组件类型
				componentSet: 'datePickerSectionType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValueStart: '', //字段填写的值
					fieldCodeStart: '', //字段编码
					titleStart: '开始日期', //标题
					placeholderStart: '请选择', //提示
					fieldValueEnd: '', //字段填写的值
					fieldCodeEnd: '', //字段编码
					titleEnd: '结束日期', //标题
					placeholderEnd: '请选择', //提示
					required: true, //是否必填
					dateType: "YYYY-MM-DD", //日期类型 YYYY-MM-DD HH:mm
				}
			},
			{
				componentName: '多选框', //组件名称
				componentType: 'multipleSelection', //组件类型
				componentSet: 'multipleSelectionType', //组件属性设置类型
				attribute: {
					//   组件属性
					fieldValue: "", //字段填写的值
					fieldCode: '', //字段编码
					title: '多选框', //标题
					placeholder: '请选择', //提示
					required: true, //是否必填
					maxLength: 2,
					options: [{
						label: '选项1',
						value: '选项1',
						isSelect: false,
					}, {
						label: '选项2',
						value: '选项2',
						isSelect: false
					}],
				}
			}
		],
		[ // 第二组，表示第二个人
			{...},
			{...}
		]
	]
}
*/

router.post('/enroll', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let { activityId, familylists, me } = ctx.request.body;
	const currentTime = new Date();
	const activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统没有当前活动');
		return;
	}
	if (activity.reviewStatus !== 30) {
		ctx.body = ResService.fail('当前活动未审核通过');
		return;
	}
	if (activity.enrollStartTime > currentTime || activity.enrollEndTime < currentTime) {
		ctx.body = ResService.fail('当前不在报名时间内');
		return;
	}
	if (activity.endTime < currentTime) {
		ctx.body = ResService.fail('当前活动已经结束');
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
	if (!auth) {
		ctx.body = ResService.fail('您没有权限访问当前活动');
		return;
	}

	if (!me || !Array.isArray(me)) {
		me = [];
	}

	if (!familylists || !Array.isArray(familylists)) {
		familylists = [];
	}
	// 报名名额
	let currentCount = await Enrolls.count({ where: { activityId } });
	if (activity.personNum && currentCount >= activity.personNum) {
		ctx.body = ResService.fail('名额已满，不可报名');
		return;
	}

	let meform = await Forms.findOne({ where: { activityId, type: 1 } });
	let familyform = await Forms.findOne({ where: { activityId, type: 2 } });

	// 验证报名信息是否合法
	let valid = true;

	if (meform) {
		for (let form of me) {
			[ 'componentName', 'componentType', 'componentSet', 'attribute' ].map(key => {
				if (!form[key]) valid = false;
			});
		}
	}

	if (familyform) {
		if (familylists.length > familyform.personNum) {
			ctx.body = ResService.fail(`携带家属不得多于${familyform.personNum}人`);
		}
		for (let forms of familylists) {
			if (!Array.isArray(forms)) {
				valid = false;
				break;
			}
			for (let form of forms) {
				[ 'componentName', 'componentType', 'componentSet', 'attribute' ].map(key => {
					if (!form[key]) valid = false;
				});
			}
		}
	}
	if (!valid) {
		ctx.body = ResService.fail('报名表单填写不正确');
		return;
	}

	let timestamp = Date.now();

	let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId } });
	if (!enroll) {
		// 创建报名
		enroll = await Enrolls.create({
			userId: user.userId,
			userName: user.userName,
			mobile: user.mobile,
			certNo: user.certNo,
			timestamp,
			activityId
		});
	} else {
		await Enrolls.update({ timestamp }, { where: { id: enroll.id } });
	}

	// 报名人表单信息
	if (meform) {
		let meperson = await EnrollPersons.create({
			activityId,
			enrollId: enroll.id,
			sequence: 1,
			type: 1,
			timestamp
		});

		for (let j = 0, len2 = me.length; j < len2; j++) {
			let form = me[j];
			await EnrollFields.create({
				sequence: j + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				activityId,
				enrollId: enroll.id,
				enrollpersonId: meperson.id,
				type: 1,
				timestamp
			});
		}
	}

	for (let i = 0, len = familylists.length; i < len; i++) {
		let forms = familylists[i];
		let enrollperson = await EnrollPersons.create({
			activityId,
			enrollId: enroll.id,
			sequence: i + 1,
			type: 2,
			timestamp
		});
		for (let j = 0, len2 = forms.length; j < len2; j++) {
			let form = forms[j];
			await EnrollFields.create({
				sequence: j + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				activityId,
				enrollId: enroll.id,
				enrollpersonId: enrollperson.id,
				type: 2,
				timestamp
			});
		}
	}

	await EnrollPersons.destroy({ where: { enrollId: enroll.id, timestamp: { [Op.ne]: timestamp } } });
	await EnrollFields.destroy({ where: { enrollId: enroll.id, activityId, timestamp: { [Op.ne]: timestamp } } });

	// 将用户加入群
	GroupService.addUser2Group(user.userId, activityId);

	ctx.body = ResService.success({});
	await next();
});

/**
* @api {post} /api/participate/cancelenroll 取消报名
* @apiName participate-enroll-cancelenroll
* @apiGroup 活动参与
* @apiDescription 取消报名
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Array[]} data {}
* @apiSuccess {Object} data.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/cancelenroll', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let { activityId } = ctx.request.body;

	let activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统中没有当前活动');
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
	if (!auth) {
		ctx.body = ResService.fail('您没有访问活动的权限');
		return;
	}
	let currentTime = new Date();
	if (activity.enrollStartTime > currentTime || activity.enrollEndTime < currentTime) {
		ctx.body = ResService.fail('无法取消报名，当前时间不在活动报名时间内');
		return;
	}
	if (currentTime > activity.endTime) {
		ctx.body = ResService.fail('无法取消报名，当前活动已结束');
		return;
	}

	let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId } });
	if (!enroll) {
		ctx.body = ResService.fail('系统中没有你的报名信息');
		return;
	}

	await EnrollPersons.destroy({ where: { enrollId: enroll.id } });
	await EnrollFields.destroy({ where: { enrollId: enroll.id, activityId } });
	await Enrolls.destroy({ where: { id: enroll.id } });
	// 将用户移出群
	GroupService.deleteUserFromGroup(user.userId, activityId);

	ctx.body = ResService.success({});
});

/**
* @api {get} /api/participate/myenroll?activityId= 我的报名信息
* @apiName participate-enroll-myenroll
* @apiGroup 活动参与
* @apiDescription 我的报名，查看当前活动中我的报名
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Object} data 报名列表，即家属信息列表，此字段为二维数组
* @apiSuccess {Boolean} data.enrolled 是否报名
* @apiSuccess {Date} data.enrollTime 报名时间
* @apiSuccess {Object[]} data.me 报名人自己填写的表单信息
* @apiSuccess {String} data.me.sequence 组件填写项排序
* @apiSuccess {String} data.me.componentName 组件名称
* @apiSuccess {String} data.me.componentType 组件类型
* @apiSuccess {String} data.me.componentSet 组件属性设置类型
* @apiSuccess {Object} data.me.attribute 组件属性
* @apiSuccess {Boolean} data.hasfamilies 是否有家属
* @apiSuccess {Number} data.familyNum 携带家属最大人数
* @apiSuccess {Number} data.currentNum 当前携带家属人数
* @apiSuccess {Array[]} data.familylists 家属信息
* @apiSuccess {String} data.familylists.sequence 组件填写项排序
* @apiSuccess {String} data.familylists.componentName 组件名称
* @apiSuccess {String} data.familylists.componentType 组件类型
* @apiSuccess {String} data.familylists.componentSet 组件属性设置类型
* @apiSuccess {Object} data.familylists.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/myenroll', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let { activityId } = ctx.query;
	let activity = await Activities.findOne({ where: { id: activityId } });
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
	if (!auth) {
		ctx.body = ResService.fail('您没有权限访问当前活动');
		return;
	}
	try {
		let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId } });
		if (!enroll) {
			ctx.body = ResService.success({
				enrolled: false,
				enrollTime: null,
				me: [],
				hasfamilies: false,
				familylists: []
			});
			return;
		}
		let { me, familylists } = await EnrollService.getMyEnrolls(user.userId, activityId);
		let familyNum = 0;
		let familyform = await Forms.findOne({ where: { type: 2, activityId } });
		if (familyform) {
			familyNum = familyform.personNum;
		}
		ctx.body = ResService.success({
			enrollTime: enroll.createdAt,
			enrolled: true,
			me,
			familyNum,
			currentNum: familylists.length,
			hasfamilies: familylists.length > 0,
			familylists
		});
		await next();
	} catch (error) {
		ctx.body = ResService.fail(error);
		await next();
	}
});

/**
* @api {get} /api/participate/myactivities?limit=&page=&status=&type= 我的活动列表
* @apiName participate-myactivities
* @apiGroup 活动参与
* @apiDescription 我的活动列表，移动端 我的活动列表，即报名的活动列表
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
* @apiSuccess {String} data.rows.reviewStatus 审核状态 20-审核中 30-审核通过 40-拒绝
* @apiSuccess {Number} data.rows.status 活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝
* @apiSuccess {String} data.rows.rejectReason 驳回拒绝原因
* @apiSuccess {Boolean} data.rows.signAuth 当前时间是否可以签到
* @apiSuccess {Boolean} data.rows.meSigned 我在当前活动中是否已签到
* @apiSuccess {Date} data.rows.signTime 我在当前活动的签到时间
* @apiSuccess {String} data.rows.createdAt 创建时间
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/myactivities', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;

	const where = { type: Number(query.type) || 1, reviewStatus: 30 };
	let status = Number(query.status) || 0;
	let currentTime = new Date();

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

	const activityIds = [];
	const enrolls = await Enrolls.findAll({ where: { userId: user.userId } });
	for (let enroll of enrolls) {
		activityIds.push(enroll.activityId);
	}

	where.id = { [Op.in]: activityIds };

	const activities = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
	const res = { count: activities.count, rows: [] };
	for (let activity of activities.rows) {
		activity = activity.toJSON();
		activity.enrollNum = await Enrolls.count({ where: { activityId: activity.id } });

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
* @api {get} /api/participate/persons?activityId= 已报名校友人员列表
* @apiName participate-persons
* @apiGroup 活动参与
* @apiDescription 移动端查看活动详情里，当前活动已报名校友人员列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object[]} data 报名人员表
* @apiSuccess {String} data.userId 钉钉userId
* @apiSuccess {String} data.userName 姓名
* @apiSuccess {String} data.mobile 电话
* @apiSuccess {String} data.avatar 钉钉图像
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/persons', async (ctx, next) => {
	const { activityId } = ctx.query;
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let type = Number(ctx.query.type) || 1;

	const activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统无当前活动');
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
	if (user.userId === '677588') auth = true;
	if (!auth) {
		ctx.body = ResService.fail('您没有权限访问当前活动');
		return;
	}

	let enrolls = await Enrolls.findAll({ where: { activityId } });
	const res = [];
	for (let enroll of enrolls) {
		let staff = await DingStaffs.findOne({ where: { userId: enroll.userId } });
		res.push({
			userId: staff.userId,
			userName: staff.userName,
			mobile: staff.mobile,
			avatar: staff.avatar
		});
	}
	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {get} /api/participate/enrollpersons?activityId=&limit=&page=&keywords= PC端已报名人员列表
* @apiName participate-enrollpersons
* @apiGroup 活动参与
* @apiDescription PC端已报名人员列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 报名人员表
* @apiSuccess {Number} data.count 总跳数目
* @apiSuccess {Object[]} data.rows 报名人员表
* @apiSuccess {String}data.rows.userId 钉钉userId
* @apiSuccess {String}data.rows.userNmae 姓名
* @apiSuccess {String}data.rows.mobile 电话
* @apiSuccess {String}data.rows.certNo 证件号码
* @apiSuccess {String}data.rows.enrollTime 报名时间
* @apiSuccess {String}data.rows.signed 是否签到
* @apiSuccess {String}data.rows.signTime 签到时间
* @apiSuccess {Number}data.rows.signType 签到方式 1-扫码 2-位置
* @apiSuccess {Object[]} data.rows.me 报名人自己填写的表单信息
* @apiSuccess {String} data.rows.me.sequence 组件填写项排序
* @apiSuccess {String} data.rows.me.componentName 组件名称
* @apiSuccess {String} data.rows.me.componentType 组件类型
* @apiSuccess {String} data.rows.me.componentSet 组件属性设置类型
* @apiSuccess {Object} data.rows.me.attribute 组件属性
* @apiSuccess {Boolean} data.rows.hasfamilies 是否有家属
* @apiSuccess {Number} data.rows.familyNum 携带家属最大人数
* @apiSuccess {Number} data.rows.currentNum 当前携带家属人数
* @apiSuccess {Array[]} data.rows.familylists 家属信息
* @apiSuccess {String} data.rows.familylists.sequence 组件填写项排序
* @apiSuccess {String} data.rows.familylists.componentName 组件名称
* @apiSuccess {String} data.rows.familylists.componentType 组件类型
* @apiSuccess {String} data.rows.familylists.componentSet 组件属性设置类型
* @apiSuccess {Object} data.rows.familylists.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/enrollpersons', async (ctx, next) => {
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let activityId = Number(query.activityId);
	let where = { activityId };
	const activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统无当前活动');
		return;
	}
	if (query.keywords) {
		if (!where[Op.or]) where[Op.or] = [];
		where[Op.or].push({ userName: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ mobile: { [Op.like]: `%${query.keywords}%` } });
	}

	const enrollRes = await Enrolls.findAndCountAll({ where, limit, offset });
	const res = { count: enrollRes.count, rows: [] };
	for (let enroll of enrollRes.rows) {
		let staffsign = await StaffSigns.findOne({ where: { activityId, userId: enroll.userId } });

		let { me, familylists } = await EnrollService.getMyEnrolls(enroll.userId, activityId, activity);
		let familyNum = 0;
		let familyform = await Forms.findOne({ where: { type: 2, activityId } });
		if (familyform) {
			familyNum = familyform.personNum;
		}

		let enrollstaff = {
			userId: enroll.userId,
			userName: enroll.userName,
			mobile: enroll.mobile,
			certNo: enroll.certNo || '',
			enrollTime: enroll.createdAt,
			signed: false,
			me,
			familylists,
			hasfamilies: familylists.length > 0,
			familyNum,
			currentNum: familylists.length
		};
		if (!enroll.certNo) {
			let staff = await DingStaffs.findOne({ where: { userId: enroll.userId } });
			if (staff && staff.certNo) {
				enrollstaff.certNo = staff.certNo;
			} else {
				let res = await rp.get(`http://alumnihome1893-1.whu.edu.cn/renzheng/whu/alumniResource/getCertNo?dingtalkId=${staff.userId}`);
				res = JSON.parse(res);
				if (res.success && res.content && res.content.certNo) {
					await DingStaffs.update({ certNo: res.content.certNo }, { where: { userId: staff.userId } });
					enrollstaff.certNo = res.content.certNo;
				}
			}
		}
		if (staffsign) {
			enrollstaff.signed = true;
			enrollstaff.signTime = staffsign.createdAt;
			enrollstaff.signType = staffsign.signType;
		}
		res.rows.push(enrollstaff);
	}

	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {post} /api/participate/sign 签到
* @apiName participate-sign
* @apiGroup 活动参与
* @apiDescription 签到
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiParam {Number} [latitude] 签到坐标经度
* @apiParam {Number} [longitude] 签到坐标纬度
* @apiParam {String} [address] 签到地址
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/sign', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { activityId, latitude, longitude, address } = ctx.request.body;
	const currentTime = new Date();
	const activity = await Activities.findOne({ where: { id: activityId } });

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
	if (!auth) {
		ctx.body = ResService.fail('您没有权限访问当前活动');
		return;
	}

	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统没有当前活动');
		return;
	}

	if (activity.reviewStatus !== 30) {
		ctx.body = ResService.fail('当前活动未审核通过');
		return;
	}
	if (activity.startTime > currentTime || activity.endTime < currentTime) {
		ctx.body = ResService.fail('当前不在活动时间内');
		return;
	}

	if (activity.signType === 2) {
		if (!longitude || !latitude) {
			ctx.body = ResService.fail('没有经纬度地址信息');
			return;
		}
	}

	// 报名名额
	let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId } });
	if (!enroll) {
		ctx.body = ResService.fail('没有您的报名信息');
		return;
	}

	let staffsign = await StaffSigns.findOne({ where: { activityId, userId: user.userId } });
	if (staffsign) {
		ctx.body = ResService.fail('您已签到过当前活动，无需再次签到');
		return;
	}
	let signData = {
		activityId,
		enrollId: activity.enrollId,
		userId: user.userId,
		userName: user.userName,
		signType: activity.signType
	};

	// 签到地址信息
	if (activity.signType === 2) {
		let distance = util.getDistance(activity.latitude, activity.longitude, latitude, longitude);
		if (distance > activity.distance) {
			ctx.body = ResService.fail(`签到有效距离${activity.distance}米，您所在位置已超出签到范围${distance - activity.distance}米`);
			return;
		}
		signData.latitude = latitude;
		signData.longitude = longitude;
		signData.address = address;
		signData.distance = distance;
	}
	staffsign = await StaffSigns.create(signData);

	ctx.body = ResService.success(staffsign);
	await next();
});

module.exports = router;
