var crypto = require('crypto');

const util = {
	/**
	 * 程序等待
	 * @param {number} mileseconds 毫秒
	 * @param {string} msg 提示消息
	 */
	async wait (mileseconds = 200, msg = '程序等待中...') {
		console.log(msg);
		return new Promise((resolve, reject) => {
			return setTimeout(() => {
				resolve();
			}, mileseconds);
		});
	},

	/**
	 * 字符串hash
	 * @param {String} string 待hash的字符串
	 * @returns {String} 哈希字符串
	 */
	stringHash (string) {
		try {
			var md5sum = crypto.createHash('md5');
			let hash = md5sum.update(string).digest('hex');
			return hash;
		} catch (error) {
			console.error({ error });
			return '';
		}
	},

	/**
	 * 复制属性，从source 复制对象数据到target中
	 * @param {Array} keys 待复制的key
	 * @param {Object} source 复制来源
	 * @param {Object} target 复制到对象
	 */
	setProperty (keys, source, target) {
		if (!Array.isArray(keys) || !source || !target) {
			throw new Error('设置对象参数列表错误');
		}

		keys.map(key => {
			if (key) target[key] = source[key];
		});
	}
};

module.exports = util;
