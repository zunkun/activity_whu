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

router.prefix('/api/participate');

/**
* @api {post} /api/participate/enroll 报名
* @apiName participate-enroll-post
* @apiGroup 活动参与
* @apiDescription 报名
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiParam {Array[]} formlists 表单
* @apiParam {String} formlists.componentName 组件名称
* @apiParam {String} formlists.componentType 组件类型
* @apiParam {String} formlists.componentSet 组件属性设置类型
* @apiParam {Object} formlists.attribute 组件属性
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
* @apiParamExample {json} 请求body示例
{
  activityId: 1000, // 活动ID
	formlists: [
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
	const { activityId, formlists } = ctx.request.body;
	const currentTime = new Date();
	const activity = await Activities.findOne({ where: { id: activityId } });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统没有当前活动');
		return;
	}
	if (activity.cancel) {
		ctx.body = ResService.fail('当前活动已经取消');
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
	}

	// 报名名额
	let currentCount = await Enrolls.count({ where: { activityId, status: 1 } });
	if (activity.personNum && currentCount >= activity.personNum) {
		ctx.body = ResService.fail('名额已满，不可报名');
		return;
	}

	// 验证报名信息是否合法
	let valid = true;
	if (!Array.isArray(formlists)) {
		valid = false;
	}
	for (let forms of formlists) {
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
	if (!valid) {
		ctx.body = ResService.fail('报名表单参数不正确');
		return;
	}

	let timestamp = Date.now();

	let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId, status: 1 } });
	if (!enroll) {
		// 创建报名
		enroll = await Enrolls.create({
			userId: user.userId,
			userName: user.userName,
			mobile: user.mobile,
			status: 1,
			timestamp,
			activityId
		});
	} else {
		await Enrolls.update({ timestamp }, { where: { id: enroll.id } });
	}

	for (let i = 0, len = formlists.length; i < len; i++) {
		let forms = formlists[i];
		let enrollperson = await EnrollPersons.create({
			activityId,
			enrollId: enroll.id,
			sequence: i + 1,
			timestamp
		});
		for (let j = 0, len2 = forms.length; j < len2; j++) {
			let form = forms[i];
			await EnrollFields.create({
				sequence: j + 1,
				componentName: form.componentName,
				componentType: form.componentType,
				componentSet: form.componentSet,
				attribute: form.attribute,
				activityId,
				enrollId: enroll.id,
				enrollpersonId: enrollperson.id,
				timestamp
			});
		}
	}

	await EnrollPersons.destroy({ where: { enrollId: enroll.id, timestamp: { [Op.ne]: timestamp } } });
	await EnrollFields.destroy({ where: { enrollId: enroll.id, activityId, timestamp: { [Op.ne]: timestamp } } });

	ctx.body = ResService.success({});
	await next();
});

/**
* @api {get} /api/participate/myenroll?activityId= 我的报名信息
* @apiName participate-enroll-myenroll
* @apiGroup 活动参与
* @apiDescription 我的报名，查看当前活动中我的报名
* @apiHeader {String} authorization 登录token
* @apiParam {Number} activityId 活动ID
* @apiSuccess {Array[]} data 报名列表，即家属信息列表，此字段为二维数组
* @apiSuccess {Number} data.sequence 填写项排序
* @apiSuccess {Number} data.id 填写项ID
* @apiSuccess {String} data.componentName 组件名称
* @apiSuccess {String} data.componentType 组件类型
* @apiSuccess {String} data.componentSet 组件属性设置类型
* @apiSuccess {Object} data.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/myenroll', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let { activityId } = ctx.query;
	try {
		let persons = await EnrollService.getMyEnrolls(activityId, user.userId);
		ctx.body = ResService.success(persons);
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
* @apiSuccess {String} data.rows.reviewStatus 审核状态 0-审核中 1-审核通过 2-拒绝
* @apiSuccess {String} data.rows.rejectReason 驳回拒绝原因
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

	const where = { cancel: false, type: Number(query.type) || 1, reviewStatus: 30 };
	const activityIds = [];
	const enrolls = await Enrolls.findAll({ where: { userId: user.userId } });
	for (let enroll of enrolls) {
		activityIds.push(enroll.activityId);
	}

	const res = await Activities.findAndCountAll({ where, limit, offset, order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
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
	const activity = await Activities.findOne({ id: activityId });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统无当前活动');
		return;
	}
	let enrolls = await Enrolls.findAll({ activityId, status: 1 });
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
* @apiSuccess {String} data.userId 钉钉userId
* @apiSuccess {String} data.userNmae 姓名
* @apiSuccess {String} data.mobile 电话
* @apiSuccess {String} data.idcard 身份证id
* @apiSuccess {String} data.enrollTime 报名时间
* @apiSuccess {String} data.signed 是否签到
* @apiSuccess {String} data.signTime 签到时间
* @apiSuccess {Number} data.signType 签到方式 1-扫码 2-位置
* @apiSuccess {Boolean} data.hasfamilies 是否有家属
* @apiSuccess {Array[]} data.enrollpersons 报名列表，即家属信息列表，此字段为二维数组
* @apiSuccess {Number} data.enrollpersons.sequence 填写项排序
* @apiSuccess {Number} data.enrollpersons.id 填写项ID
* @apiSuccess {String} data.enrollpersons.componentName 组件名称
* @apiSuccess {String} data.enrollpersons.componentType 组件类型
* @apiSuccess {String} data.enrollpersons.componentSet 组件属性设置类型
* @apiSuccess {Object} data.enrollpersons.attribute 组件属性
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/enrollpersons', async (ctx, next) => {
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let activityId = Number(query.activityId);
	let where = {};
	const activity = await Activities.findOne({ id: activityId });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统无当前活动');
		return;
	}
	if (query.keywords) {
		where.userName = { [Op.like]: `%${query.keywords}%` };
		where.mobile = { [Op.like]: `%${query.keywords}%` };
	}

	const enrollRes = await Enrolls.findAndCountAll({ where, limit, offset });
	const res = { count: enrollRes.count, rows: [] };
	for (let enroll of enrollRes.rows) {
		let staff = await DingStaffs.findOne({ where: { userId: enroll.userId } });
		let staffsign = await StaffSigns.findOne({ where: { activityId, userId: enroll.userId } });
		let enrollpersons = await EnrollService.getMyEnrolls(activityId, enroll.userId);

		let enrollstaff = {
			userId: enroll.userId,
			userName: enroll.userName,
			mobile: staff.mobile,
			idcard: staff.idcard,
			enrollTime: enroll.createdAt,
			signed: false,
			hasfamilies: enrollpersons.length > 0,
			enrollpersons
		};
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
	const activity = await Activities.findOne({ id: activityId });
	if (!activityId || !activity) {
		ctx.body = ResService.fail('系统没有当前活动');
		return;
	}

	if (activity.cancel) {
		ctx.body = ResService.fail('当前活动已经取消');
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
		if (!longitude || !latitude || !address) {
			ctx.body = ResService.fail('没有经纬度地址信息');
			return;
		}
	}

	// 报名名额
	let currentCount = await Enrolls.count({ where: { activityId, status: 1 } });
	if (currentCount >= activity.personNum) {
		ctx.body = ResService.fail('名额已满，不可报名');
		return;
	}
	let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId, status: 1 } });
	if (!enroll) {
		ctx.body = ResService.fail('没有您的报名信息');
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
			ctx.body = ResService.fail('签到无效，当前不签签到区域内');
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
