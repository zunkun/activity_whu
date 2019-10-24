const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');

// 报名表单条目
class EnrollForms extends Model {}
EnrollForms.init({
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
		type: DataTypes.ARRAY(DataTypes.STRING),
		comment: '选项数组 ["男","女"]'
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
}, { sequelize: postgres, modelName: 'enrollforms', timestamps: false, paranoid: true, comment: '报名表单条目' });

EnrollForms.belongsTo(Activities);

EnrollForms.sync();

module.exports = EnrollForms;
