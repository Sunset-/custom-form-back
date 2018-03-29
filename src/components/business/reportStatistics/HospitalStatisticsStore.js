import SignStore from '../../sign/SignStore';

const URLS = {
    STATISTICS: '/manage-service/workStats/opc',
    DETAIL_LIST: '/manage-service/workSearch/list',
    DETAIL_COUNT: '/manage-service/workStats/medical/summary'
}

export default {
    statistics(model) {
        model.userId = SignStore.getCurrentUserSync().id;
        return $http({
            url: URLS.STATISTICS,
            data: model
        });
    },
    detailList(model) {
        model.userId = SignStore.getCurrentUserSync().id;
        return $http({
            url: URLS.DETAIL_LIST,
            data: model
        }).then(res => {
            res && res.data && res.data.forEach(item => {
                try {
                    Object.assign(item.applyForm, JSON.parse(item.applyForm.fixedField));
                } catch (e) {

                }
            });
            return res;
        });
    },
    detailCount(model) {
        model.userId = SignStore.getCurrentUserSync().id;
        return $http({
            url: URLS.DETAIL_COUNT,
            data: model
        })
    },
    download(filter) {
        filter.userId = SignStore.getCurrentUserSync().id;
        let c = [];
        for (let k in filter) {
            filter[k] && c.push(k + '=' + encodeURIComponent(filter[k]));
        }
        window.location.href = window.location.origin +
            '/manage-service/workSearch/export?' + c.join('&');
    }
};