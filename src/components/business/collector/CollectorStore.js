class CollectorStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {}

	METHODS = {
		SAVE: 'POST'
	}

	URLS = {
		LIST: '/manage-service/watcher/list',
		SAVE: '/manage-service/watcher'

	}

	save(model) {
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
}

export default new CollectorStore();