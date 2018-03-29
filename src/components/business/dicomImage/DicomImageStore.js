class DicomImageStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    callbacks = {

    }

    METHODS = {}

    URLS = {
        LIST: '/business-service/discoveries/list',
        SAVE: '/business-service/discoveries/add',
        UPDATE: '/business-service/discoveries/update',
        DELETE: '/business-service/discoveries/delete'
    }

}

export default new DicomImageStore();