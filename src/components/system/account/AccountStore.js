class AccountStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	URLS = {
		LIST: '/service/manage/account',
		SAVE: '/service/manage/account',
		DELETE: '/service/manage/account/{id}',
		RESET_PASSWORD: '/service/manage/account/resetPassword'
	}

	callbacks = {
		afterList(data) {
			data && data.rows && data.rows.forEach(item => {
				delete item.password;
			})
			return data;
		}
	}

	resetPassword(model) {
		return $http({
			url: this.URLS.RESET_PASSWORD,
			type: 'POST',
			data: model
		});
	}

}

export default new AccountStore();