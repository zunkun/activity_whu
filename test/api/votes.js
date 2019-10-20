const should = require('should');
const Votes = require('../../models/Votes');
const Questionnaires = require('../../models/Questionnaires');
const QueOptions = require('../../models/QueOptions');

let voteId;
let vote;
let options = [];

describe('/api/votes', () => {
	beforeEach(async () => {
		this.que = await Questionnaires.findOne({ order: [ [ 'createdAt', 'DESC' ] ] });
		this.options = await QueOptions.findAll({ where: { questionnaireId: this.que.id, timestamp: this.que.timestamp } });
	});
	it('投票 POST /api/votes', (done) => {
		process.request
			.post('/api/votes')
			.set('Authorization', process.token)
			.send({
				questionnaireId: this.que.id,
				checkedIds: [ this.options[0].id ],
				comment: '哈哈哈'
			})
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				should.equal(resData.errcode, 0);
				voteId = resData.data.id;
				should.exist(resData.data, 'id');
				done();
			});
	});

	it('查询vote info GET /api/votes/info', (done) => {
		process.request
			.get('/api/votes/info?questionnaireId=' + this.que.id)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});

	it('查询comments GET /api/votes/comments?questionnaireId=', (done) => {
		process.request
			.get('/api/votes/comments?questionnaireId=' + this.que.id)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});

	it('投票结果统计 GET /api/votes/options?questionnaireId=', (done) => {
		process.request
			.get('/api/votes/options?questionnaireId=' + this.que.id)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});

	it('导出投票结果 GET /api/votes/commentsOut?questionnaireId=', (done) => {
		process.request
			.get('/api/votes/commentsOut?questionnaireId=' + this.que.id)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});
	it('我参与的投票 GET /api/votes/participate', (done) => {
		process.request
			.get('/api/votes/participate')
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				done();
			});
	});
	// it('查询questionnaire GET /api/votes', (done) => {
	// 	process.request
	// 		.get('/api/votes')
	// 		.set('Authorization', process.token)
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body;
	// 			should.equal(resData.errcode, 0);
	// 			res = resData.data;
	// 			should.exist(res, 'count');
	// 			should.exist(res, 'rows');
	// 			done();
	// 		});
	// });

	// it('修改投票问卷 单选 PUT /api/votes/:id', (done) => {
	// 	process.request
	// 		.put('/api/votes/' + queId)
	// 		.set('Authorization', process.token)
	// 		.send({
	// 			title: '最喜欢的电视剧2',
	// 			description: '测试最喜爱的电视剧',
	// 			startTime: '2019-08-23 08:00:00',
	// 			endTime: '2019-08-24 08:00:00',
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

	// it('设置投票问卷状态 POST /api/votes/status', (done) => {
	// 	Votes.destroy({ where: { title: '最喜欢的电视剧' } })
	// 		.then(() => {
	// 			process.request
	// 				.post('/api/votes/status')
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
