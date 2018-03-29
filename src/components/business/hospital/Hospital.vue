<template>
    <sunset-layout title="医院管理">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
</template>
<script>
    import HospitalStore from './HospitalStore';
    import RegionData from './Region.js';

    function generateCascaderData(list) {
        return (list || RegionData).map(item => {
            var children;
            if (item.sub) {
                children = generateCascaderData(item.sub);
            }
            return {
                label: item.name,
                value: item.name,
                children: children
            };
        })
    }

    export default {
        methods: {

        },
        data() {
            return {
                options: {
                    title: '医院',
                    store: HospitalStore,
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '医院名称',
                            name: 'title'
                        }, {
                            title: '类型',
                            name: 'type',
                            enum: 'HOSPITAL_TYPE'
                        }, {
                            title: '级别',
                            name: 'level',
                            enum: 'HOSPITAL_LEVEL'
                        }, {
                            title: '地址',
                            name: 'addr',
                            format(v, record) {
                                return `${record.addrProvince}-${record.addrCity?'-'+record.addrCity:''}${record.addrDistrict?'-'+record.addrDistrict:''}-${v}`;
                            }
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        lazy: true,
                        format: {
                            list: 'data',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [{
                            label: '新增医院',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'Hospital_ADD'
                        }],
                        //表格搜索
                        filter: {
                            align: 'right',
                            fields: [{
                                label: '医院名称',
                                name: 'like',
                                widget: 'search',
                                placeholder: '请输入医院名称'
                            }]
                        },
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'Hospital_MODIFY'
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            signal: 'DELETE',
                            permission: 'Hospital_DELETE'
                        }],
                        store: HospitalStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: HospitalStore,
                        fields: [{
                            label: '医院名称',
                            name: 'title',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '医院类型',
                            name: 'type',
                            widget: 'radio',
                            enum: 'HOSPITAL_TYPE',
                            defaultFirst: true
                        }, {
                            label: '医院级别',
                            name: 'level',
                            widget: 'select',
                            enum: 'HOSPITAL_LEVEL',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '所在地',
                            name: 'region',
                            widget: 'cascader',
                            default: '',
                            data: () => {
                                return generateCascaderData();
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '详细地址',
                            name: 'addr',
                            widget: 'textarea',
                            monopolize: true,
                            validate: {
                                required: true
                            }
                        }],
                        format: (model) => {
                            var region = (model.region || '').split(',');
                            model.addrProvince = region[0] || '';
                            model.addrCity = region[1] || '';
                            model.addrDistrict = region[2] || '';
                            delete model.region;
                            return {
                                record: JSON.stringify(model)
                            };
                        },
                        cast(model) {
                            if (!model.region) {
                                var region = [];
                                model.addrProvince && region.push(model.addrProvince);
                                model.addrCity && region.push(model.addrCity);
                                model.addrDistrict && region.push(model.addrDistrict);
                                model.region = region.join(',');
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