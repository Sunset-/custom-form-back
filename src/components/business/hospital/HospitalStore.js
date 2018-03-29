class HospitalStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	callbacks = {
		beforeList(params) {
			params.data.parameter = JSON.stringify({
				like: params.data.like
			});
			return params;
		}
	}

	METHODS = {
		LIST: 'POST',
		DELETE: 'POST'
	}

	URLS = {
		LIST: '/manage-service/hospital/find_hospital',
		SAVE: '/manage-service/hospital/add_update_hospital',
		DELETE: '/manage-service/hospital/del_hospital'
	}

	getAll() {
		$http({
			url: this.URLS.LIST,
			async: false,
			type: 'POST',
			data: {
				pageNumber: 0,
				pageSize: 9999,
				parameter: '{}'
			}
		}).then(res => {
			var HOSPITAL_MAP = {};
			if (res && res.data) {
				res.data.forEach(item => {
					HOSPITAL_MAP[item.id] = item;
				});
			}
			Base.HOSPITAL_MAP = HOSPITAL_MAP;
		});
	}
}

export default new HospitalStore();