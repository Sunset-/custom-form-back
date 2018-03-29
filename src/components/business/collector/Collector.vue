<template>
    <sunset-layout title="采集器管理">
        <sunset-crud v-ref:crud :options="options" @signal="operateCrudSignal">
            <div slot="CRUD_FORM">
                <sunset-form v-ref:cardform :options="options.formOptions" @signal="operateSignal"></sunset-form>
                <div style="text-align:center;margin-top:5px;">
                    <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
                </div>
            </div>
        </sunset-crud>
    </sunset-layout>
</template>
<script>
    import CollectorStore from './CollectorStore';

    export default {
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
                    title: '采集器',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '站点名称',
                            name: 'workstation'
                        }, {
                            title: '所在医院',
                            name: 'hospitals',
                            format(hospitals) {
                                return hospitals && hospitals.map(item => item.key).join(',') || '';
                            }
                        }, {
                            title: '设备类型',
                            name: 'deviceTypes',
                            format(deviceTypes) {
                                return deviceTypes && deviceTypes.join(',') || '';
                            }
                        }, {
                            title: '创建时间',
                            format: 'DATETIME',
                            name: 'createDate',
                            align: 'center'
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: true,
                        multiCheck: false,
                        sortable: true,
                        lazy: false,
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [{
                            label: '新增',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'Collector_ADD'
                        }],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'Collector_MODIFY'
                        }],
                        store: CollectorStore
                    },
                    store: CollectorStore,
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: CollectorStore,
                        fields: [{
                            group: '基本信息',
                            label: '站点名称',
                            name: 'workstation',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '配置',
                            name: 'config',
                            widget: 'coder',
                            newline: true,
                            monopolize: true,
                            style: 'height:300px',
                            validate: {
                                required: true
                            }
                        }],
                        cast(record){
                            var model = {};
                            model.workstation = record.workstation;
                            delete record.workstation;
                            model.config = JSON.stringify(record);
                            return model;
                        },
                        format: (model) => {
                            var config = {};
                            try {
                                config = eval('(' + model.config + ')');
                                config.workstation = model.workstation;
                            } catch (e) {
                                console.error(e);
                            }
                            return config;
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
                                this.$refs.config && this.$refs.config.getConfig()
                            ]).then((result) => {
                                var card = result[0];
                                card.operation = result[1];
                                return card;
                            }).then(card => {
                                CollectorStore.save(card).then(res => {
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