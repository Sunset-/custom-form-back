class TemplateStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    METHODS = {
        SAVE: 'POST',
        DELETE: 'POST'
    }

    URLS = {
        LIST: '/manage-service/template/find_template_report',
        SAVE: '/manage-service/template/add_update_template_report',
        DELETE: '/manage-service/template/del_template_report'
    }

    callbacks = {
        beforeSave(params) {
            params.data = {
                record: JSON.stringify(params.data)
            };
            return params;
        }
    }

}

export default new TemplateStore();