class DoctorStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {
		beforeList(params) {
			params.data = {
				select: JSON.stringify(params.data)
			};
			return params;
		}
	}

	METHODS = {
		SAVE: 'POST'
	}

	URLS = {
		LIST: '/manage-service/consult_expert/list',
		GET_BY_ID: '/manage-service/consult_expert/{id}',
		SAVE: '/manage-service/consult_expert/add_or_update',
		SWITCH_SHOW: '/manage-service/consult_expert/show'
	}

	getById(id) {
		return $http({
			url: this.URLS.GET_BY_ID.replace(/\{id\}/, id)
		});
	}

	switchShow(data) {
		return $http({
			url: this.URLS.SWITCH_SHOW,
			type: 'POST',
			data: data
		});
	}
}

export default new DoctorStore();