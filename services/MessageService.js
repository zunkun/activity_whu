const Activities = require('../models/Activities');
const Messages = require('../models/Messages');
const Roles = require('../models/Roles');
const util = require('../core/util');
class MessageService {
	/**
   * 创建活动成功发给审核
   * @param {Number} activityId 活动ID
   */
	static async sendReviewMsg (activityId) {
		let activity = await Activities.findOne({ id: activityId });
		let roles = await Roles.findAll({ where: { userId: activity.userId } });
		let roleDeptIds = [];
		for (let role of roles) {
			roleDeptIds = roleDeptIds.concat(role.deptIds);
		}
		Messages.create({
			userId: activity.userId,
			userName: activity.userName,
			roleDeptIds,
			createTime: activity.createdAt,
			title: activity.title,
			type: 1,
			text: `${util.date2String(activity.createdAt)} “${activity.userName}”发布了新活动${activity.title}`,
			finish: false,
			reviewStatus: 20,
			readUserIds: [],
			activityId
		});
	}

	/**
   * 审核后给创建者发送消息
   * @param {Number} activityId 活动ID
   * @param {Object} activity 活动信息
	 * @param {String} rejectReason 拒绝原因
   */
	static async sendCreatorMsg (reviewStatus, activityId, rejectReason) {
		let activity = await Activities.findOne({ id: activityId });

		await Messages.create({
			userId: activity.userId,
			userName: activity.userName,
			createTime: activity.createdAt,
			title: activity.title,
			type: 2,
			text: `您于${util.date2String(activity.createdAt)}申请的 “${activity.title}”活动`,
			finish: true,
			reviewStatus,
			rejectReason: reviewStatus === 40 ? rejectReason : '',
			readUserIds: [],
			activityId
		});

		await Messages.update({ finish: true, reviewStatus }, { where: { activityId, type: 1 } });
	}
}

module.exports = MessageService;
