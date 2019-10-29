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
	},
	/**
	 * 生成guid
	 */
	guid2 () {
		function S4 () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
	},
	/**
	 * 计算两个坐标之间的距离，单位 m
	 * @param {Number} lat1 坐标1经度
	 * @param {Number} lng1 坐标1纬度
	 * @param {Number} lat2 坐标2经度
	 * @param {Number} lng2 坐标2纬度
	 */
	getDistance (lat1, lng1, lat2, lng2) {
		var radLat1 = lat1 * Math.PI / 180.0;
		var radLat2 = lat2 * Math.PI / 180.0;
		var a = radLat1 - radLat2;
		var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378137;// EARTH_RADIUS;
		s = Math.round(s * 100) / 100;
		return s;
	}
};

module.exports = util;
