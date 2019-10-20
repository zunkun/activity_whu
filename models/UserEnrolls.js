const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');
const Enrollforms = require('./Enrollforms');

// 报名表单
class UserEnrolls extends Model {}
UserEnrolls.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '当前填写人填写的报名表排名1-第一个参与人 2-第二个参与人'
	},
	userId: {
		type: DataTypes.STRING,
		comment: '填写人userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '填写人userName'
	}
}, { sequelize: postgres, modelName: 'userenrolls', timestamps: false, paranoid: true, comment: '报名表单填写' });

UserEnrolls.belongsTo(Activities);
UserEnrolls.belongsTo(Enrollforms);

UserEnrolls.sync();

module.exports = UserEnrolls;
