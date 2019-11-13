const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 活动创建群和部门
class ActivityGroups extends Model {}
ActivityGroups.init({
	deptId: {
		type: DataTypes.INTEGER,
		unique: true,
		comment: '钉钉部门id'
	}, // 钉钉部门deptId
	deptName: {
		type: DataTypes.STRING,
		comment: '部门名称'
	}, // 部门名称
	parentId: {
		type: DataTypes.INTEGER,
		comment: '父部门deptId'
	},
	activityId: {
		type: DataTypes.INTEGER,
		comment: '活动ID'
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		comment: '建群状态 0-创建中或状态未知  1-成功 2-失败'
	}
}, { sequelize: postgres, modelName: 'activitygroups', timestamps: false, comment: '活动创建群和部门' });

ActivityGroups.sync();

module.exports = ActivityGroups;
