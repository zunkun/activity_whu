const Roles = require('../models/Roles');
const DingStaffs = require('../models/DingStaffs');
class RoleBatch {
	static async setRoles () {
		[ '103612431737659018', '4508346520949170', '0625663244931506' ].map(async (userId) => {
			let staff = await DingStaffs.findOne({ where: { userId } });
			[ 1, 2 ].map(async role => {
				let role1 = await Roles.findOne({ where: { userId, role } });
				if (!role1) {
					await Roles.create({
						userId,
						userName: staff.userName,
						role,
						deptIds: [ 1 ],
						depts: [ { deptId: 1, deptName: '武汉大学校友总会' } ]
					});
				}
			});
		});
	}
}

RoleBatch.setRoles().then();
