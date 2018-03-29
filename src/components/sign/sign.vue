<style lang="sass">
	.sign-container {
		.sangto-login-bg {
			position: fixed;
			z-index: 10;
			left: 0px;
			top: 0px;
			bottom: 0px;
			width: 100%;
			height: 100%;
			overflow: hidden;
			list-style: none;
			padding: 0px;
		}
		.sangto-login-bg li {
			position: absolute;
			top: 0px;
			left: 0px;
			width: 100%;
		}
		.sangto-login-bg li img {
			width: 100%;
		}
		.sangto-login-container.page-container {
			position: relative;
			z-index: 1000;
			width: 350px;
			height: auto;
			margin: 120px auto 0 auto;
			text-align: center;
		}
		.sangto-login-container h1 {
			font-size: 30px;
			font-weight: 700;
			text-shadow: 0 1px 4px rgba(0, 0, 0, .2);
		}
		.sangto-login-container form {
			position: relative;
			width: 350px;
			margin: 15px auto 0 auto;
			text-align: center;
		}
		.sangto-login-container input {
			width: 300px;
			height: 42px;
			margin-top: 25px;
			padding: 0 15px;
			background: #2d2d2d;
			/* browsers that don't support rgba */
			background: rgba(45, 45, 45, .15);
			-moz-border-radius: 6px;
			-webkit-border-radius: 6px;
			border-radius: 6px;
			border: 1px solid #3d3d3d;
			/* browsers that don't support rgba */
			border: 1px solid rgba(255, 255, 255, .15);
			-moz-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset;
			-webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset;
			box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset;
			font-family: 'PT Sans', Helvetica, Arial, sans-serif;
			font-size: 14px;
			color: #fff;
			text-shadow: 0 1px 2px rgba(0, 0, 0, .1);
			-o-transition: all .2s;
			-moz-transition: all .2s;
			-webkit-transition: all .2s;
			-ms-transition: all .2s;
		}
		.sangto-login-container input:-moz-placeholder {
			color: #fff;
		}
		.sangto-login-container input:-ms-input-placeholder {
			color: #fff;
		}
		.sangto-login-container input::-webkit-input-placeholder {
			color: #fff;
		}
		.sangto-login-container input:focus {
			outline: none;
			-moz-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
		}
		.sangto-login-container button {
			cursor: pointer;
			width: 300px;
			height: 44px;
			margin-top: 25px;
			padding: 0;
			background: #ef4300;
			-moz-border-radius: 6px;
			-webkit-border-radius: 6px;
			border-radius: 6px;
			border: 1px solid #ff730e;
			-moz-box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .25) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .25) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .25) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			font-family: 'PT Sans', Helvetica, Arial, sans-serif;
			font-size: 14px;
			font-weight: 700;
			color: #fff;
			text-shadow: 0 1px 2px rgba(0, 0, 0, .1);
			-o-transition: all .2s;
			-moz-transition: all .2s;
			-webkit-transition: all .2s;
			-ms-transition: all .2s;
		}
		.sangto-login-container button:hover {
			-moz-box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .15) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .15) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .15) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
		}
		.sangto-login-container button:active {
			-moz-box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .15) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 15px 30px 0 rgba(255, 255, 255, .15) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
			box-shadow: 0 5px 8px 0 rgba(0, 0, 0, .1) inset, 0 1px 4px 0 rgba(0, 0, 0, .1);
			border: 0px solid #ef4300;
		}
		.sangto-login-container .error {
			color: #cdcdcd;
			position: absolute;
			top: 27px;
			right: -55px;
			width: 40px;
			height: 40px;
			background: #2d2d2d;
			/* browsers that don't support rgba */
			background: rgba(45, 45, 45, .25);
			-moz-border-radius: 8px;
			-webkit-border-radius: 8px;
			border-radius: 8px;
		}
		.sangto-login-container .error span {
			display: inline-block;
			margin-left: 6px;
			font-size: 40px;
			font-weight: 700;
			line-height: 37px;
			text-shadow: 0 1px 2px rgba(0, 0, 0, .1);
			-o-transform: rotate(45deg);
			-moz-transform: rotate(45deg);
			-webkit-transform: rotate(45deg);
			-ms-transform: rotate(45deg);
		}
		.sangto-login-container .error p {
			position: absolute;
			width: 200px;
			text-align: left;
			left: 50px;
			top: 10px;
		}
		input:-webkit-autofill {
			background-color: #FAFFBD;
			background-image: none;
			color: #000;
		}
		.sangto-login-container .connect {
			width: 305px;
			margin: 35px auto 0 auto;
			font-size: 18px;
			font-weight: 700;
			text-shadow: 0 1px 3px rgba(0, 0, 0, .2);
		}
		.sangto-login-container .connect a {
			display: inline-block;
			width: 32px;
			height: 35px;
			margin-top: 15px;
			-o-transition: all .2s;
			-moz-transition: all .2s;
			-webkit-transition: all .2s;
			-ms-transition: all .2s;
		}
		.sangto-login-container .connect a:hover {
			background-position: center bottom;
		}
		/*－－－增加部份的CSS－－－*/
		.sangto-login-container form,
		.sangto-login-container input,
		.sangto-login-container button {
			font-family: Microsoft YaHei, Segoe UI, Tahoma, Arial, Verdana, sans-serif;
			text-decoration: none;
			width: 100%;
		}
		.sangto-login-container button.submit_button {
			font-size: 24px;
			letter-spacing: 15px;
		}
		.sangto-login-container input.Captcha {
			width: 130px;
			float: left;
		}
	}
