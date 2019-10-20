const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const FormItems = require('./FormItems');
const UserEnrolls = require('./UserEnrolls');

// 报名表单填写条目结果
class EnrollItems extends Model {}
EnrollItems.init({
	type: {
		type: DataTypes.INTEGER,
		comment: '数据类型 1-单行文本 2-选择'
	},
	text: {
		type: DataTypes.STRING,
		comment: '条目数据'
	},
	checkedUuid: {
		type: DataTypes.STRING,
		comment: '选择的选项 uuid'
	},
	checkTitle: {
		type: DataTypes.STRING,
		comment: '选择的选项标题名称'
	}
}, { sequelize: postgres, modelName: 'enrollitems', timestamps: false, paranoid: true, comment: '报名表单填写条目结果' });

EnrollItems.belongsTo(UserEnrolls);
EnrollItems.belongsTo(FormItems);

EnrollItems.sync();

module.exports = EnrollItems;
