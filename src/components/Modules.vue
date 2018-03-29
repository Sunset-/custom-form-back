<style lang="sass">
    .peaimage-manage-container {
        .sunset-title {
            font-size: 22px;
            height: 40px;
            line-height: 40px;
            font-weight: normal;
        }
        .sunset-layout-content {
            top: 40px;
        }
    }
</style>
<template>
    <sunset-container v-ref:container class="peaimage-manage-container">
        <sunset-sidebar v-ref:sidebar @change="changeSideWidth" slot="leftside" :menus="menus" logo="豌豆管理平台"></sunset-sidebar>
        <sunset-header :current-user="currentUser" :menus="headerMenus">
        </sunset-header>
        <sunset-major>
            <router-view></router-view>
        </sunset-major>
        <sunset-form-modal v-ref:passwordmodal :options="updatePasswordOptions"></sunset-form-modal>
    </sunset-container>
</template>
<script>
    import SignStore from './sign/SignStore';
    import MenuStore from './system/menu/MenuStore';
    import {
        modules
    } from '../modules.js';

    export default {
        data() {
            return {
                currentUser: null,
                headerMenus: [{
                    title: '修改密码',
                    operate: () => {
                        this.$refs.passwordmodal.open({
                            id: SignStore.getCurrentUserSync().id
                        });
                    }
                }, {
                    title: '安全退出',
                    operate() {
                        SignStore.logout().then(data => {
                            Router.go('/sign');
                        });
                    }
                }],
                updatePasswordOptions: {
                    title: '修改密码',
                    width: '800',
                    formOptions: {
                        cols: 2,
                        method: 'updatePassword',
                        store: SignStore,
                        fields: [{
                            label: '原密码',
                            name: 'oldPassword',
                            widget: 'input',
                            type: 'password',
                            validate: {
                                required: true,
                                maxlength: 26
                            }
                        }, {
                            label: '新密码',
                            name: 'password',
                            widget: 'input',
                            type: 'password',
                            validate: {
                                required: true,
                                maxlength: 26
                            }
                        }, {
                            label: '重复密码',
                            name: 'pwdAgain',
                            widget: 'input',
                            type: 'password',
                            validate: {
                                required: true,
                                maxlength: 26
                            }
                        }],
                        method: 'updatePassword',
                        format: (model) => {
                            return model;
                        },
                        validate: (model) => {
                            if (model.password != model.pwdAgain) {
                                Sunset.tip('两次密码输入不一致', 'warning');
                                throw new Error();
                                return false;
                            }
                            return true;
                        },
                        tools: false
                    }
                },
                menus: []
            }
        },
        methods: {
            changeSideWidth(leftWidth) {
                this.$refs.container.changeSideWidth(leftWidth);
            }
        },
        ready() {
            //模块
            let moduleMap = {};
            modules && modules.forEach(m => {
                moduleMap[m.name] = m;
            });
            //菜单
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
                SignStore.currentUser().then(user => {
                    if (user && user.permissions) {
                        user.permissions.split(',').forEach(p => {
                            if (module_menu[p]) {
                                delete parent_menu[module_menu[p]];
                            }
                        });
                        this.menus = menus.filter(item => !parent_menu[item.id.split('-')[1]]);
                        this.$refs.sidebar.init();
                    }
                });
            });
            //登录用户
            SignStore.currentUser().then(user => {
                this.currentUser = user;
            });
        }
    }
</script>