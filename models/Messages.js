const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');

// 报名活动用户
class Messages extends Model {}
Messages.init({
	userId: {
		type: DataTypes.STRING,
		comment: '活动发起人userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '活动发起人userName'
	},
	createTime: {
		type: DataTypes.DATE,
		comment: '活动发起时间'
	},
	title: {
		type: DataTypes.STRING,
		comment: '活动标题'
	},
	type: {
		type: DataTypes.INTEGER,
		comment: '消息类型 1-审核提示消-息给管理者  2-审核结束消息-给发起者'
	},
	text: {
		type: DataTypes.STRING,
		comment: '消息内容'
	},
	finish: {
		type: DataTypes.BOOLEAN,
		comment: '消息所指的活动是否处理完毕'
	},
	readUserIds: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		comment: '当前消息已读的userId表,注意当前字段在 finish 字段为 false 时有效'
	},
	reviewStatus: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '活动审核状态 '
	}
}, { sequelize: postgres, modelName: 'messages', paranoid: true, comment: '消息' });

Messages.belongsTo(Activities);

Messages.sync();

module.exports = Messages;
