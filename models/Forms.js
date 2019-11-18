const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 报名表单条目
class Forms extends Model {}
Forms.init({
	activityId: {
		type: DataTypes.INTEGER,
		comment: '活动ID'
	},
	type: {
		type: DataTypes.INTEGER,
		comment: '表单类型 1-报名人自己的表单信息 2-家属表单信息'
	},
	personNum: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '报名表单最大人数 当type = 1是 该值为 1'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'forms', timestamps: false, paranoid: true, comment: '报名表单' });

Forms.sync();

module.exports = Forms;
