const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Activities = require('./Activities');

// 报名活动用户
class Messages extends Model {}
Messages.init({
	userIds: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		comment: '消息接收人userId表'
	},
	users: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '接收人对象表[{userId, userName}] '
	},
	deptIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '消息接收部门deptId表'
	},
	depts: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '接收人对象表[{userId, userName}] '
	},
	type: {
		type: DataTypes.INTEGER,
		comment: '消息类型 1-审核提示消-息给管理者  2-审核结束消息-给发起者'
	},
	text: {
		type: DataTypes.STRING,
		comment: '消息内容'
	},
	read: {
		type: DataTypes.BOOLEAN,
		comment: '是否已读'
	},
	finish: {
		type: DataTypes.BOOLEAN,
		comment: '消息所指的活动是否处理完毕'
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '消息是否'
	}
}, { sequelize: postgres, modelName: 'Messages', paranoid: true, comment: '消息' });

Messages.belongsTo(Activities);

Messages.sync();

module.exports = Messages;
