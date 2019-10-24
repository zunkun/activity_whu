const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');

// 报名活动用户
class Enrolls extends Model {}
Enrolls.init({
	userId: {
		type: DataTypes.STRING,
		comment: '填写人userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '填写人userName'
	},
	mobile: {
		type: DataTypes.STRING,
		comment: '手机'
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '当前报名状态 1-报名成功 2-取消报名'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'enrolls', paranoid: true, comment: '报名活动的用户' });

Enrolls.belongsTo(Activities);

Enrolls.sync();

module.exports = Enrolls;
