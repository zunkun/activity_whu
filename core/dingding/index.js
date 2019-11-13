
const rp = require('request-promise');
const config = require('../../config');
const util = require('../util');
const crypto = require('crypto');
class Dingding {
	constructor () {
		this.token = {};
		this.ticket = {};
	}

	/**
	 * 获取access_token
	 */
	async getAccessToken () {
		if (!this.token.expires || this.token.expires < Date.now() + 20 * 60 * 1000) {
			let data = await rp.get(`${config.dingBaseUri}/gettoken?appkey=${config.appkey}&appsecret=${config.appsecret}`, { json: true });
			if (!data || data.errcode !== 0) {
				throw data;
			}
			this.token = {
				access_token: data.access_token,
				expires: Date.now() + 7200 * 1000
			};
			return data.access_token;
		} else {
			return this.token.access_token;
		}
	}

	/**
	 * 获取jsapi_ticket
	 */
	async getJsApiTicket (platform = 'mobile') {
		if (!this.ticket[platform] || !this.ticket[platform].expires || this.ticket[platform].expires < Date.now() + 10 * 60 * 1000) {
			let uri = `${config.dingBaseUri}/get_jsapi_ticket`;
			let data = await rp.get(uri, {
				qs: {
					access_token: await this.getAccessToken()
				},
				json: true
			});

			if (!data || data.errcode !== 0) {
				throw data;
			}
			this.ticket[platform] = {
				ticket: data.ticket,
				expires: Date.now() + 7200 * 1000
			};
			return data.ticket;
		} else {
			return this.ticket[platform].ticket;
		}
	}

	/**
	 * 生成签名
	 * @param {Object} options 生成签名参数
	 * @param {Number} options.platform 生成签名平台
	 * @param {String} options.url 生成签名页面
	 */
	async getJsApiSign (options) {
		let ticket = await this.getJsApiTicket(options.platform);
		let timeStamp = Date.now();
		let plain = 'jsapi_ticket=' + ticket +
      '&noncestr=' + config.nonceStr +
      '&timestamp=' + timeStamp +
      '&url=' + options.url;
		let signature = crypto.createHash('sha1').update(plain, 'utf-8').digest('hex').toString();

		return {
			agentId: config.agentId,
			corpId: config.corpId,
			nonceStr: config.nonceStr,
			timeStamp,
			signature,
			platform: options.platform
		};
	}

	/**
	 * 获取父上级路径
	 * @param {Number} deptId deptId
	 */
	async getDeptPaths (deptId) {
		let uri = `${config.dingBaseUri}/department/list_parent_depts_by_dept`;
		let data = await rp.get(uri, {
			qs: {
				id: deptId,
				access_token: await this.getAccessToken()
			},
			json: true
		});
		if (data.errcode === 0) {
			return data.parentIds;
		} else {
			return [ deptId ];
		}
	}

	/**
	 * 获取子部门列表
	 * @param {Number} id 根部门id
	 * @param {Boolean} fetch_child 是否遍历所有子部门
	 */
	async getDeptLists (options = { id: 1, fetch_child: false }) {
		let uri = `${config.dingBaseUri}/department/list`;
		let data = await rp.get(uri, {
			qs: {
				id: options.id || 1,
				fetch_child: options.fetch_child,
				access_token: await this.getAccessToken()
			},
			json: true
		});
		console.log({ data });
		if (data.errcode === 0) {
			return data.department;
		} else {
			return [];
		}
	}

	/**
	 * 获取部门详情
	 * @param {Number} deptId deptId
	 */
	async getDeptInfo (deptId) {
		let uri = `${config.dingBaseUri}/department/get`;
		let data = await rp.get(uri, {
			qs: {
				id: deptId || 1,
				access_token: await this.getAccessToken()
			},
			json: true
		});
		return data;
	}

	/**
	 *获取部门人员列表
	 * @param {Number} deptId 部门id
	 */
	async getDeptUsers (deptId) {
		// https://oapi.dingtalk.com/user/simplelist?access_token=ACCESS_TOKEN&department_id=1
		let accessToken = await this.getAccessToken();
		let uri = `${config.dingBaseUri}/user/listbypage`;
		let options = {
			uri,
			method: 'GET',
			qs: {
				access_token: accessToken,
				department_id: deptId,
				size: 100
			},
			json: true
		};
		let userLists = await this.getUserLists([], options);
		return userLists;
	}

