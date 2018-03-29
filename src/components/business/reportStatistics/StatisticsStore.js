import SignStore from '../../sign/SignStore';

const URLS = {
    PLATFORM_TYPE: '/manage-service/work_stats/union/opc',
    PLATFORM_TIME: '/manage-service/work_stats/var/time_unit',
    TEAM_TIME: '/manage-service/work_stats/union/team',

}

module.exports = {
    platform(filter) {
        filter.userId = SignStore.getCurrentUserSync().id;
        return Promise.all([$http({
            url: URLS.PLATFORM_TYPE,
            data: filter
        }), $http({
            url: URLS.PLATFORM_TIME,
            data: filter
        })]);
    },
    team(filter) {
        return $http({
            url: URLS.TEAM_TIME,
            data: filter
        });
    }
};