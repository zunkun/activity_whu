const config = require('../config');
const ActivityGroups = require('../models/ActivityGroups');
const Activities = require('../models/Activities');
const deptStaffService = require('./deptStaffService');
const DingDepts = require('../models/DingDepts');
const DingStaffs = require('../models/DingStaffs');
const DeptStaffs = require('../models/DeptStaffs');
const dingding = require('../core/dingding');
const _ = require('lodash');
const { Op } = require('sequelize');

class GroupService {
	/**
   * 处理群名称
   * @param {String} name name
   */
	static parseName (name) {
		return _.replace(name, /\s|-|,/g, '');
	}
	/**
   * 在设置活动钉钉部门以及群
   * @param {Number} activityId activity id
   * @param {Object} activity activity
   */
	static async setDingDept (activityId, activity) {
		if (!activity) {
			activity = await Activities.findOne({ where: { id: activityId } });
		}
		if (!activity) {
			return Promise.reject('系统中没有当前活动');
		}
		if (activity.reviewStatus !== 30) {
			return Promise.reject('当前活动没有审核通过');
		}
		let deptName = this.parseName(activity.title);
		let activityGroup = await ActivityGroups.findOne({ where: { activityId, status: 1 } });
		if (activityGroup) {
			return activityGroup;
		}
		let dept = await DingDepts.findOne({ where: { parentId: config.groupDeptId, deptName } });
		if (!dept) {
			let res = await dingding.createDept({
				name: deptName,
				parentid: config.groupDeptId,
				createDeptGroup: true,
				deptHiding: true,
				sourceIdentifier: activityId
			});

			if (res.errcode !== 0) {
				await ActivityGroups.create({
					parentid: null,
					activityId,
					status: 2
				});
				return Promise.reject('创建部门群失败');
			}
			let deptInfo = await dingding.getDeptInfo(res.id);
			dept = await deptStaffService.upsertDept(res.id, deptInfo);
			if (!dept.deptId) {
				dept = {
					deptId: res.id,
					deptName: deptInfo.name,
					parentId: config.groupDeptId,
					deptPaths: [ res.id, config.groupDeptId, 1 ],
					subdeptIds: [ res.id ]
				};
			}
		}
		activityGroup = await ActivityGroups.create({
			deptId: dept.deptId,
			deptName: dept.deptName,
			activityId,
			parentId: config.groupDeptId,
			status: 1
		});
		return activityGroup;
	}

	/**
   * 将user添加入dept中
   * @param {Number} deptId deptId
   * @param {String} userId userId
   */
	static async addUser2Depts (deptId, userId) {
		let user = await DingStaffs.findOne({ where: { userId } });
		let deptStaff = await DeptStaffs.findOne({ where: { deptId, userId } });
		if (deptStaff) {
			return Promise.resolve();
		}
		let deptIds = [];
		let deptstaffs = await DeptStaffs.findAll({ where: { userId } });
		for (let staff of deptstaffs) {
			deptIds.push(staff.deptId);
		}
		deptIds.push(deptId);

		await dingding.updateUserDept(userId, deptIds);
		let deptInfo = await deptStaffService.getDeptInfo(deptId);
		await DeptStaffs.create({
			userId,
			userName: user.userName,
			deptId,
			deptName: deptInfo.deptName
		});
	}

	static async deleteUserFromDept (deptId, userId) {
		let deptIds = [];
		let deptstaffs = await DeptStaffs.findAll({ where: { userId, deptId: { [Op.ne]: deptId } } });
		for (let staff of deptstaffs) {
			deptIds.push(staff.deptId);
		}
		await dingding.updateUserDept(userId, deptIds);
		// 删除部门中当前人的数据
		await DeptStaffs.destroy({ where: { userId, deptId } });
	}

	/**
   * 将用户加入活动群
   * @param {String} userId userId
   * @param {Number} activityId activity id
   */
	static async addUser2Group (userId, activityId) {
		let activityGroup = await ActivityGroups.findOne({ where: { activityId } });
		if (!activityGroup) {
			return this.setUserAndDept(userId, activityId);
		}
		return this.addUser2Depts(activityGroup.deptId, userId);
	}

	/**
   * 将用户移出活动群
   * @param {String} userId userId
   * @param {Number} activityId activity id
   */
	static async deleteUserFromGroup (userId, activityId) {
		let activityGroup = await ActivityGroups.findOne({ where: { activityId } });
		if (!activityGroup) {
			return Promise.resolve();
		}
		return this.deleteUserFromDept(activityGroup.deptId, userId);
	}

	/**
   * 审核通过后创建群
   * @param {String} userId userId
   * @param {Number} activityId activityId
   * @param {Object} activity activity
   */
	static async setUserAndDept (userId, activityId, activity) {
		if (!activity) {
			activity = await Activities.findOne({ where: { id: activityId } });
		}
		let activityGroup = await this.setDingDept(activityId, activity);
		await this.addUser2Depts(activityGroup.deptId, userId);
		return Promise.resolve();
	}

	/**
   * 删除活动群
   * @param {Number} activityId activity id
   */
	static async deleteDept (activityId) {
		let activityGroup = await ActivityGroups.findOne({ where: { activityId } });
		if (!activityGroup) return Promise.resolve();
		let dept = await DingDepts.findOne({ where: { deptId: activityGroup.deptId } });
		if (!dept) return Promise.resolve();
		// 非校友活动的子部门不得删除
		if (activityGroup.deptId === config.groupDeptId || dept.deptPaths.indexOf(config.groupDeptId) === -1) {
			return Promise.resolve();
		}

		let userLists = await dingding.getDeptUsers(activityGroup.deptId);

		for (let user of userLists) {
			await this.deleteUserFromDept(activityGroup.deptId, user.userid);
		}

		let res = await dingding.deleteDept(activityGroup.deptId);
		if (res.errcode === 0) {
			await ActivityGroups.destroy({ where: { activityId } });
			// 删除数据库中部门数据和部门人员数据
			await DeptStaffs.destroy({ where: { deptId: activityGroup.deptId } });
			await DingDepts.destroy({ where: { deptId: activityGroup.deptId } });
		}
	}
}

module.exports = GroupService;
