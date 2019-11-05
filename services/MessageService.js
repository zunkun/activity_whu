const Activities = require('../models/Activities');
const Messages = require('../models/Messages');
const util = require('../core/util');
class MessageService {
	/**
   * 创建活动成功发给审核
   * @param {Number} activityId 活动ID
   * @param {Object} activity 活动信息
   */
	static async sendReviewMsg (activityId, activity) {
		if (!activity) {
			activity = await Activities.findOne({ id: activityId });
		}

		Messages.create({
			userId: activity.userId,
			userName: activity.userName,
			createTime: activity.createdAt,
			title: activity.title,
			type: 1,
			text: `${util.date2String(activity.createdAt)} “${activity.userName}”发布了新活动${activity.title}`,
			finish: false,
			reviewStatus: 20,
			activityId
		});
	}

	/**
   * 审核后给创建者发送消息
   * @param {Number} activityId 活动ID
   * @param {Object} activity 活动信息
   */
	static async sendCreatorMsg (reviewStatus, activityId, activity) {
		if (!activity) {
			activity = await Activities.findOne({ id: activityId });
		}

		await Messages.create({
			userId: activity.userId,
			userName: activity.userName,
			createTime: activity.createdAt,
			title: activity.title,
			type: 2,
			text: `您于${util.date2String(activity.createdAt)}申请的 “${activity.title}”活动`,
			finish: true,
			reviewStatus,
			activityId
		});

		await Messages.update({ finish: true, reviewStatus }, { where: { activityId, type: 1 } });
	}
}

module.exports = MessageService;
