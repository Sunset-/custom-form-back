class PaymentStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	URLS = {
		LIST: '/service/business/payment',
		SAVE: '/service/business/payment',
		DELETE: '/service/business/payment/{id}',
	}

}

export default new PaymentStore();