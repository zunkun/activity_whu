const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');

// 报名表单
class EnrollForms extends Model {}
EnrollForms.init({
	userId: {
		type: DataTypes.STRING,
		comment: '发起人userId'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, { sequelize: postgres, modelName: 'enrollforms', timestamps: false, paranoid: true, comment: '报名表单' });

EnrollForms.belongsTo(Activities);

EnrollForms.sync();

module.exports = EnrollForms;
