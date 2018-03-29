class MenuStore {

    constructor() {}

    URLS = {
        ROLL_ALL: '/service/system/role',
        ROLE_SAVE: '/service/system/role',
        ROLE_DELETE: '/service/system/role/{id}',
        AUTH_ROLE_TO_ACCOUNT: '/service/system/role/authRoleToAccount',
        ROLES_OF_ACCOUNT: '/service/system/role/account/roles'
    }

    all(type) {
        return $http({
            url: this.URLS.ROLL_ALL,
            data: {
                type: type,
                pageNumber: 1,
                pageSize: 10000
            }
        }).then(res => {
            return res && res.rows || [];
        });
    }

    saveRole(data) {
        return $http({
            url: this.URLS.ROLE_SAVE,
            type: data.id ? 'PUT' : 'POST',
            data: data
        });
    }

    removeRole(id) {
        return $http({
            url: this.URLS.ROLE_DELETE.replace(/\{id\}/, id),
            type: 'DELETE'
        });
    }

    authRoleToAccount(params) {
        return $http({
            url: this.URLS.AUTH_ROLE_TO_ACCOUNT,
            type: 'POST',
            data: params
        });
    }

    rolesOfAccount(accountId) {
        return $http({
            url: this.URLS.ROLES_OF_ACCOUNT,
            data: {
                accountId : accountId
            }
        });
    }

}

export default new MenuStore();