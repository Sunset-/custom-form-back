<template>
    <sunset-layout title="功能卡片管理">
        <sunset-crud v-ref:crud :options="options" @signal="operateCrudSignal">
            <div slot="CRUD_FORM">
                <sunset-form v-ref:cardform :options="options.formOptions" @signal="operateSignal"></sunset-form>
                <div v-if="currentConfigType">
                    <component v-ref:config :is="currentConfigType"></component>
                </div>
                <div style="text-align:center;margin-top:5px;">
                    <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
                </div>
            </div>
        </sunset-crud>
    </sunset-layout>
</template>
<script>
    import FunctionCardStore from './FunctionCardStore';
    import StandardForm from './config/StandardForm.vue';
    import Other from './config/Other.vue';

    var configs = {
        StandardForm,
        Other
    };

    export default {
        components: configs,
        methods: {
            operateSignal(signal, record) {
                this.$refs.crud.operateSignal(signal, record);
            },
            operateCrudSignal(signal, record) {
                if (signal == 'RESET_FORM') {
                    this.$refs.cardform.reset(record);
                    this.config = record && record.operation;
                    this.$nextTick(() => {
                        this.$refs.config && this.$refs.config.setConfig(this.config);
                    });
                }
            }
        },
        data() {
            return {
                currentConfigType: '',
                config: null,
                options: {
                    title: '功能卡片',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '卡片名称',
                            name: 'viewLabel'
                        }, {
                            title: '业务标识',
                            name: 'viewName'
                        }, {
                            title: '卡片类型',
                            name: 'viewType'
                        }, {
                            title: '创建时间',
                            format: 'DATETIME',
                            name: 'createDate',
                            align : 'center'
                        }, {
                            title: '更新时间',
                            format: 'DATETIME',
                            name: 'lastModifyDate',
                            align : 'center'
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: true,
                        multiCheck: false,
                        sortable: true,
                        lazy: false,
                        format: {
                            list: '',
                            count: 'length',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [{
                            label: '新增',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'FunctionCard_ADD'
                        }],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'FunctionCard_MODIFY'
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            signal: 'DELETE',
                            permission: 'FunctionCard_DELETE'
                        }],
                        store: FunctionCardStore
                    },
                    store: FunctionCardStore,
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: FunctionCardStore,
                        fields: [{
                            group: '卡片基本信息',
                            label: '卡片名称',
                            name: 'viewLabel',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '业务标识',
                            name: 'viewName',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '卡片类型',
                            name: 'viewType',
                            widget: 'select',
                            enum : 'FUNCTION_CARD_TYPE',
                            onChange: (v) => {
                                if (configs[v]) {
                                    this.currentConfigType = v;
                                    this.$nextTick(() => {
                                        this.$refs.config && this.$refs.config.setConfig(this.config);
                                    });
                                } else {
                                    this.currentConfigType = null;
                                }
                            },
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '备注',
                            name: 'description',
                            widget: 'textarea',
                            newline: true,
                            monopolize: true,
                            validate: {
                                maxlength: 300
                            }
                        }],
                        format: (model) => {
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: false
                    }
                },
                toolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '保存',
                        color: 'success',
                        operate: () => {
                            Promise.all([this.$refs.cardform.generateModel(),
                                this.$refs.config&&this.$refs.config.getConfig()
                            ]).then((result) => {
                                var card = result[0];
                                card.operation = result[1];
                                return card;
                            }).then(card => {
                                FunctionCardStore.save(card).then(res => {
                                    this.operateSignal('SAVED');
                                });
                            });
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.operateSignal('CANCEL');
                        }
                    }]
                }
            }
        }
    };
</script>