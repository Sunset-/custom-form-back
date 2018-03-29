import Vue from 'vue';

const SessionCache = {
	cache: null
}

const URLS = {
	LOGIN: '/service/manage/sign/login',
	LOGOUT: '/service/manage/sign/logout',
	CURRENT: '/service/manage/sign/currentUser',
	FORGET: '/service/system/user/member/findPwd',
	UPDATE_PASSWORD: '/service/manage/account/modifyPassword'
};
export default {
	currentUserCache: null,
	login(model) {
		return $http({
			url: URLS.LOGIN,
			type: 'POST',
			data: model
		}).then(data => {
			data && this.updatePermission(data.permissions);
			return SessionCache.cache = data;
		});
	},
	logout() {
		return $http({
			url: URLS.LOGOUT
		}).then(data => {
			return SessionCache.cache = null;
		});
	},
	currentUser: Sunset.wait(function () {
		return $http({
			url: URLS.CURRENT
		}).then(data => {
			data && this.updatePermission(data.permissions);
			return SessionCache.cache = data;
		});
	}, SessionCache),
	getCurrentUserSync() {
		return SessionCache.cache;
	},
	updatePassword(model) {
		return $http({
			url: URLS.UPDATE_PASSWORD,
			type: 'POST',
			data: model
		});
	},
	updatePermission(permissions) {
		var cache = {};
		permissions && permissions.split(',').forEach(item => {
			cache[item] = true;
		});
		Base.permissions = cache;
		Vue.directive('permission', {
			update: function (newValue, oldValue) {
				if (newValue && !(Base && Base.permissions[newValue])) {
					this.el.remove();
				}
			}
		});
	}
}


Vue.directive('permission', {
	update: function (newValue, oldValue) {}
})