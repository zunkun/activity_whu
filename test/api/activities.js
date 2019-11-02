const should = require('should');

describe('/api/activities', () => {
	it('创建投票问卷 单选 POST /api/activities', (done) => {
		process.request
			.post('/api/activities')
			.set('Authorization', process.token)
			.send({
				title: '上海一日游',
				type: 1, // 常规活动
				images: [ 'a.jpg', 'b.png', 'c.jpg' ],
				startTime: '2019-10-23 08:00:00',
				endTime: '2019-10-23 18:00:00',
				enrollStartTime: '2019-10-01 08:00:00',
				enrollEndTime: '2019-10-20 18:00:00',
				personNum: 100,
				descText: '游览上海著名景点',
				descImages: [ 'd.jpg', 'e.png', 'f.jpg' ],
				deptIds: [ 1, 2, 3 ],
				specialUserIds: [ 'userId1', 'userId2', 'userId3' ],
				latitude: 223.234,
				longitude: 113.234,
				address: '上海市三门路复旦软件园',
				singed: true,
				signType: 2, // 签到方式 1-扫码签到 2-位置签到
				distance: 100, // signType = 2 时填写
				contactMobile: '156xxx',
				contactName: '刘遵坤'
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
