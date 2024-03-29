const DingStaffs = require('../models/DingStaffs');
const Roles = require('../models/Roles');
const rp = require('request-promise');
const { Op } = require('sequelize');
const config = require('../config');
const deptStaffService = require('../services/deptStaffService');

const cron = require('node-cron');

class RoleSchedule {
	constructor () {
		this.startTime = Date.now();
	}
	async start () {
		await this.sync();
		const task = cron.schedule(config.roleCron, async () => {
			await this.sync();
		});
		return task.start();
	}

	async sync () {
		this.startTime = Date.now();
		await this.getRoleLists(1);
		await this.getRoleLists(2);
		console.log(`同步角色用时 ${(Date.now() - this.startTime) / 1000} s`);
	}

	/**
   * 获取校友会管理员
   * @param {Number} roleType 角色类型 1-校友总会管理员 2-分会管理员
   */
	async getRoleLists (roleType = 1) {
		let uri = `http://alumnihome1893-1.whu.edu.cn/renzheng/whu/alumniResource/getRoleInfo?roleType=${roleType}`;

		let res = await rp.get(uri);

		res = JSON.parse(res);
		if (!res.success || !res.content || !Array.isArray(res.content)) {
			return;
		}

		let userIds = [];

		for (let user of res.content) {
			let staff = await DingStaffs.findOne({ where: { userId: user.dingtalkId } });

			if (!staff) { continue; }
			userIds.push(user.dingtalkId);
			console.log(`同步 ${staff.userName} role=${roleType} 角色`);
			let depts = [];
			for (let deptId of user.orgs) {
				let dept = await deptStaffService.getDeptInfo(deptId);
				depts.push({ deptId, deptName: dept.deptName });
			}
			let role = await Roles.findOne({ where: { userId: user.dingtalkId, role: roleType } });
			if (role) {
				await Roles.update({
					userId: user.dingtalkId,
					userName: staff.userName,
					role: roleType,
					deptIds: user.orgs,
					depts
				}, { where: { id: role.id } });
				continue;
			}
			await Roles.create({
				userId: user.dingtalkId,
				userName: staff.userName,
				role: roleType,
				deptIds: user.orgs,
				depts
			});
		}
		userIds.push('4508346520949170');
		userIds.push('103612431737659018');
		userIds.push('677588');
		await Roles.destroy({ where: { role: roleType, userId: { [Op.notIn]: userIds } } });
	}
}

const roleschedule = new RoleSchedule();

module.exports = roleschedule.start();
