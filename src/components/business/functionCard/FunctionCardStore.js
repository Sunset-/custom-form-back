class FunctionCardStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {}

	METHODS = {
		SAVE: 'POST'
	}

	URLS = {
		LIST: '/manage-service/view/list',
		SAVE: '/manage-service/view/add_or_update',
		DELETE: '/manage-service/view/del',

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
				viewIds: id
			}
		})).then(res => {
			this._triggerEvent('dataDirty');
			return this._triggerEvent('afterDelete', res);
		});
	}
}

export default new FunctionCardStore();