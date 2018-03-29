class RelCustomerStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    URLS = {
        LIST: '/service/manage/account',
        SAVE: '/manage-service/user/add_or_update'
    }

    callbacks = {
        afterList(data) {
            data && data.rows && data.rows.forEach(item => {
                delete item.password;
            })
            return data;
        }
    }

}

export default new RelCustomerStore();