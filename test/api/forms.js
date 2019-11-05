const should = require('should');
let activityId;
let activity;

describe('/api/forms', () => {
	it('获取activity GET /api/activities', (done) => {
		process.request
			.get('/api/activities?limit=1')
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				activity = res.body.data.rows[0];
				activityId = activity.id;
				done();
			});
	});

	it('保存表单 单选 POST /api/forms', (done) => {
		process.request
			.post('/api/forms?activityId=' + activityId)
			.set('Authorization', process.token)
			.send({
				activityId: activityId,
				forms: [ {
					componentName: '姓名', // 组件名称
					componentType: 'singleLineText', // 组件类型
					componentSet: 'textType', // 组件属性设置类型
					attribute: {
						//   组件属性
						fieldValue: '', // 字段填写的值
						fieldCode: '', // 字段编码
						title: '姓名', // 标题
						placeholder: '请输入', // 提示
						maxLength: 666, // 输入的最大值
						required: true // 是否必填
					}
				},
				{
					componentName: '简介', // 组件名称
					componentType: 'multilineText', // 组件类型
					componentSet: 'textType', // 组件属性设置类型
					attribute: {
						//   组件属性
						fieldValue: '', // 字段填写的值
						fieldCode: '', // 字段编码
						title: '简介', // 标题
						placeholder: '请输入', // 提示
						maxLength: 666, // 输入的最大值
						required: true // 是否必填
					}
				},
				{
					componentName: '年龄', // 组件名称
					componentType: 'numericType', // 组件类型
					componentSet: 'textType', // 组件属性设置类型
					attribute: {
						//   组件属性
						fieldValue: '', // 字段填写的值
						fieldCode: '', // 字段编码
						title: '年龄', // 标题
						placeholder: '请输入', // 提示
						maxLength: 666, // 输入的最大值
						required: true // 是否必填
					}
				},
				{
					componentName: '出生日期', // 组件名称
					componentType: 'datePicker', // 组件类型
					componentSet: 'datePickerType', // 组件属性设置类型
					attribute: {
						//   组件属性
						fieldValue: '', // 字段填写的值
						fieldCode: '', // 字段编码
						title: '出生日期', // 标题
						placeholder: '请选择', // 提示
						required: true, // 是否必填
						dateType: 'YYYY-MM-DD' // 日期类型 YYYY-MM-DD HH:mm
					}
				}, {
					componentName: '大学学习期间', // 组件名称
					componentType: 'datePickerSection', // 组件类型
					componentSet: 'datePickerSectionType', // 组件属性设置类型
					attribute: {
						//   组件属性
						fieldValueStart: '', // 字段填写的值
						fieldCodeStart: '', // 字段编码
						titleStart: '开始日期', // 标题
						placeholderStart: '请选择', // 提示
						fieldValueEnd: '', // 字段填写的值
						fieldCodeEnd: '', // 字段编码
						titleEnd: '结束日期', // 标题
						placeholderEnd: '请选择', // 提示
						required: true, // 是否必填
						dateType: 'YYYY-MM-DD' // 日期类型 YYYY-MM-DD HH:mm
					}
				},
				{
					componentName: '爱好', // 组件名称
					componentType: 'multipleSelection', // 组件类型
					componentSet: 'multipleSelectionType', // 组件属性设置类型
					attribute: {
						//   组件属性
						fieldValue: '', // 字段填写的值
						fieldCode: '', // 字段编码
						title: '多选框', // 标题
						placeholder: '请选择', // 提示
						required: true, // 是否必填
						maxLength: 2,
						options: [ {
							label: '绘画',
							value: '绘画',
							isSelect: false
						}, {
							label: '烹饪',
							value: '烹饪',
							isSelect: false
						} ]
					}
				}
				]
			})
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				should.equal(resData.errcode, 0);
				done();
			});
	});

	it('获取form GET /api/forms/info', (done) => {
		process.request
			.get('/api/forms/info?activityId=' + activityId)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				console.log({ err });
				should.not.exist(err);
				let resData = res.body;
				console.log({ resData });
				should.equal(resData.errcode, 0);

				done();
			});
	});
});
