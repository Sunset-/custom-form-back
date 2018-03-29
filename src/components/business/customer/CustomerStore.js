import SignStore from '../../sign/SignStore';

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
		LIST: '/manage-service/customer',
		SAVE: '/manage-service/customer/new_update',
		DELETE: '/manage-service/customer/delete',
		RELATION: '/manage-service/relation/doctors',
		SAVE_REL: '/manage-service/relation/new',
		REMOVE_REL: '/manage-service/relation/del',
		RELATION_ALL: '/manage-service/relation/customers'
	}

	listRel(filter) {
		return $http({
			url: this.URLS.RELATION,
			data: filter
		});
	}

	saveRel(model) {
		return $http({
			url: this.URLS.SAVE_REL,
			type: 'POST',
			data: model
		});
	}

	removeRel(relationId) {
		return $http({
			url: this.URLS.REMOVE_REL,
			data: {
				relationId
			}
		});
	}

	relationAll(filter, userId) {
		return $http({
			url: this.URLS.RELATION_ALL,
			data: {
				userId: userId || SignStore.getCurrentUserSync().id,
				select: JSON.stringify(filter)
			}
		});
	}
}

export default new DoctorStore();