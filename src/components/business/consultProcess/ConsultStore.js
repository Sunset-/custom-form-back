class DoctorStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {}

	METHODS = {
		SAVE: 'POST'
	}

	URLS = {
		LIST: '/manage-service/patient/consult/list',
		HISTORY_MESSAGE: '/manage-service/patient/consult/discuss'
	}

	getHistoryMessage(consultId) {
		return $http({
			url: this.URLS.HISTORY_MESSAGE,
			data: {
				consultId,
				pageNumber: 0,
				pageSize: 9999
			}
		});
	}
}

export default new DoctorStore();