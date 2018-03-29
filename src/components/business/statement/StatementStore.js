const URLS = {
    GET_PRICE: '/manage-service/relation/price',
    SET_PRICE: '/manage-service/relation/price/update',
    STATISTICS: '/manage-service/work_stats/team/total/bill'
};

module.exports = {
    statistics(filter) {
        return $http({
            url: URLS.STATISTICS,
            data: filter
        });
    },
    getPrice(teamId) {
        return $http({
            url: URLS.GET_PRICE,
            data: {
                teamId
            }
        });
    },
    savePrice(model) {
        return $http({
            url: URLS.SET_PRICE,
            type: 'POST',
            data: model
        });
    }
}