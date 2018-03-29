import FontAwesome from 'font-awesome';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;

window.$http = function (...args) {

	var promise = $.Deferred();

	//json提交方式处理
	var ops = args[0];
	if (ops.json === true && Sunset.isObject(ops.data)) {
		ops.headers = ops.headers || {};
		ops.headers['Content-Type'] = 'application/json';
		ops.data = JSON.stringify(ops.data);
	}

	$.ajax.apply($, args).then((res) => {
		if (typeof res == 'object' && res.code) {
			if (res.code == 200) {
				promise.resolve(res.data);
			} else if (res.code == 401) {
				Router.go('/sign');
				promise.reject(res);
			} else {
				Sunset.tip && Sunset.tip(res.message || '服务异常', 'warning')
			}
		}
		promise.reject(res);
	}, (err) => {
		console.log(err.message || err);
		promise.reject(err);
	});

	return promise;
}