const DingDepts = require('../models/DingDepts');
const DingStaffs = require('../models/DingStaffs');
const DeptStaffs = require('../models/DeptStaffs');
const config = require('../config');
const dingding = require('../core/dingding');
const { Op } = require('sequeize');
class DeptStaffService {
	/**
   * @constructor
   */
	constructor () {
		this.deptMap = new Map();
		this.staffMap = new Map();
	}

	async init () {
		await this.setAllDeptMaps();
		await this.setAllStaffMaps();
	}
	/**
	 * 获取所有子部门的deptId列表
	 * @param {Number} deptId deptId
	 */
	async getSubDeptIds (deptId) {
		let dept = await DingDepts.findOne({ where: { deptId } });
		return dept.subdeptIds || [ deptId ];
	}

	/**
   * 设置所有deptMap
   */
	async setAllDeptMaps () {
		const depts = await DingDepts.findAll({});
		for (let dept of depts) {
			this.deptMap.set(dept.deptId, { deptId: dept.deptId, deptName: dept.deptName, parentId: dept.parentId });
		}
		this.deptMap.set(1, { deptId: 1, deptName: config.corpName, parentId: 1 });
	}

	/**
   * @param {Number} deptId 部门deptId
   * @returns {Object} dept {deptId: '', deptName: ''}
   */
	async getDeptInfo (deptId) {
		if (!this.deptMap.has(deptId)) {
			let dept = await DingDepts.findOne({ where: { deptId } });
			if (!dept) {
				let deptInfo = await dingding.getDeptInfo(deptId);
				if (deptInfo.errcode === 0) {
					dept = await DingDepts.create({
						deptId,
						deptName: deptInfo.name,
						parentId: deptInfo.parentid,
						deptPaths: await dingding.getDeptPaths(deptId),
						subdeptIds: this.getSubDeptIds(deptId)
					});
				} else {
					return { deptId, deptName: '' };
				}
			};
			this.deptMap.set(deptId, { deptId, deptName: dept.deptName, parentId: dept.parentId, deptPath: dept.deptPath });
		}
		return this.deptMap.get(deptId);
	}

	/**
	 * 获取所有子部门deptId列表
	 * @param {Number} deptId deptId
	 */
	static async getSubDeptIds (deptId) {
		let depts = await dingding.getDeptLists({ id: deptId, fetch_child: true });
		let deptIds = [ deptId ];
		for (let dept of depts) {
			deptIds.push(dept.id);
		}
		return deptIds;
	}

	/**
   * 设置所有staffMap
   */
	async setAllStaffMaps () {
		const staffs = await DingStaffs.findAll({});
		for (let staff of staffs) {
			this.staffMap.set(staff.userId, { userId: staff.userId, userName: staff.userName, mobile: staff.mobile });
		}
	}

	/**
   * @param {String} userId 人员userId
   * @returns {Object} user {userId: '', userName: '', mobile: ''}
   */
	async getStaff (userId) {
		if (!this.staffMap.has(userId)) {
			let staff = await DingStaffs.findOne({ where: { userId } });
			if (!staff) {
				let user = await dingding.getUser(userId);
				if (user) {
					staff = await DingStaffs.create({
						userId,
						userName: user.name,
						jobnumber: user.jobnumber,
						avatar: user.avatar,
						mobile: user.mobile,
						activity: false
					});

					for (let deptId of user.department) {
						let dept = await this.getDeptInfo(deptId);
						DeptStaffs.upsert({
							userId: user.userid,
							deptId,
							userName: user.name,
							deptName: dept.deptName || ''
						}, { where: { deptId, userId } });
					}
				} else {
					user = { userId, userName: '', mobile: '' };
				}
			};
			this.staffMap.set(userId, { userId, userName: staff.userName, mobile: staff.mobile });
		}
		return this.staffMap.get(userId);
	}

	/**
	 *设置部门信息到数据库
	 * @param {Number} deptId deptId
	 * @param {Object} deptInfo 部门信息
	 */
	async upsertDept (deptId, deptInfo) {
		if (!deptInfo) {
			deptInfo = await dingding.getDeptInfo(deptId);
		}

		let deptData = {
			deptId,
			deptName: deptInfo.name,
			parentId: config.groupDeptId,
			deptPaths: [ deptId, config.groupDeptId, 1 ],
			subdeptIds: [ deptId ]
		};
		let dept = await DingDepts.upsert(deptData, {
			where: { deptId },
			returning: true
		});
		return dept;
	}

	/**
	 * 设置钉钉获取用户数据到数据库
	 * @param {String} userId userId
	 * @param {Object} [user] 钉钉获取的user数据
	 */
	async upsertStaff (userId, user) {
		if (!user) {
			user = await dingding.getUser(userId);
		}
		let staffData = {
			userId: user.userid,
			userName: user.name,
			jobnumber: user.jobnumber,
			mobile: user.mobile,
			avatar: user.avatar,
			email: user.email
		};
		await DingStaffs.upsert(staffData, { where: { userId } });
		for (let deptId of user.department) {
			let deptInfo = await dingding.getDeptInfo(deptId);
			if (!deptInfo) {
				continue;
			}

			let deptPaths = await dingding.getDeptParentPath(deptId);
			DeptStaffs.upsert({
				userId,
				deptId,
				userName: user.name,
				deptName: deptInfo.name
			}, { where: { deptId, userId } });

			await DingDepts.upsert({
				deptId,
				deptName: deptInfo.name,
				parentId: deptInfo.parentid,
				deptPaths
			}, { where: { deptId } });
		}

		// 删除旧的员工部门信息
		await DeptStaffs.destroy({ where: { userId, deptId: { [Op.notIn]: user.department } } });
	}
}

const service = new DeptStaffService();
service.init().then();
module.exports = service;
