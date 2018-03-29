module.exports = {
	/**
	 * 缓存【参数主键】
	 */
	Cache: function(target, name, desc) {
		var value = desc.value,
			cacheExsit = {},
			cache = {};
		desc.value = function() {
			var args = [].slice.call(arguments),
				key = JSON.stringify(args);
			if (cacheExsit[key]) {
				return cache[key];
			} else {
				cacheExsit[key] = true;
				return cache[key] = value.apply(this, args);
			}
		}
		desc.value.clearCache = function() {
			if (arguments.length == 0||(arguments.length==1&&(arguments[0]==void 0||arguments[0]==null))) {
				cacheExsit = {};
				cache = {};
			} else {
				var args = [].slice.call(arguments),
					cacheKey = JSON.stringify(args);
				delete cacheExsit[cacheKey];
				delete cache[cacheKey];
			}
		}
	},
	/**
	 * 单例
	 */
	Singleton: function(target) {
		var clazz = function () {
			if (clazz.__single_instance__) {
				return clazz.__single_instance__;
			} else {
				var args = [].slice.call(arguments, 0);
				this.__proto__ = target.prototype;
				target.prototype.constructor.apply(this, args);
				clazz.__single_instance__ = this;
			}
		}
		clazz.prototype = target.prototype;
		return clazz;
	}
};