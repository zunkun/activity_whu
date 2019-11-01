const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 报名表单填写条目
class EnrollFields extends Model {}
EnrollFields.init({
	formSequence: {
		type: DataTypes.INTEGER,
		comment: '填写表单排序'
	},
	sequence: {
		type: DataTypes.INTEGER,
		comment: '组件排序'
	},
	componentName: {
		type: DataTypes.STRING,
		comment: '组件名称'
	},
	componentType: {
		type: DataTypes.STRING,
		comment: '组件类型'
	},
	componentSet: {
		type: DataTypes.STRING,
		comment: '组件属性设置类型'
	},
	attribute: {
		type: DataTypes.JSON,
		comment: '组件属性'
	},
	componentId: {
		type: DataTypes.INTEGER,
		comment: '组件ID'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'enrollfields', timestamps: false, paranoid: true, comment: '报名表单填写条目,当前表跟组件components 一致，此处保留其填写时的所有属性' });

EnrollFields.sync();

module.exports = EnrollFields;
