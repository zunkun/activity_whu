const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 钉钉组织同步记录
class DingSyncs extends Model {}

DingSyncs.init({
	date: {
		type: DataTypes.DATEONLY,
		unique: true
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	} // 0-没有同步 1-同步成功 2-同步失败
}, { sequelize: postgres, modelName: 'dingsyncs', comment: '钉钉组织架构同步记录' });

DingSyncs.sync();

module.exports = DingSyncs;
