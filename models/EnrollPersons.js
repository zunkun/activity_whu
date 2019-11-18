const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 报名填写家属
class Enrolls extends Model {}
Enrolls.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '第几个人排序 1-表示第一个人 2-表示第二个人'
	},
	activityId: {
		type: DataTypes.INTEGER,
		comment: '活动ID'
	},
	enrollId: { type: DataTypes.INTEGER, comment: 'enroll id' },
	type: {
		type: DataTypes.INTEGER,
		comment: '表单类型 1-报名人自己的表单信息 2-家属表单信息'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, timestamps: false, modelName: 'enrollpersons', paranoid: true, comment: '报名填写家属中间表' });

Enrolls.sync();

module.exports = Enrolls;
