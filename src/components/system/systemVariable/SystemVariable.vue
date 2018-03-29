<template>
    <sunset-layout title="系统变量">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
</template>
<script>
    import SystemVariableStore from './SystemVariableStore.js';

    const now = new Date().getTime();

    export default {
        methods: {

        },
        data() {
            return {
                options: {
                    title: '系统变量',
                    store: SystemVariableStore,
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '变量名',
                            name: 'name',
                            style: {
                                'white-space': 'nowrap'
                            }
                        }, {
                            title: '变量值',
                            name: 'value'
                        }, {
                            title: '备注',
                            name: 'desc',
                            style: {
                                'min-width': '150px'
                            }
                        }],
                        showIndex: true,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        lazy: true,
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
                            permission: 'SYSTEM_MANAGER_DICTIONARY_ADD',
                            signal: 'ADD',
                            permission: 'SystemVariable_ADD'
                        }],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            permission: 'SYSTEM_MANAGER_DICTIONARY_UPDATE',
                            signal: 'MODIFY',
                            permission: 'SystemVariable_MODIFY'
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            permission: 'SYSTEM_MANAGER_DICTIONARY_DELETE',
                            signal: 'DELETE',
                            permission: 'SystemVariable_DELETE'
                        }],
                        store: SystemVariableStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: SystemVariableStore,
                        fields: [{
                            label: '变量名',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '类型',
                            name: 'type',
                            widget: 'select',
                            dataType: String,
                            data: [{
                                text: '文本',
                                value: '1'
                            }, {
                                text: 'HTML',
                                value: '2'
                            }]
                        }, {
                            label: '变量值',
                            name: 'value',
                            widget: 'textarea',
                            autosize: true,
                            monopolize: true,
                            premise(model) {
                                return model.type != '2';
                            },
                            validate: {
                                required: true,
                                maxlength: 1000
                            }
                        }, {
                            label: '变量值',
                            name: 'html',
                            widget: 'editor',
                            monopolize: true,
                            premise(model) {
                                return model.type == '2';
                            },
                            validate: {
                                required: true,
                                maxlength: 1000
                            }
                        }, {
                            label: '备注',
                            name: 'desc',
                            widget: 'textarea',
                            autosize: true,
                            monopolize: true,
                            validate: {
                                required: false,
                                maxlength: 200
                            }
                        }],
                        cast(model) {
                            if (model.type == '2') {
                                model.html = model.value;
                            }
                            return model;
                        },
                        format: (model) => {
                            if (model.type == '2') {
                                model.value = model.html;
                            }
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: null
                    }
                }
            }
        }
    };
</script>