const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 常量
class Constants extends Model {}
Constants.init({
	name: {
		type: DataTypes.STRING,
		comment: '类型名称'
	},
	belongsTo: {
		type: DataTypes.INTEGER,
		comment: '数据属于 1-课程类型'
	},
	sequence: {
		type: DataTypes.INTEGER,
		comment: '排序'
	}
}, { sequelize: postgres, modelName: 'constants', timestamps: false, paranoid: true, comment: '常量' });

Constants.sync();

module.exports = Constants;
