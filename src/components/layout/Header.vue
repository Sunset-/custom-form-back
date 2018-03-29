<style lang="sass">
    .peaimage-header {
        position: relative;
        width: 100%;
        height: 60px;
        background: #39f;
        .peaimage-logo {
            float: left;
            width: 239px;
            text-align: center;
            img {
                width: 180px;
                margin-top: 7px;
            }
        }
        .peaimage-nav {
            margin-left: 239px;
            margin-right: 200px;
        }
        .header-right-menu {
            position: absolute;
            top: 0px;
            right: 0px;
            .avator-link {
                display: inline-block;
                min-width: 100px;
                color: #FFF;
                cursor: pointer;
                margin-top: 10px;
                margin-right: 10px;
                img {
                    vertical-align: middle;
                    border-radius: 50px;
                    width: 40px;
                }
                span {
                    padding: 0px 5px;
                }
            }
        }
    }
</style>
<template>
    <div class="peaimage-header">
        <div class="peaimage-logo" :style="logoStyle">
            <img :src="logo" :style="logoStyle" />
        </div>
        <Menu class="peaimage-nav" mode="horizontal" theme="primary" :style="navStyle" :active-key="activeNav">
            <Menu-item v-for="nav in navs" :key="nav.name" @click="go(nav)">
                <Icon type="ios-paper"></Icon>
                {{nav.title}}
            </Menu-item>
            <Menu-item @click="download()" key="123">
                <Icon type="ios-paper"></Icon>
                下载到桌面
            </Menu-item>
        </Menu>
        <div class="header-right-menu">
            <Dropdown @on-click="operate">
                <div class="avator-link">
                    <img :src="userEntity.picture | upload-image" onerror="this.src='/assets/img/user-default.png'" alt="用户头像" class="img-circle img-inline userpic-32"
                        width="28" />
                    <span>{{userEntity.designation}}</span>
                    <Icon type="arrow-down-b"></Icon>
                </div>
                <Dropdown-menu slot="list">
                    <Dropdown-item v-for="menu in showMenus" :divided="menu.divided" :key="$index">{{menu.title}}</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
        </div>
        <sunset-form-modal v-ref:passwordmodal :options="updatePasswordFormModal"></sunset-form-modal>
        <sunset-form-modal v-ref:feedbackmodal :options="feedbackFormModal"></sunset-form-modal>
        <sunset-view-modal v-ref:aboutmodal :options="{title:'关于Peaimage'}">
            <peaimage-about></peaimage-about>
        </sunset-view-modal>
        <sunset-view-modal v-ref:helpmodal :options="{title:'操作指南'}">
            <peaimage-help></peaimage-help>
        </sunset-view-modal>
        <sunset-view-modal v-ref:hospitalhelpmodal :options="{title:'操作指南'}">
            <peaimage-hospitalhelp></peaimage-hospitalhelp>
        </sunset-view-modal>
    </div>
</template>

