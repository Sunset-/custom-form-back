<template>
    <sunset-layout title="Dicom影像库管理">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
</template>
<script>
    import DicomImageStore from './DicomImageStore';

    const now = new Date().getTime();

    export default {
        methods: {

        },
        data() {
            return {
                options: {
                    title: 'Dicom影像库',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '标题',
                            name: 'title'
                        }, {
                            title: '备注说明',
                            name: 'remark'
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
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
                        store: DicomImageStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: DicomImageStore,
                        fields: [{
                            label: '标题',
                            name: 'title',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '影像',
                            name: 'studies',
                            widget: 'dicom',
                            monopolize: true,
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '备注',
                            name: 'remark',
                            widget: 'textarea',
                            monopolize: true,
                            validate: {
                                required: true
                            }
                        }],
                        format: (model) => {
                            model.addrProvince = model.region[0];
                            model.addrCity = model.region[1];
                            model.addrDistrict = model.region[2];
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
                                model.region = region;
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