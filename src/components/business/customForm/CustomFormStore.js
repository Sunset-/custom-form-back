class DoctorStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    callbacks = {}

    METHODS = {
        SAVE: 'POST'
    }

    URLS = {
        LIST: '/manage-service/designed_form',
        SAVE: '/manage-service/designed_form/add_or_update'
    }

    save(model) {
        return $http(this._triggerEvent('beforeSave', {
            url: this._getURL('SAVE'),
            type: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(model)
        })).then(res => {
            this._triggerEvent('dataDirty', model);
            return this._triggerEvent('afterSave', res);
        });
    }

}

export default new DoctorStore();