const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 活动
class Activities extends Model {}

Activities.init({
	title: {
		type: DataTypes.STRING,
		comment: '活动标题'
	},
	type: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '活动类型 1-常规活动 2-专项活动'
	},
	typeName: {
		type: DataTypes.STRING,
		comment: '活动类型名称'
	},
	images: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		comment: '活动图片名称ID表，比如 [1,2,3]'
	},
	startTime: {
		type: DataTypes.DATE,
		comment: '开始时间'
	},
	endTime: {
		type: DataTypes.DATE,
		comment: '截止时间'
	},
	enrollStartTime: {
		type: DataTypes.DATE,
		comment: '报名开始时间'
	},
	enrollEndTime: {
		type: DataTypes.DATE,
		comment: '报名截止时间'
	},
	personNum: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '可报名人数'
	},
	descImages: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		comment: '详情图片名称ID表，比如 [1,2,3]'
	},
	descText: {
		type: DataTypes.TEXT,
		comment: '详情文字'
	},
	deptIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '参与人员范围,即分会deptId 空则为所有分会，否则为特定分会表'
	},
	depts: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '参与人员范围，deptId, deptName'
	},
	specialUserIds: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		comment: '特殊参与人员userId表，注意此和dept下的人员是平级，可以同时选择'
	},
	specialUsers: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '特殊参与人员，本人员是部门列表外人员, userId, userName'
	},
	address: {
		type: DataTypes.STRING,
		comment: '活动地址'
	},
	isSigned: {
		type: DataTypes.BOOLEAN,
		comment: '是否需要签到 true 需要签到 false 不需要签到',
		defaultValue: false
	},
	signType: {
		type: DataTypes.INTEGER,
		comment: '签到方式 1-扫码签到 2-位置签到'
	},
	distance: {
		type: DataTypes.INTEGER,
		comment: '位置签到距离，单位m'
	},
	top: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		comment: '是否置顶 true 置顶 false 不置顶'
	},
	contactMobile: {
		type: DataTypes.STRING,
		comment: '联系人手机号'
	},
	contactName: {
		type: DataTypes.STRING,
		comment: '联系人姓名'
	},
	userId: {
		type: DataTypes.STRING,
		comment: '发起人userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '发起人userName'
	},
	mobile: {
		type: DataTypes.STRING,
		comment: '发起人手机'
	},
	role: {
		type: DataTypes.STRING,
		comment: '发起人身份'
	},
	reviewerUserId: {
		type: DataTypes.STRING,
		comment: '审核人userId'
	},
	reviewerUserName: {
		type: DataTypes.STRING,
		comment: '审核人userName'
	},
	reviewerRole: {
		type: DataTypes.STRING,
		comment: '审核人身份'
	},
	reviewStatus: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		comment: '审核状态 0-审核中 1-审核通过 2-拒绝'
	}
}, { sequelize: postgres, modelName: 'activities', timestamps: false, paranoid: true, comment: '活动信息表' });

Activities.sync();

module.exports = Activities;
