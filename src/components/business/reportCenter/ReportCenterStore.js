import SignStore from '../../sign/SignStore';

class PaymentStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    URLS = {
        LIST: '/manage-service/workSearch/list',
        DELETE: '/manage-service/workflow/update_del'
    }

    callbacks = {
        beforeList(data) {
            var params = data && data.data;
            if (params) {
                params.userId = SignStore.getCurrentUserSync().id;
            }
            return data;
        }
    }

    removeById(taskId) {
        return $http({
            url: this.URLS.DELETE,
            type: 'POST',
            data: {
                taskIds: taskId
            }
        });
    }

}

export default new PaymentStore();