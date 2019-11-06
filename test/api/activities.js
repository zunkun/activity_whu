const should = require('should');
let activityId;
let activity;

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
				'specialUserIds': [ '103010923705510', '4508346520949170' ],
				'latitude': 30.55346,
				'longitude': 114.353478,
				'address': '武汉大学中南医院',
				'signed': true,
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
				should.equal(resData.errcode, 0);

				activityId = resData.data.id;
				done();
			});
	});

	it('查询activity info GET /api/activities/:id', (done) => {
		process.request
			.get('/api/activities/' + activityId)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				should.equal(resData.errcode, 0);
				activity = resData.data;
				console.log({ activity });
				done();
			});
	});

	it('发送审批 POST /api/activities/sendreview', (done) => {
		process.request
			.post('/api/activities/sendreview')
			.set('Authorization', process.token)
			.send({ activityId })
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				should.equal(resData.errcode, 0);
				console.log(resData);
				done();
			});
	});

	it('审批 POST /api/activities/review', (done) => {
		process.request
			.post('/api/activities/review')
			.set('Authorization', process.token)
			.send({ activityId, reviewStatus: 30 })
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log(resData);
				should.equal(resData.errcode, 0);
				done();
			});
	});

	it('撤销活动 POST /api/activities/cancel', (done) => {
		process.request
			.post('/api/activities/cancel')
			.set('Authorization', process.token)
			.send({ activityId })
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log(resData);
				should.equal(resData.errcode, 0);
				done();
			});
	});

	let messageId;

	it('获取消息列表 GET /api/activities/messages?limit=&page=', (done) => {
		process.request
			.get('/api/activities/messages?limit=&page=')
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				should.equal(resData.errcode, 0);
				should.exist(resData.data, 'count');
				should.exist(resData.data, 'rows');
				messageId = resData.data.rows[0].id;
				done();
			});
	});

	it('设置消息已读 POST /api/activities/readmsg', (done) => {
		process.request
			.post('/api/activities/readmsg')
			.set('Authorization', process.token)
			.send({ messageId })
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});

	it('获取未读消息条数 GET /api/activities/msgnoread', (done) => {
		process.request
			.get('/api/activities/msgnoread')
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});

	// it('获取活动列表PC GET /api/activities?limit=&page=&keywords=&status=&type=', (done) => {
	// 	process.request
	// 		.get('/api/activities?limit=&page=&keywords=&status=&type=')
	// 		.set('Authorization', process.token)
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body;
	// 			should.equal(resData.errcode, 0);
	// 			should.exist(resData.data, 'count');
	// 			should.exist(resData.data, 'rows');
	// 			done();
	// 		});
	// });

	// it('我可以参与的活动列表 GET /api/activities/lists?limit=&page=&status=&type=', (done) => {
	// 	process.request
	// 		.get('/api/activities/lists?limit=&page=&status=&type=2')
	// 		.set('Authorization', process.token)
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body;
	// 			should.equal(resData.errcode, 0);
	// 			should.exist(resData.data, 'count');
	// 			should.exist(resData.data, 'rows');
	// 			done();
	// 		});
	// });

	// it('置顶 POST /api/activities/top', (done) => {
	// 	process.request
	// 		.post('/api/activities/top')
	// 		.set('Authorization', process.token)
	// 		.send({ top: true, activityIds: [ activityId ] })
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body;
	// 			console.log({ resData });
	// 			should.equal(resData.errcode, 0);
	// 			done();
	// 		});
	// });
});
