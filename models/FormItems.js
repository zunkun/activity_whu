const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');
const EnrollForms = require('./EnrollForms');

// 报名表单条目
class FormItems extends Model {}
FormItems.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '报名填写项目排序, 1,2,3'
	},
	title: {
		type: DataTypes.STRING,
		comment: '标题，比如姓名，性别'
	},
	type: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '类型 1-单行文本 2-选择'
	},
	options: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '选择类型时选项表 sequence: 1, title: "abcd", uuid'
	},
	mustfill: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		comment: '是否必填，true必填 false 选填'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'formitems', timestamps: false, paranoid: true, comment: '报名表单条目' });

FormItems.belongsTo(Activities);
FormItems.belongsTo(EnrollForms);

FormItems.sync();

module.exports = FormItems;
