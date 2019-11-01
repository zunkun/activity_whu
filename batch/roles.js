const Roles = require('../models/Roles');
const DingStaffs = require('../models/DingStaffs');
class RoleBatch {
	static async setRoles () {
		[ '103010923705510', '4508346520949170', '0625663244931506' ].map(async (userId) => {
			let staff = await DingStaffs.findOne({ where: { userId } });
			await Roles.upsert({
				userId,
				userName: staff.userName,
				role: 1,
				deptIds: [ 1 ]
			});
			await Roles.upsert({
				userId,
				userName: staff.userName,
				role: 2,
				deptIds: [ 1 ]
			});
		});
	}
}

RoleBatch.setRoles();
