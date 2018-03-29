<template>
    <sunset-layout title="管理账户">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
    <sunset-table-modal @submit="tableSelected" v-ref:tablemodal :options="options.tableModalOptions"></sunset-table-modal>
</template>
<script>
    import AccountStore from './AccountStore.js';
    import PermissionStore from '../permission/PermissionStore';

    const now = new Date().getTime();

    var obj = {
        admin: 'HOLDER'
    };

    var s = 'function fn(v){return v+"---"+Base.ENUM_MAP.ROLE_TYPE.SYSTEM}';

    export default {
        data() {
            return {
                currentAccount: null,
                options: {
                    title: '管理账户',
                    store: AccountStore,
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '登录名',
                            name: 'account'
                        }, {
                            title: '昵称',
                            name: 'nickname'
                        }],
                        showIndex: true,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        lazy: false,
                        format: {
                            list: 'rows',
                            count: 'count',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [{
                            label: '新增',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'Account_ADD'
                        }],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        recordTools: [{
                            label: '角色',
                            icon: 'ios-body',
                            color: 'info',
                            operate: (record) => {
                                this.currentAccount = record;
                                PermissionStore.rolesOfAccount(record.id).then(res => {
                                    this.$refs.tablemodal.open(res);
                                });
                            },
                            permission: 'Account_ROLE'
                        }, {
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'Account_MODIFY'
                        }, {
                            label: '重置密码',
                            icon: 'refresh',
                            color: 'info',
                            confirm: '确认重置密码？',
                            operate: (record) => {
                                AccountStore.resetPassword({
                                    id: record.id
                                }).then(res => {
                                    Sunset.tip('重置成功', 'success');
                                });
                            },
                            permission: 'Account_RESET_PASSWORD'
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            signal: 'DELETE',
                            permission: 'Account_DELETE'
                        }],
                        store: AccountStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: AccountStore,
                        fields: [{
                            label: '登录名',
                            name: 'account',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '密码',
                            name: 'password',
                            widget: 'input',
                            premise(model) {
                                return !model.id;
                            },
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '昵称',
                            name: 'nickname',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }],
                        format: (model) => {
                            model.type = 1;
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: null
                    },
                    tableModalOptions: {
                        title: '角色分配',
                        checked: {
                            multi: true,
                            max: 999,
                            label: 'name'
                        },
                        tableOptions: {
                            columns: [{
                                title: '角色名称',
                                name: 'name'
                            }, {
                                title: '类型',
                                name: 'type',
                                enum: 'ROLE_TYPE'
                            }],
                            showIndex: true,
                            pageSize: 10,
                            localPage: true,
                            multiCheck: true,
                            sortable: true,
                            lazy: true,
                            format: {
                                list: '',
                                count: 'length',
                                pageSize: 'pageSize',
                                currentPage: 'pageNumber'
                            },
                            //表格工具栏
                            toolbar: false,
                            //表格搜索
                            filter: false,
                            //数据条目操作
                            recordTools: false,
                            datasource: () => {
                                return PermissionStore.all();
                            }
                        }
                    }
                }
            }
        },
        methods: {
            tableSelected(data) {
                let roleIds = data && data.map(item => item.id).join(',');
                PermissionStore.authRoleToAccount({
                    accountId: this.currentAccount.id,
                    roleIds: roleIds
                }).then(res => {
                    this.$refs.tablemodal.cancel();
                });
            }
        }
    };
</script>