	async getUserLists (userLists = [], options, offset = 0) {
		options.qs.offset = offset;
		offset += 1;
		let data = await rp(options);

		if (data.errcode === 0) {
			userLists = userLists.concat(data.userlist || []);
			if (!data.hasMore) {
				return userLists;
			}
			await util.wait(200);
			return this.getUserLists(userLists, options, offset);
		} else {
			return userLists;
		}
	}

	/**
	 * 获取用户详情
	 * @param {String} userId userId
	 */
	async getUser (userId) {
		// https://oapi.dingtalk.com/user/get?access_token=ACCESS_TOKEN&userid=zhangsan
		let accessToken = await this.getAccessToken();
		let url = `${config.dingBaseUri}/user/get?access_token=${accessToken}&userid=${userId}`;
		let data = await rp.get(url, { json: true });
		return data;
	}

	async getuserinfo (code) {
		let accessToken = await this.getAccessToken();
		let url = `${config.dingBaseUri}/user/getuserinfo?access_token=${accessToken}&code=${code}`;
		let data = await rp.get(url, { json: true });
		return data;
	}

	/**
	 * 发送oa消息
	 * @param {Object} OA OA消息
	 */
	async sendMsg (OA) {
		// https://oapi.dingtalk.com/message/send?access_token=ACCESS_TOKEN
		let accessToken = await this.getAccessToken();
		let json = await rp.post(`https://oapi.dingtalk.com/message/send?access_token=${accessToken}`, {
			body: OA, json: true
		});
		if (json.errcode === 0) {
			return json;
		} else {
			console.error('发送失败', json.errmsg);
			throw json.errmsg;
		}
	}

	/**
	 * 创建部门
	 * @param {Object} deptInfo 部门信息
	 */
	async createDept (deptInfo) {
		// https://oapi.dingtalk.com/department/create?access_token=ACCESS_TOKEN
		let accessToken = await this.getAccessToken();
		if (!deptInfo.name || !deptInfo.parentid || !deptInfo) {
			return Promise.reject('参数不正确');
		}
		let json = await rp.post(`https://oapi.dingtalk.com/department/create?access_token=${accessToken}`, {
			body: deptInfo,
			json: true
		});
		if (json.errcode === 0) {
			return json;
		} else {
			console.error('创建部门失败', json.errmsg);
			throw json.errmsg;
		}
	}
	/**
	 * 删除部门
	 * @param {Object} deptId 部门ID
	 */
	async deleteDept (deptId) {
		// https://oapi.dingtalk.com/department/delete?access_token=ACCESS_TOKEN&id=ID
		let accessToken = await this.getAccessToken();
		if (!deptId) {
			return Promise.reject('参数不正确');
		}
		let json = await rp.get(`https://oapi.dingtalk.com/department/delete?access_token=${accessToken}&id=${deptId}`, {
			json: true
		});
		if (json.errcode === 0) {
			return json;
		} else {
			console.error('删除部门失败', json.errmsg);
			throw json.errmsg;
		}
	}

	/**
	 * 更新员工部门表
	 * @param {String} userid 员工id，不可修改，长度为1~64个字符
	 * @param {List} department 成员所属部门id列表
	 */
	async updateUserDept (userid, department) {
		// https://oapi.dingtalk.com/user/update?access_token=ACCESS_TOKEN
		if (!userid || !department || !department.length) {
			return Promise.resolve('参数不正确');
		}		let accessToken = await this.getAccessToken();

		let json = await rp.post(`https://oapi.dingtalk.com/user/update?access_token=${accessToken}`, {
			body: {
				userid,
				department
			},
			json: true
		});
		if (json.errcode === 0) {
			return json;
		} else {
			console.error('更新员工部门数据失败', json.errmsg);
			throw json.errmsg;
		}
	}
}

const dingding = new Dingding();

module.exports = dingding;
