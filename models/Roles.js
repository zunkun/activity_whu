const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

class Roles extends Model {}
// 角色
Roles.init({
	userId: {
		type: DataTypes.STRING,
		comment: '钉钉用户userId'
	}, // 钉钉用户userId
	userName: {
		type: DataTypes.STRING,
		comment: '姓名'
	}, // 姓名
	role: {
		type: DataTypes.INTEGER,
		comment: '角色 1-总会管理员 2-分会管理员 3-普通校友'
	},
	deptIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '管理的部门deptId表 ，分会和总会有该字段'
	},
	depts: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '部门信息'
	}
}, { sequelize: postgres, modelName: 'roles', timestamps: false, comment: '角色' });

Roles.sync();

module.exports = Roles;
