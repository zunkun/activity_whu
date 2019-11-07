const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 钉钉组织架构
class DingDepts extends Model {}
DingDepts.init({
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
	deptPaths: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '部门路径表'
	},
	subdeptIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '所有子部门deptId 表'
	}
}, { sequelize: postgres, modelName: 'dingdepts', timestamps: false, comment: '钉钉组织架构' });

DingDepts.sync();

module.exports = DingDepts;
