const Enrolls = require('../models/Enrolls');
const Activities = require('../models/Activities');
const EnrollPersons = require('../models/EnrollPersons');
const EnrollFields = require('../models/EnrollFields');

class EnrollService {
	/**
   * 獲取我的报名，即家属信息
   * @param {Number} userId userId
   * @param {Number} activityId 活動ID
	 * @param {Object} activity 活动信息
   * @returns {Object} 返回值
   */
	static async getMyEnrolls (userId, activityId, activity) {
		activityId = Number(activityId);
		if (!activity) {
			activity = await Activities.findOne({ where: { id: activityId } });
		}
		let res = { me: [], familylists: [] };
		if (!activityId || !activity) return res;

		let enroll = await Enrolls.findOne({ where: { activityId, userId } });
		if (!enroll) return res;

		let enrollpersons = await EnrollPersons.findAll({ where: { enrollId: enroll.id, timestamp: enroll.timestamp }, order: [ [ 'sequence', 'ASC' ] ] });

		for (let enrollperson of enrollpersons) {
			let person = [];
			let enrollfields = await EnrollFields.findAll({ where: { enrollpersonId: enrollperson.id }, order: [ [ 'sequence', 'ASC' ] ] });
			for (let field of enrollfields) {
				person.push({
					sequence: field.sequence,
					componentName: field.componentName,
					componentType: field.componentType,
					componentSet: field.componentSet,
					attribute: field.attribute
				});
			}
			if (enrollperson.type === 1) {
				res.me = person;
			} else {
				res.familylists.push(person);
			}
		}
		return res;
	}
}

module.exports = EnrollService;
