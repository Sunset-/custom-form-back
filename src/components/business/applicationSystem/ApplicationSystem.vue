<style lang="sass">
    @import '../../style/index.scss';
    .application-tree-container {
        position: absolute;
        left: 15px;
        right: 15px;
        top: 50px;
        bottom: 65px;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid #efefef;
    }

    .application-toolbar {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding: 15px;
        .sunset-toolbar {
            text-align: center;
        }
    }

    .apps-wrap {
        margin-top: 10px;
        .app-item {
            position: relative;
            background: $background;
            padding: 10px;
            border: 1px solid $border;
            cursor: pointer;
            margin-bottom: 8px;
            border-radius: 2px;
            &.active {
                border: 1px solid $success;
            }
            label {
                display: block;
                font-size: 16px;
                cursor: pointer;
            }
            span {
                position: absolute;
                right: 5px;
                top: 5px;
                font-size: 12px;
                cursor: pointer;
            }
            p {
                color: $light;
                cursor: pointer;
            }
        }
    }

    .app-content {
        height: 100%;
        overflow: auto;
        padding: 0px;
        &>h4 {
            font-size: 14px;
            font-weight: bold;
            color: #222;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #aaa;
        }
    }
</style>
<template>
    <sunset-layout title="应用系统管理" type="leftside-content">
        <div slot="leftside">
            <div class="title" style="border-bottom:1px solid #ccc;padding-bottom:5px;">应用系统列表
                <sunset-toolbar size="small" style="float:right;" :options="options.toolBarOptions"></sunset-toolbar>
            </div>
            <div class="apps-wrap">
                <div v-for="app in apps" :class="['app-item',selectedApp==app?'active':'']" @click="selectApp(app)">
                    <label>
                    <span>{{app.agencyCode}}</span>
                    {{app.name}}<a href="javascript:;" @click="modifySystem(app)" style="font-size:12px;margin-left:5px;">修改</a>
                    </label>
                    <p>{{app.domain}}
                        <font style="float:right;">{{app.createTime | time 'yyyy-MM-dd HH:mm'}}</font>
                    </p>
                </div>
            </div>
        </div>
        <div class="app-content" slot="content">
            <Tabs type="card" :animated="false" active-key="managers">
                <Tab-pane label="运营账号" key="managers">
                    <sunset-toolbar v-show="selectedApp" :options="options.doctorToolbar" style="margin-bottom:10px;"></sunset-toolbar>
                    <sunset-table v-ref:table :options="options.operaterTableOptions"></sunset-table>
                </Tab-pane>
                <Tab-pane label="功能模块" key="modules">
                    <system-module :application="selectedApp"></system-module>
                </Tab-pane>
                <Tab-pane label="功能卡片" key="cards">
                    <sunset-toolbar v-show="selectedApp" :options="options.cardToolbar" style="margin-bottom:10px;"></sunset-toolbar>
                    <sunset-table v-ref:cardtable :options="options.cardTableOptions"></sunset-table>
                </Tab-pane>
            </Tabs>
        </div>
    </sunset-layout>
    <sunset-form-modal v-ref:formmodal :options="options.formModalOptions" @saved="refreshapps"></sunset-form-modal>
    <sunset-form-modal v-ref:operatormodal :options="options.operatormodalOptions" @saved="refreshOperaters"></sunset-form-modal>
    <sunset-table-modal v-ref:cardrelationmodal :options="options.cardrelationOptions" @submit="relationCards"></sunset-table-modal>
    <sunset-form-modal v-ref:cardconfigmodal :options="options.cardConfigOptions" @saved=""></sunset-form-modal>
