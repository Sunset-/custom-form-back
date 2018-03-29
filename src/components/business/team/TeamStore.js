class TeamStore extends Sunset.Service.Store {

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

	URLS = {
		LIST: '/manage-service/team',
		GET_BY_ID: '/manage-service/team/{id}',
		SAVE: '/manage-service/team',
		UPDATE: '/manage-service/team/update',
		RELATION_ALL: '/manage-service/relation/teams'
	}

	/**
	 * 覆盖保存
	 * @param  {[type]} model [description]
	 * @return {[type]}       [description]
	 */
	save(model) {
		return $http(this._triggerEvent('beforeSave', {
			url: this._getURL(model.doctorTeam ? 'UPDATE' : 'SAVE'),
			headers: {
				'Content-Type': 'application/json'
			},
			type: 'POST',
			data: JSON.stringify(model)
		})).then(res => {
			this._triggerEvent('dataDirty', model);
			return this._triggerEvent('afterSave', res);
		});
	}

	relationAll(filter) {
		return $http({
			url: this.URLS.RELATION_ALL,
			data: {
				select: JSON.stringify(filter)
			}
		});
	}
}

export default new TeamStore();