<script>
    import SignStore from '../sign/SignStore';
    import PeaimageAbout from './About.vue';
    import PeaimageHelp from './Help.vue';
    import PeaimageHospitalhelp from './HospitalHelp';


    export default {
        components: {
            PeaimageAbout,
            PeaimageHelp,
            PeaimageHospitalhelp
        },
        props: {
            navs: {},
            menus: {}
        },
        data() {
            return {
                logo: '',
                logoStyle: {},
                navStyle: {},
                userObject: {},
                allMenus: [{
                    title: '修改密码',
                    name: 'UPDATE_PASSWORD',
                    premise: () => {
                        return !this.userEntity.isVisitor;
                    },
                    operate: () => {
                        var user = SignStore.getCurrentUserSync();
                        clearTimeout(this.updatePasswordFormModal.formOptions.fields[0].timer);
                        this.updatePasswordFormModal.formOptions.fields[0].append = '获取验证码';
                        this.$refs.passwordmodal.open({
                            acc: user.account.phone
                        });
                    }
                }, {
                    title: '操作指南',
                    name: 'DOCTOR_OPERATE_HELP',
                    operate: () => {
                        this.$refs.helpmodal.open();
                    }
                }, {
                    title: '操作指南',
                    name: 'HOSPITAL_OPERATE_HELP',
                    operate: () => {
                        this.$refs.hospitalhelpmodal.open();
                    }
                }, {
                    title: '反馈意见',
                    name: 'FEEDBACK',
                    operate: () => {
                        this.$refs.feedbackmodal.open({});
                    }
                }, {
                    title: '关于我们',
                    name: 'ABOUT',
                    operate: () => {
                        this.$refs.aboutmodal.open();
                    }
                }, {
                    title: '安全退出',
                    name: 'LOGOUT',
                    operate() {
                        SignStore.logout().then(res => {
                            Router.go('/sign');
                        });
                    },
                    divided: true
                }],
                updatePasswordFormModal: {
                    title: '修改密码',
                    width: '800',
                    formOptions: {
                        cols: 2,
                        store: SignStore,
                        fields: [{
                            label: '手机号',
                            name: 'acc',
                            widget: 'input',
                            readonly: true,
                            append: '获取验证码',
                            click(options) {
                                var user = SignStore.getCurrentUserSync();
                                if (user && options.append == '获取验证码') {
                                    SignStore.sendCode(user.account.phone).then(res => {
                                        var time = 60;
                                        options.append = `${time}秒后重发`;
                                        options.timer = setInterval(() => {
                                            time--;
                                            options.append = `${time}秒后重发`;
                                            if (time <= 0) {
                                                clearTimeout(options.timer);
                                                options.append = '获取验证码';
                                            }
                                        }, 1000);
                                    });
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '验证码',
                            name: 'code',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 6
                            }
                        }, {
                            label: '新密码',
                            name: 'pwd',
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
                            if (model.pwd != model.pwdAgain) {
                                Sunset.tip('两次密码输入不一致', 'warning');
                                throw new Error();
                                return false;
                            }
                            return true;
                        },
                        tools: false
                    }
                },
                feedbackFormModal: {
                    title: '反馈意见',
                    formOptions: {
                        cols: 2,
                        store: SignStore,
                        fields: [{
                            label: '联系电话',
                            name: 'phone',
                            widget: 'input',
                            validate: {
                                required: true,
                                phone: true
                            }
                        }, {
                            label: '意见建议',
                            name: 'content',
                            widget: 'textarea',
                            monopolize: true,
                            validate: {
                                required: true,
                                maxlength: 200
                            }
                        }],
                        method: 'feedback',
                        format: (model) => {
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: false
                    }
                }
            }
        },
        computed: {
            activeNav() {
                var path = this.$route.path;
                path = path.substr(path.indexOf('/') + 1);
                path = path.substr(0, path.indexOf('/'));
                return path;
            },
            userEntity() {
                return this.userObject.entity || {
                    isVisitor: true,
                    designation: '游客'
                };
            },
            showMenus() {
                var menus = this.menus && this.menus.split(',') || [];
                var a = this.allMenus.filter(m => {
                    if (~menus.indexOf(m.name)) {
                        if (m.premise) {
                            return m.premise();
                        } else {
                            return true;
                        }
                    }
                    return false;
                });
                return a;
            }

        },
        methods: {
            go(nav) {
                this.$emit('change', nav.menus);
                Router.go(nav.path);
            },
            operate(v) {
                this.showMenus[v].operate();
            },
            refreshUser() {
                SignStore.currentUser().then(res => {
                    this.userObject = res;
                });
            },
            download() {
                window.open(`${window.location.origin}/assets/download/peaimage.url`)
            }
        },
        ready() {
            this.logo = Base.IS_OPC ? '/assets/img/mdds_logo.png' : '/assets/img/logo.png';
            if (Base.IS_OPC) {
                this.logoStyle = {
                    width: '130px',
                    'margin-top': '0px'
                };
                this.navStyle = {
                    'margin-left': '130px'
                }
            }
            this.refreshUser();
        }
    }
</script>