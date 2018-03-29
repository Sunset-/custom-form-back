import config from './common/config';
import Base from './common/base';
import './common/GlobalService';
import 'ztree';
import 'ztree-style';
import 'ueditor-config';
import 'ueditor';
import echarts from 'echarts';
window.echarts = echarts;

import Vue from 'vue';
import Router from 'vue-router';
import iview from 'iview';
import iviewstyle from 'iview-style';
import SunsetUI from 'sunset-ui';
import SunsetUIExt from './sunset-ui-ext';
import jrQrcode from './vendor/qrcode/jr-qrcode.min';

Vue.use(Router);
Vue.use(iview);
Vue.use(SunsetUI);

import App from './components/App.vue';
import Modules from './components/Modules.vue';
import MenuStore from './components/system/menu/MenuStore';
import DictionaryStore from './components/business/dictionary/DictionaryStore';

import Sign from './components/sign/Sign.vue';
import SignStore from './components/sign/SignStore';

//模块
import {
	moduleComponent
} from './modules';

var router = new Router();

window.Router = router;


router.beforeEach(function (transition) {
	if (transition.to.path != '/sign') {
		SignStore.currentUser().then(data => {
			transition.next();
		}, err => {
			transition.abort();
			router.go('/sign');
		});
	} else {
		transition.next();
	}
})

Promise.all([
	MenuStore.getAllMenus(),
	DictionaryStore.getAll()
]).then(res => {
	var menus = res[0],
		dictionary = res[1];

	//初始化菜单
	var mountedModule = {};
	menus && menus.forEach(menu => {
		if (menu.module) {
			mountedModule[menu.module] = true;
		}
	});
	router.map({
		'/sign': {
			component: Sign
		},
		'/': {
			component: Modules,
			subRoutes: (function () {
				var map = {};
				for (var key in moduleComponent) {
					if (mountedModule[key] && moduleComponent.hasOwnProperty(key)) {
						map[`/app/${key}`] = {
							component: moduleComponent[key]
						};
					}
				}
				return map;
			})()
		}
	});

	//安装字典
	Sunset.Service.Dictionary.install(dictionary);

	//开始
	router.start(App, 'app');
});