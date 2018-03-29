class DoctorStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {
		beforeList(params){
			params.data = {
				select : JSON.stringify(params.data)
			};
			return params;
		}
	}

	METHODS = {
		SAVE : 'POST'
	}

	URLS = {
		LIST: '/manage-service/doctor',
		SAVE: '/manage-service/doctor/new_update'
	}

}

export default new DoctorStore();