</template>
<script>
    import ApplicationSystemStore from './ApplicationSystemStore.js';
    import FunctionCardStore from '../functionCard/FunctionCardStore.js';
    import SystemModule from './SystemModule.vue';

    export default {
        components: {
            SystemModule
        },
        data() {
            return {
                apps: [],
                selectedApp: null,
                checkeds: [],
                cardsCache: null,
                options: {
                    //工具栏
                    toolBarOptions: {
                        size: 'small',
                        tools: [{
                                label: '新增',
                                color: 'success',
                                icon: 'plus-round',
                                operate: () => {
                                    this.$refs.formmodal.open({});
                                },
                                permission: 'Permission_MODIFY'
                            },
                            //  {
                            //     label: '修改',
                            //     color: 'warning',
                            //     icon: 'edit',
                            //     operate: () => {
                            //         if (this.selectedApp) {
                            //             this.$refs.formmodal.open(Object.assign({}, this.selectedApp));
                            //         }
                            //     },
                            //     permission: 'Permission_MODIFY'
                            // }, {
                            //     label: '删除',
                            //     color: 'error',
                            //     icon: 'close-round',
                            //     operate: () => {
                            //         if (this.selectedApp) {
                            //             var clear = Sunset.confirm({
                            //                 content: `确定删除角色：${this.selectedApp.name}`,
                            //                 loading: true,
                            //                 onOk: () => {
                            //                     ApplicationSystemStore.removeapp(this.selectedApp.id)
                            //                         .then(
                            //                             res => {
                            //                                 clear();
                            //                                 Sunset.tip('删除成功', 'success');
                            //                                 this.apps.splice(this.apps.indexOf(this.selectedApp),
                            //                                     1);
                            //                                 this.selectedApp = null;
                            //                             });
                            //                 }
                            //             });
                            //         }
                            //     },
                            //     permission: 'Permission_MODIFY'
                            // }
                        ]
                    },
                    formModalOptions: {
                        title: '编辑应用系统',
                        formOptions: {
                            cols: 2,
                            store: ApplicationSystemStore,
                            fields: [{
                                label: '系统ID',
                                name: 'id',
                                widget: 'input',
                                readonly: true,
                                premise(model) {
                                    return model.id;
                                }
                            }, {
                                label: '系统名称',
                                name: 'name',
                                widget: 'input',
                                validate: {
                                    required: true,
                                    maxlength: 32
                                }
                            }, {
                                label: '系统标识',
                                name: 'agencyCode',
                                widget: 'input',
                                placeholder: '系统的命名空间，平台唯一',
                                validate: {
                                    required: true,
                                    maxlength: 20
                                }
                            }, {
                                label: '域名',
                                name: 'domain',
                                widget: 'input',
                                placeholder: '系统入口',
                                validate: {
                                    maxlength: 32
                                }
                            }, {
                                label: '配置',
                                name: 'config',
                                widget: 'coder',
                                monopolize: true
                            }],
                            format: (model) => {
                                return model;
                            },
                            validate: (model) => {
                                return true;
                            },
                            tools: false,
                            store: ApplicationSystemStore
                        }
                    },
                    doctorToolbar: {
                        tools: [{
                            label: '添加运营账号',
                            color: 'success',
                            icon: 'plus',
                            operate: () => {
                                this.$refs.operatormodal.open();
                            }
                        }]
                    },
                    operatormodalOptions: {
                        title: '运营管理员',
                        width: 700,
                        formOptions: {
                            cols: 2,
                            fields: [{
                                group: '账号信息',
                                label: '用户名',
                                name: 'username',
                                widget: 'input'
                            }, {
                                label: '密码',
                                name: 'password',
                                widget: 'input'
                            }, {
                                group: '人员信息',
                                label: '姓名',
                                name: 'name',
                                widget: 'input'
                            }, {
                                label: '联系电话',
                                name: 'mobilePhone',
                                widget: 'input'
                            }],
                            tools: false,
                            submit: (data) => {
                                data.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'OPERATER');
                                data.entity = JSON.stringify({
                                    systemId: this.selectedApp.id,
                                    agencyCode: this.selectedApp.agencyCode,
                                    userType: data.userType,
                                    name: data.name,
                                    mobilePhone: data.mobilePhone
                                });
                                delete data.name;
                                delete data.mobilePhone;
                                return ApplicationSystemStore.saveOperater(data);
                            }
                        }
                    },
                    operaterTableOptions: {
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: true,
                        multiCheck: false,
                        sortable: true,
                        lazy: true,
                        method: 'listRel',
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: false,
                        columns: [{
                            title: '账号',
                            name: 'username'
                        }, {
                            title: '姓名',
                            name: 'name'
                        }, {
                            title: '联系电话',
                            name: 'mobilePhone'
                        }],
                        // recordTools: [{
                        //     label: '移除',
                        //     color: 'error'
                        // }],
                        datasource: (filter) => {
                            filter.systemId = this.selectedApp.id;
                            filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'OPERATER');
                            return ApplicationSystemStore.loadOperaters(filter);
                        }
                    },
                    cardToolbar: {
                        tools: [{
                            label: '关联功能卡片',
                            color: 'info',
                            icon: 'link',
                            operate: () => {
                                this.$refs.cardrelationmodal.open(this.cardsCache);
                            }
                        }]
                    },
                    cardTableOptions: {
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: true,
                        multiCheck: false,
                        sortable: true,
                        lazy: true,
                        method: 'listRel',
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: false,
                        columns: [{
                            title: '卡片名称',
                            name: 'view.viewLabel'
                        }, {
                            title: '描述',
                            name: 'view.description'
                        }, {
                            title: '有无配置',
                            name: 'relation.config',
                            align: 'center',
                            format(v) {
                                return v ? '<font color="#33d685">有</font>' : '<font>无</font>';
                            }
                        }],
                        recordTools: [{
                            label: '配置',
                            color: 'info',
                            icon: 'gear-a',
                            operate: (record) => {
                                this.$refs.cardconfigmodal.open(record.relation);
                            }
                        }, {
                            label: '移除',
                            color: 'error',
                            icon: 'trash-a',
                            confirm: '确认移除此卡片',
                            operate: (record) => {
                                ApplicationSystemStore.relationCards({
                                    systemId: this.selectedApp.id,
                                    viewIds: this.cardsCache.filter(item => item.id != record.view.id)
                                        .map(
                                            v => v.id).join(',')
                                }).then(res => {
                                    this.$refs.cardtable.refresh(1, true);
                                });
                            }
                        }],
                        datasource: (filter) => {
                            filter.pageNumber = 0;
                            filter.pageSize = 100;
                            filter.systemId = this.selectedApp.id;
                            return ApplicationSystemStore.getCardsOfSystem(filter).then(res => {
                                this.cardsCache = res.rows.map(c => c.view);
                                return res;
                            });
                        }
                    },
                    cardrelationOptions: {
                        title: '关联卡片',
                        width: 700,
                        checked: {
                            multi: true,
                            label: 'viewLabel'
                        },
                        tableOptions: {
                            columns: [{
                                title: '卡片名称',
                                name: 'viewLabel'
                            }, {
                                title: '描述',
                                name: 'description'
                            }],
                            showIndex: false,
                            pageSize: 10,
                            localPage: true,
                            multiCheck: false,
                            sortable: true,
                            format: {
                                list: '',
                                count: 'length',
                                pageSize: 'pageSize',
                                currentPage: 'pageNumber'
                            },
                            //表格工具栏
                            toolbar: [],
                            //表格搜索
                            filter: false,
                            //数据条目操作
                            recordTools: [],
                            datasource: (filter) => {
                                return FunctionCardStore.list(filter);
                            }
                        }
                    },
                    cardConfigOptions: {
                        title: '卡片配置',
                        width: 700,
                        formOptions: {
                            cols: 2,
                            fields: [{
                                label: '配置',
                                name: 'config',
                                monopolize: true,
                                widget: 'coder'
                            }],
                            tools: false,
                            submit: (data) => {
                                return ApplicationSystemStore.configCard(data).then(res => {
                                    this.$refs.cardtable.refresh(1, true);
                                });
                            }
                        }
                    }
                }
            }
        },
        methods: {
            init() {
                this.refreshapps();
            },
            refreshapps() {
                ApplicationSystemStore.all().then(res => {
                    this.apps = res;
                    if (!this.selectedApp) {
                        this.selectApp(res[0]);
                    }
                });
            },
            selectApp(app) {
                if (this.selectedApp != app) {
                    this.selectedApp = app;
                    this.$refs.table.refresh(1, true);
                    this.$refs.cardtable.refresh(1, true);
                }
            },
            refreshOperaters() {
                this.$refs.table.refresh(void 0, true);
            },
            relationCards(cards) {
                ApplicationSystemStore.relationCards({
                    systemId: this.selectedApp.id,
                    viewIds: cards.map(c => c.id).join(',')
                }).then(res => {
                    this.$refs.cardtable.refresh(1, true);
                    this.$refs.cardrelationmodal.cancel();
                });
            },
            modifySystem(app) {
                this.$refs.formmodal.open(app);
            }
        },
        ready() {
            this.init();
        }
    };
</script>