</style>
<template>
	<div class="sign-container">
		<div class="page-container sangto-login-container">
			<h1 class="text-white">豌豆管理平台</h1>
			<form name="form" @submit="login" onsubmit="return false;">
				<input type="text" class="username" autocomplete="off" v-model="model.account" required placeholder="用户名" ng-change="authError=null"
				/>
				<input type="password" class="password" autocomplete="off" v-model="model.password" required placeholder="密码" ng-change="authError=null"
				/>
				<input type="text" style="display:none;">
				<!-- <div ng-show="authError" class="error"><span>+</span><p>{{authError}}</p></div> -->
				<button type="submit" class="submit_button">登录</button>
			</form>
			<div class="connect">
				<div class="text-center" ng-include="'tpl/blocks/page_footer.html'"></div>
			</div>
		</div>
		<ul class="sangto-login-bg">
			<li><img src="/assets/img/login/1.jpg" /></li>
			<li><img src="/assets/img/login/2.jpg" /></li>
			<li><img src="/assets/img/login/3.jpg" /></li>
			<li><img src="/assets/img/login/4.jpg" /></li>
			<li><img src="/assets/img/login/5.jpg" /></li>
		</ul>
	</div>
</template>
<script>
	import SignStore from './SignStore';
	import MenuStore from '../system/menu/MenuStore';

	export default {
		data() {
			return {
				model: {
					account: '',
					password: ''
				}
			}
		},
		methods: {
			login() {
				SignStore.login(this.model).then(function (currentUser) {
					MenuStore.getAllMenus().then(res => {
						let menus = [];
						let menuMap = {};
						let module_menu = {};
						let parent_menu = {};
						res && res.forEach(m => {
							if (m.parentId == '0') {
								let parentMenu = {
									title: m.name,
									icon: m.icon,
									path: m.module ? (`/app/${m.module}`) : null,
									subMenus: m.module ? null : [],
									permission: m.module ? m.module : null,
									id: m.module ? null : `MENU-${m.id}`
								};
								if (!m.module) {
									parent_menu[m.id] = `MENU-${m.id}`;
								}
								menus.push(parentMenu);
								menuMap[m.id] = parentMenu;
							} else {
								menuMap[m.parentId].subMenus.push({
									title: m.name,
									icon: m.icon,
									path: `/app/${m.module}`,
									permission: m.module
								});
								module_menu[m.module] = m.parentId;
							}
						});
						var jumpPath = null;
						for (var i = 0, m; m = menus[i++];) {
							if (m.subMenus) {
								for (var j = 0, n; n = m.subMenus[j++];) {
									if (currentUser.permissionMap[n.permission]) {
										jumpPath = n.path;
										break;
									}
								}
								if (jumpPath) {
									break;
								}
							}
						}
						if (jumpPath) {
							Router.go(jumpPath);
						} else {
							Sunset.tip('此帐户无任何权限');
							SignStore.logout().then(res => {
								Router.go('/sign');
							});
						}
					});
				});
			}
		},
		ready() {
			$(function () {
				var $imgs = $('.sangto-login-bg li'),
					size = $imgs.length,
					top,
					list = [];

				function resetZindex() {
					for (var i = 0; i < $imgs.length; i++) {
						list.push($($imgs[i]).css({
							'z-index': i
						}));
					}
					top = size;
				}

				function change() {
					setTimeout(function () {
						var $img = list.shift();
						list.push($img);
						if (top == (size * 2)) {
							resetZindex();
						}
						$img.css({
							'opacity': '0',
							'z-index': (++top)
						}).animate({
							'opacity': 1
						}, 1600, change);
					}, 5000);
				}
				resetZindex();
				change();
			});
		}
	}
</script>