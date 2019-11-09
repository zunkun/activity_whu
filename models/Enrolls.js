const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

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
	activityId: { type: DataTypes.INTEGER, comment: 'activity id' },
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'enrolls', paranoid: true, comment: '报名活动的用户' });

Enrolls.sync();

module.exports = Enrolls;
