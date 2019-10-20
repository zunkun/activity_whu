const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

class DingStaffs extends Model {}
// 系统用户
DingStaffs.init({
	userId: {
		type: DataTypes.STRING,
		unique: true,
		comment: '钉钉用户userId'
	}, // 钉钉用户userId
	userName: {
		type: DataTypes.STRING,
		comment: '姓名'
	}, // 姓名
	jobnumber: {
		type: DataTypes.STRING,
		comment: '工号'
	}, // 工号
	avatar: {
		type: DataTypes.STRING,
		comment: '人物图像'
	}, // 人物图像
	mobile: {
		type: DataTypes.STRING,
		comment: '手机'
	}
}, { sequelize: postgres, modelName: 'dingstaffs', timestamps: false, comment: '钉钉用户' });

DingStaffs.sync();

module.exports = DingStaffs;
