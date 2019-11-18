const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 报名表单填写条目
class EnrollFields extends Model {}
EnrollFields.init({
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
	type: {
		type: DataTypes.INTEGER,
		comment: '表单类型 1-报名人自己的表单信息 2-家属表单信息'
	},
	activityId: { type: DataTypes.INTEGER, comment: 'activity id' },
	enrollId: { type: DataTypes.INTEGER, comment: 'enroll id' },
	enrollpersonId: { type: DataTypes.INTEGER, comment: 'enrollperson id' },
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'enrollfields', timestamps: false, paranoid: true, comment: '报名表单填写条目,当前表跟组件components 一致，此处保留其填写时的所有属性' });

EnrollFields.sync();

module.exports = EnrollFields;
