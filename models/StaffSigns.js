const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');

// 签到
class StaffSigns extends Model {}
StaffSigns.init({
	userId: {
		type: DataTypes.STRING
	},
	userName: {
		type: DataTypes.STRING
	},
	signType: {
		type: DataTypes.INTEGER,
		comment: '签到方式 1-扫码 2-距离签到'
	},
	latitude: {
		type: DataTypes.FLOAT,
		comment: '签到坐标经度'
	},
	longitude: {
		type: DataTypes.FLOAT,
		comment: '签到坐标纬度'
	},
	address: {
		type: DataTypes.STRING,
		comment: '签到位置'
	},
	distance: {
		type: DataTypes.FLOAT,
		comment: '签到与基点距离'
	},
	signTime: {
		type: DataTypes.DATE,
		comment: '签到时间'
	},
	enrollId: {
		type: DataTypes.INTEGER,
		comment: '报名ID'
	},
	activityId: {
		type: DataTypes.INTEGER,
		comment: '活动ID'
	}
}, { sequelize: postgres, modelName: 'staffsigns', paranoid: true, comment: '签到' });

StaffSigns.belongsTo(Activities);

StaffSigns.sync();

module.exports = StaffSigns;
