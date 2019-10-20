const should = require('should');
const Questionnaires = require('../../models/Questionnaires');

let queId;
let que;
let options = [];

describe('/api/questionnaires', () => {
	it('创建投票问卷 单选 POST /api/questionnaires', (done) => {
		Questionnaires.destroy({ where: { title: '最喜欢的电视剧' } })
			.then(() => {
				process.request
					.post('/api/questionnaires')
					.set('Authorization', process.token)
					.send({
						title: '最喜欢的电视剧',
						description: '测试最喜爱的电视剧',
						startTime: '2019-08-23 08:00:00',
						endTime: '2019-08-24 08:00:00',
						options: [
							{
								sequence: 1,
								type: 1,
								title: '琅琊榜',
								description: '琅琊榜是胡歌主演的电视剧',
								image: 'a.jpg'
							},
							{
								sequence: 2,
								type: 1,
								title: '欢乐颂',
								description: '欢乐颂是非常好看的电视剧',
								image: 'b.jpg'
							}
						],
						commentAllowed: true,
						commentVisible: false,
						anonymous: true,
						realTimeVisiable: true,
						selectionNum: 1,
						deptIds: [ 1 ]
					})
					.expect(200)
					.end((err, res) => {
						console.log({ err });
						should.not.exist(err);
						let resData = res.body;
						console.log(resData);
						should.equal(resData.errcode, 0);
						queId = resData.data.id;
						should.exist(resData.data, 'id');
						done();
					});
			});
	});

	it('查询questionnaire GET /api/questionnaires/:id', (done) => {
		process.request
			.get(`/api/questionnaires/${queId}`)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				should.equal(resData.errcode, 0);
				que = resData.data;
				options = que.options;
				done();
			});
	});

	it('查询questionnaire GET /api/questionnaires', (done) => {
		process.request
			.get('/api/questionnaires?mobile=156188')
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				console.log(JSON.stringify(resData));
				should.equal(resData.errcode, 0);
				res = resData.data;
				should.exist(res, 'count');
				should.exist(res, 'rows');
				done();
			});
	});

	// it('修改投票问卷 单选 PUT /api/questionnaires/:id', (done) => {
	// 	process.request
	// 		.put('/api/questionnaires/' + queId)
	// 		.set('Authorization', process.token)
	// 		.send({
	// 			title: '最喜欢的电视剧2',
	// 			description: '测试最喜爱的电视剧',
	// 			startTime: '2019-08-23 08:00:00',
	// 			endTime: '2019-11-24 08:00:00',
	// 			options: [
	// 				{
	// 					id: options[0].id,
	// 					sequence: 1,
	// 					type: 1,
	// 					title: '琅琊榜',
	// 					description: '琅琊榜是胡歌主演的电视剧',
	// 					image: 'a.jpg'
	// 				},
	// 				{
	// 					sequence: 2,
	// 					type: 1,
	// 					title: '欢乐颂',
	// 					description: '欢乐颂是非常好看的电视剧',
	// 					image: 'b.jpg'
	// 				}
	// 			],
	// 			commentAllowed: false,
	// 			commentVisible: true,
	// 			anonymous: false,
	// 			realTimeVisiable: false,
	// 			selectionNum: 2,
	// 			deptIds: [ 1, 23 ]
	// 		})
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			console.log({ err });
	// 			should.not.exist(err);
	// 			let resData = res.body;
	// 			console.log(resData);
	// 			should.equal(resData.errcode, 0);
	// 			queId = resData.data.id;
	// 			should.exist(resData.data, 'id');
	// 			done();
	// 		});
	// });

	// it('设置投票问卷状态 POST /api/questionnaires/status', (done) => {
	// 	Questionnaires.destroy({ where: { title: '最喜欢的电视剧' } })
	// 		.then(() => {
	// 			process.request
	// 				.post('/api/questionnaires/status')
	// 				.set('Authorization', process.token)
	// 				.send({
	// 					id: queId,
	// 					status: 2
	// 				})
	// 				.expect(200)
	// 				.end((err, res) => {
	// 					should.not.exist(err);
	// 					let resData = res.body;
	// 					console.log(resData);
	// 					done();
	// 				});
	// 		});
	// });
});
