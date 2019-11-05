const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

class StaffCfg extends Model {}
// 用户配置
StaffCfg.init({
	userId: {
		type: DataTypes.STRING,
		comment: '钉钉用户userId'
	}, // 钉钉用户userId
	userName: {
		type: DataTypes.STRING,
		comment: '姓名'
	}, // 姓名
	catalog: {
		type: DataTypes.STRING,
		comment: '配置分类'
	},
	config: {
		type: DataTypes.JSON,
		comment: '配置'
	}
}, { sequelize: postgres, modelName: 'staffcfgs', timestamps: false, comment: '用户配置' });

StaffCfg.sync();

module.exports = StaffCfg;
