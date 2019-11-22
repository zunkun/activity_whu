const Activities = require('../models/Activities');
const Messages = require('../models/Messages');
const Roles = require('../models/Roles');
const util = require('../core/util');
const DingDepts = require('../models/DingDepts');
const DeptStaffs = require('../models/DeptStaffs');
const DingStaffs = require('../models/DingStaffs');
const { Op } = require('sequelize');
class MessageService {
	/**
	 * 给活动发起者发审核开始消息
	 * @param {Number} activityId activity id
	 * @param {Object} activity activity
	 */
	static async start2Creator (activityId, activity) {
		if (!activity) {
			activity = await Activities.findOne({ where: { id: activityId } });
		}
		let reviewUsers = [];
		// 1. 活动创建者地方校友会下的部门deptId
		// 2. 该部门的父部门列表与总会管理员所管理的部门相交，对应找出总会管理员
		let deptstaff = await DeptStaffs.findOne({ where: { userId: activity.userId, typeId: 121373230 } });
		if (!deptstaff) {
			console.log('当前员工不在地方校友会中');
			let roles = await Roles.findAll({ where: { userId: activity.userId } });
			let allDeptIds = [];
			for (let role of roles) {
				allDeptIds = allDeptIds.concat(role.deptIds);
			}
			allDeptIds = Array.from(new Set(allDeptIds));

			let userIds = [];

			for (let deptId of allDeptIds) {
				let dept = await DingDepts.findOne({ where: { deptId } });
				if (!dept) continue;
				let role = await Roles.findOne({ where: { userId: { [Op.ne]: activity.userId }, role: 1, deptIds: { [Op.overlap]: dept.deptPaths } } });
				if (!role) continue;
				if (userIds.indexOf(role.userId) > -1) continue;
				let staff = await DingStaffs.findOne({ where: { userId: role.userId } });
				if (!staff) continue;
				userIds.push(role.userId);
				reviewUsers.push({
					userId: role.userId,
					userName: staff.userName,
					mobile: staff.mobile
				});
			}
			if (!reviewUsers.length) {
				reviewUsers.push({ userId: '677588', userName: '系统管理员', mobile: '13554324776' });
			}
		} else {
			let dept = await DingDepts.findOne({ where: { deptId: deptstaff.deptId } });
			let roles = await Roles.findAll({ where: { type: 1, deptIds: { [Op.overlap]: dept.deptPaths } } });
			if (roles) {
				for (let role of roles) {
					let dingstaff = await DingStaffs.findOne({ where: { userId: role.userId } });
					reviewUsers.push({
						userId: role.userId,
						userName: role.userName,
						mobile: dingstaff.mobile
					});
				}
			}
		}
		Messages.create({
			userId: activity.userId,
			userName: activity.userName,
			createTime: activity.createdAt,
			title: activity.title,
			type: 3,
			text: '',
			finish: false,
			reviewStatus: 20,
			readUserIds: [],
			activityId,
			reviewUsers
		});
	}
	/**
   * 创建活动成功发给审核
	 * @param {Number} activityId activity id
	 * @param {Object} activity activity
   */
	static async start2Reviewer (activityId, activity) {
		if (!activity) {
			activity = await Activities.findOne({ where: { id: activityId } });
		}
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
	static async finish2Creator (reviewStatus, activityId, rejectReason) {
		let activity = await Activities.findOne({ where: { id: activityId } });

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

		await Messages.update({ finish: true, reviewStatus }, { where: { activityId, type: { [Op.in]: [ 1, 3 ] } } });
	}
}

module.exports = MessageService;
