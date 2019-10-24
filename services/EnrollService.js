const Enrolls = require('../models/Enrolls');
const EnrollForms = require('../models/EnrollForms');
const UserItems = require('../models/UserItems');
const Activities = require('../models/Activities');
const _ = require('lodash');

class EnrollService {
	/**
   * 獲取我的报名，即家属信息
   * @param {Number} activityId 活動ID
   * @param {Number} userId userId
   * @returns {Array[]} 返回值
   *
   */
	static async getMyEnrolls (activityId, userId) {
		activityId = Number(activityId);
		let activity = await Activities.findOne({ where: { id: activityId } });
		let enroll = await Enrolls.findOne({ activityId, userId, status: 1 });
		if (!activityId || !activity || !enroll) {
			return [];
		}
		let enrollforms = await EnrollForms.findAll({ where: { activityId: activity.id, timestamp: activity.timestamp } });
		let formMap = new Map();
		for (let form of enrollforms) {
			form = form.toJSON();
			formMap.set(form.id, form);
		}
		const userRes = [];
		let useritems = await UserItems.findAll({ where: { activityId, enrollformId: enroll } });
		const itemMap = {};
		// 人员信息归类
		for (let item of useritems) {
			let form = formMap.get(item.enrollformId);
			if (!itemMap[item.userSequence]) itemMap[item.userSequence] = [];
			itemMap[item.userSequence].push({
				id: item.enrollformId,
				title: form.title,
				type: form.type,
				options: form.options,
				mustfill: form.mustfill,
				sequence: form.sequence,
				text: item.text,
				checked: item.checked
			});
		}
		// 排序
		for (let userSequence in itemMap) {
			let userenroll = _.orderBy(itemMap[userSequence], [ 'sequence', 'asc' ]);
			userRes.push(userenroll);
		}
		return userRes;
	}
}

module.exports = EnrollService;
