const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const EnrollForms = require('./EnrollForms');
const Enrolls = require('./Enrolls');

// 报名表单填写条目结果
class UserItems extends Model {}
UserItems.init({
	type: {
		type: DataTypes.INTEGER,
		comment: '数据类型 1-单行文本 2-选择'
	},
	text: {
		type: DataTypes.STRING,
		comment: '条目数据'
	},
	checked: {
		type: DataTypes.STRING,
		comment: '选择的选项标题名称'
	},
	userSequence: {
		type: DataTypes.INTEGER,
		comment: '当前填写人填写的报名表排名1-第一个参与人 2-第二个参与人'
	},
	itemSequence: {
		type: DataTypes.INTEGER,
		comment: '报名表项目排序 如1-表示姓名排第一行 2-表示性别排第二行'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'useritems', timestamps: false, paranoid: true, comment: '报名表单填写条目结果' });

UserItems.belongsTo(Enrolls);
UserItems.belongsTo(EnrollForms);

UserItems.sync();

module.exports = UserItems;
