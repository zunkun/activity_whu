const DingDepts = require('../models/DingDepts');
const DingStaffs = require('../models/DingStaffs');
const config = require('../config');
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
			if (!dept) return { deptId, deptName: '' };
			this.deptMap.set(deptId, { deptId, deptName: dept.deptName, parentId: dept.parentId });
		}
		return this.deptMap.get(deptId);
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
			if (!staff) return { userId, userName: '', mobile: '' };
			this.staffMap.set(userId, { userId, userName: staff.userName, mobile: staff.mobile });
		}
		return this.staffMap.get(userId);
	}
}

const service = new DeptStaffService();
service.init().then();
module.exports = service;
