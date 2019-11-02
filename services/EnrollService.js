const Enrolls = require('../models/Enrolls');
const Activities = require('../models/Activities');
const DingStaffs = require('../models/DingStaffs');
const EnrollPersons = require('../models/EnrollPersons');
const EnrollFields = require('../models/EnrollFields');

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
		if (!activityId || !activity) {
			return Promise.reject('系统无当前活动');
		}
		let user = await DingStaffs.findOne({ where: { userId } });
		let enroll = await Enrolls.findOne({ where: { activityId, userId: user.userId } });
		if (!enroll) {
			return Promise.reject('您尚未报名该活动');
		}
		let persons = [];
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

			persons.push(person);
		}
		return persons;
	}
}

module.exports = EnrollService;
