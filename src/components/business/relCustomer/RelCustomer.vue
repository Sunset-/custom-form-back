<template>
    <sunset-layout title="用户关联站点">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
    <sunset-table-modal @submit="tableSelected" v-ref:tablemodal :options="options.tableModalOptions"></sunset-table-modal>
</template>
<script>
    import RelCustomerStore from './RelCustomerStore.js';
    import CustomerStore from '../customer/CustomerStore';

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
                    store: RelCustomerStore,
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
                            label: '关联站点',
                            icon: 'ios-body',
                            color: 'info',
                            operate: (record) => {
                                this.currentAccount = record;
                                CustomerStore.relationAll({
                                    "pageNumber": 0,
                                    "pageSize": 1000
                                }, record.id).then(data => {
                                    this.$refs.tablemodal.open(data || []);
                                });
                            },
                            permission: 'RelCustomer_REL_CUSTOMER'
                        }],
                        store: RelCustomerStore
                    },
                    //表格表单
                    formOptions: {},
                    tableModalOptions: {
                        title: '角色分配',
                        width: 800,
                        checked: {
                            multi: true,
                            max: 999,
                            label: 'designation'
                        },
                        tableOptions: {
                            columns: [{
                                title: '站点名称',
                                name: 'designation'
                            }, {
                                title: '所属医院',
                                name: 'hospital',
                                format(v) {
                                    return Base.HOSPITAL_MAP[v] && Base.HOSPITAL_MAP[v].title || v;
                                }
                            }, {
                                title: '联系人',
                                name: 'contactPerson'
                            }, {
                                title: '联系电话',
                                name: 'telephone'
                            }, {
                                title: '创建时间',
                                name: 'createDate',
                                format: 'DATE'
                            }],
                            showIndex: false,
                            pageSize: 10,
                            localPage: false,
                            multiCheck: true,
                            sortable: true,
                            lazy: true,
                            pageNumberStart: 0,
                            format: {
                                list: 'data',
                                count: 'totalCount',
                                pageSize: 'pageSize',
                                currentPage: 'pageNumber'
                            },
                            //表格工具栏
                            toolbar: false,
                            //表格搜索
                            filter: false,
                            //数据条目操作
                            recordTools: false,
                            store: CustomerStore
                        }
                    }
                }
            }
        },
        methods: {
            tableSelected(data) {
                let ids = data && data.map(item => item.id).join(',');
                RelCustomerStore.save({
                    userId: this.currentAccount.id,
                    relationCustomer: ids
                }).then(res => {
                    Sunset.tip('关联成功', 'success');
                    this.$refs.tablemodal.cancel();
                });
            }
        }
    };
</script>