class DictionaryStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	URLS = {
		LIST: '/manage-service/dictionary/type',
		SAVE: '/manage-service/dictionary/type/add_or_update',
		DELETE: '/manage-service/dictionary/type/del',
		ALL: '/manage-service/dictionary/item',
		LOAD_ENUM: '/manage-service/dictionary/item',
		SAVE_ENUM: '/manage-service/dictionary/item/add_or_update',
		DELETE_ENUM: '/manage-service/dictionary/item/del',
		ORDER_ENUM: '/manage-service/dictionary/item/order'
	}

	METHODS = {
		DELETE: 'POST'
	}

	callbacks = {
		afterList: (data) => {
			data && data.rows && data.rows.forEach(item => {
				item.isAccessmentCase = item.desc == 'ACCESSMENT_CASE';
			});
			return data;
		}
	}

	save(model) {
		model.application = 1;
		return $http(this._triggerEvent('beforeSave', {
			url: this._getURL('SAVE'),
			type: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(model)
		})).then(res => {
			this._triggerEvent('dataDirty', model);
			return this._triggerEvent('afterSave', res);
		});
	}

	removeById(id) {
		return $http(this._triggerEvent('beforeDelete', {
			url: this._getURL('DELETE'),
			type: 'POST',
			data: {
				typeIds: id
			}
		})).then(res => {
			this._triggerEvent('dataDirty');
			return this._triggerEvent('afterDelete', res);
		});
	}


	order(orders) {
		return $http({
			url: this.URLS.ORDER_ENUM,
			type: 'POST',
			data: {
				order: orders
			}
		});
	}

	getAll() {
		return $http({
			url: this.URLS.ALL
		}).then(data => {
			return this.cacheDictionary(data);
		});
	}

	cacheDictionary(data) {
		var dictionaryItems = [];
		if (data && data.length) {
			var ENUMS = {},
				ENUM_MAP = {},
				enumItem;
			//按type分类
			data.forEach(item => {
				var enums = ENUMS[item.dictionaryType] || (ENUMS[item.dictionaryType] = []),
					enumMap = ENUM_MAP[item.dictionaryType] || (ENUM_MAP[item.dictionaryType] = {});
				enums.push(enumItem = {
					type: item.dictionaryType,
					key: item.value,
					value: item.name,
					alias: item.aliasName
				});
				enumMap[item.value] = item.name;
				dictionaryItems.push(enumItem);
			});
			//挂载到全局业务对象中
			Base.ENUMS = ENUMS;
			Base.ENUM_MAP = ENUM_MAP;
		}
		return dictionaryItems;
	}

	/**
	 * 获取某类型的字典
	 * @param  {String} type 字典类型
	 * @return {[type]}      [description]
	 */
	getEnums(type) {
		return this.ENUMS[type] || [];
	}

	/**
	 * 转码
	 * @param  {String} type 字典类型
	 * @param  {String} key  字典key
	 * @return {[type]}      [description]
	 */
	transcode(type, key) {
		return this.ENUM_MAP[type] && this.ENUM_MAP[type][key];
	}

	loadEnums(type) {
		return $http({
			url: this.URLS.LOAD_ENUM,
			data: {
				dictionaryType: type
			}
		});
	}

	saveEnum(model) {
		return $http({
			url: this.URLS.SAVE_ENUM,
			type: 'POST',
			json: true,
			data: model
		});
	}

	removeEnum(id) {
		return $http({
			url: this.URLS.DELETE_ENUM,
			type: 'POST',
			data: {
				itemIds: id
			}
		});
	}



}

export default new DictionaryStore();