const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 报名表单条目
class Components extends Model {}
Components.init({
	formId: {
		type: DataTypes.STRING,
		comment: '表单标识，这个和ID不同，该标识表示组件属于一个表单'
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
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'components', timestamps: false, paranoid: true, comment: '报名表单条目' });

Components.sync();

module.exports = Components;
