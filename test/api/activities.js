const should = require('should');

describe('/api/activities', () => {
	it('创建投票问卷 单选 POST /api/activities', (done) => {
		process.request
			.post('/api/activities')
			.set('Authorization', process.token)
			.send({
				'title': '1121',
				'type': 2,
				'images': [ '1572679883530.jpg' ],
				'startTime': '2019-11-01 00:00:00',
				'endTime': '2019-11-30 23:59:59',
				'enrollStartTime': '2019-11-13 00:00:00',
				'enrollEndTime': '2019-11-14 23:59:59',
				'personNum': 1,
				'descText': '<p><span style="text-decoration-line: line-through;">ass</span></p>',
				'descImages': [ '1572679901842.jpg' ],
				'deptIds': [ 50227621, 118420221 ],
				'specialUserIds': [ '103010923705510' ],
				'latitude': 30.55346,
				'longitude': 114.353478,
				'address': '武汉大学中南医院',
				'singed': true,
				'signType': 2,
				'distance': 30,
				'contactName': 'as',
				'contactMobile': '159'
			})
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log(resData);

				done();
			});
	});
});
