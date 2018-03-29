class ApplicationSystemStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {
		beforeSave(params) {
			params.json = true;
			return params;
		}
	}

	METHODS = {
		SAVE: 'POST'
	}

	URLS = {
		LIST: '/manage-service/system',
		SAVE: '/manage-service/system',
		SAVE_OPERATER: '/manage-service/agency',
		LOAD_OPERATER: '/manage-service/agency',
		CARDS_OF_SYSTEM: '/manage-service/relation/system/view',
		RELATION_CARDS: '/manage-service/relation/system/view/batch',
		CONFIG_CARD: '/manage-service/relation/system/view'
	}

	all() {
		return $http({
			url: this.URLS.LIST,
			data: {
				pageNumber: 0,
				pageSize: 999
			}
		}).then(res => {
			return res && res.rows || [];
		})
	}

	saveOperater(model) {
		return $http({
			url: this.URLS.SAVE_OPERATER,
			json: true,
			type: 'POST',
			data: model
		});
	}

	loadOperaters(filter) {
		return $http({
			url: this.URLS.LOAD_OPERATER,
			data: filter
		});
	}

	getCardsOfSystem(filter) {
		return $http({
			url: this.URLS.CARDS_OF_SYSTEM,
			data: filter
		});
	}

	relationCards(data) {
		return $http({
			url: this.URLS.RELATION_CARDS,
			type: 'POST',
			data: data
		});
	}
	configCard(data) {
		return $http({
			url: this.URLS.CONFIG_CARD,
			type: 'POST',
			json: true,
			data: data
		});
	}
}

export default new ApplicationSystemStore();