class ResService {
	/**
   * @constructor
   * @param {*} data
   */
	constructor (data) {
		this.errcode = 0;
		this.success = true;
		this.errmsg = '';
		this.data = data;
	}

	/**
   * 成功消息
   * @param {*} data
   * @return {ResService}
   */
	static success (data) { // 成功消息
		return new ResService(data);
	}

	/**
   * 失败消息
   * @param {number} errcode
   * @param {string} errmsg
   * @param {*} data
   * @returns {ResService}
   */
	static fail (errmsg, data, errcode = -1) { // 错误消息
		let rt = new ResService(data);
		rt.success = false;
		rt.errcode = errcode;
		rt.errmsg = errmsg;
		return rt;
	}
}

module.exports = ResService;
