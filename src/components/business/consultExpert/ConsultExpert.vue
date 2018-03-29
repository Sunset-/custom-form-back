<template>
    <sunset-layout title="咨询专家管理">
        <sunset-crud v-ref:crud :options="options"></sunset-crud>
    </sunset-layout>
</template>
<script>
    import ConsultExpertStore from './ConsultExpertStore.js';
    import HospitalStore from '../hospital/HospitalStore';
    import DoctorStore from '../doctor/DoctorStore.js';

    const now = new Date().getTime();

    export default {
        methods: {

        },
        data() {
            return {
                currentModel: null,
                options: {
                    title: '医生',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '头像',
                            name: 'picture',
                            format(v) {
                                return `<img style="width:50px;height:50px;" src="${Base.transformNfsFilePath(v)}" onerror="this.src='${Base.defaultImage('DOCTOR')}'" />`
                            },
                            style: {
                                width: '80px',
                                'text-align': 'center'
                            }
                        }, {
                            title: '姓名',
                            name: 'name'
                        }, {
                            title: '职称',
                            name: 'rank',
                            format: (v, record) => {
                                var ranks = [];
                                if (record.rankAdmin) {
                                    ranks.push(Sunset.Service.Dictionary.transcode('DUTY', record.rankAdmin));
                                }
                                if (record.rank) {
                                    ranks.push(Sunset.Service.Dictionary.transcode('HOSPITAL_DUTY', record.rank));
                                }
                                if (record.rankEdu) {
                                    ranks.push(Sunset.Service.Dictionary.transcode('EDUCATIONAL_TITLE',
                                        record.rankEdu));
                                }
                                return ranks.join('、');
                            }
                        }, {
                            title: '就职医院',
                            name: 'hospitalName'
                        }, {
                            title: '科室',
                            name: 'office'
                        }, {
                            title: '创建时间',
                            format: 'DATETIME',
                            name: 'createTime'
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
                            label: '新增',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'ConsultExpert_ADD'
                        }],
                        //表格搜索
                        filter: {
                            align: 'right',
                            fields: [{
                                label: '姓名',
                                name: 'keyword',
                                widget: 'search',
                                placeholder: '请输入医生姓名'
                            }]
                        },
                        //数据条目操作
                        recordToolsWidth: '120',
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            operate: (record) => {
                                ConsultExpertStore.getById(record.id).then(res => {
                                    this.$refs.crud.operateSignal('MODIFY', res);
                                })
                            },
                            permission: 'ConsultExpert_MODIFY'
                        }, {
                            type: 'switch',
                            default (record) {
                                return record.status;
                            },
                            operate: (record, flag) => {
                                return ConsultExpertStore.switchShow({
                                    id: record.id,
                                    onOff: flag
                                }).then(res => {
                                    Sunset.tip('修改成功', 'success');
                                });
                            },
                            permission: 'ConsultExpert_SWITCH'
                        }],
                        store: ConsultExpertStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: ConsultExpertStore,
                        fields: [{
                            label: '医生',
                            name: 'expertId',
                            widget: 'tableselect',
                            transcode: (v) => {
                                return this.currentModel && this.currentModel.name || '';
                            },
                            modalOptions: {
                                title: '选择医生',
                                checked: {
                                    multi: false,
                                    label: 'title'
                                },
                                hideFooter: true,
                                tableOptions: {
                                    columns: [{
                                        title: '姓名',
                                        name: 'name'
                                    }, {
                                        title: '职称',
                                        name: 'rank',
                                        format: (v, record) => {
                                            var ranks = [];
                                            if (record.rankAdmin) {
                                                ranks.push(Sunset.Service.Dictionary.transcode(
                                                    'DUTY', record.rankAdmin));
                                            }
                                            if (record.rank) {
                                                ranks.push(Sunset.Service.Dictionary.transcode(
                                                    'HOSPITAL_DUTY', record.rank));
                                            }
                                            if (record.rankEdu) {
                                                ranks.push(Sunset.Service.Dictionary.transcode(
                                                    'EDUCATIONAL_TITLE',
                                                    record.rankEdu));
                                            }
                                            return ranks.join('、');
                                        }
                                    }, {
                                        title: '就职医院',
                                        name: 'org',
                                        format(v) {
                                            return Base.HOSPITAL_MAP[v] && Base.HOSPITAL_MAP[v].title ||
                                                v;
                                        }
                                    }, {
                                        title: '联系电话',
                                        name: 'phone'
                                    }],
                                    showIndex: false,
                                    pageNumberStart: 0,
                                    pageSize: 5,
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
                                        label: '新增',
                                        icon: 'plus-round',
                                        color: 'success',
                                        signal: 'ADD',
                                        permission: 'Doctor_ADD'
                                    }],
                                    //表格搜索
                                    filter: {
                                        align: 'right',
                                        fields: [{
                                            label: '姓名',
                                            name: 'like',
                                            widget: 'search',
                                            placeholder: '请输入医生姓名'
                                        }]
                                    },
                                    //数据条目操作
                                    recordTools: [],
                                    store: DoctorStore
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '就职医院',
                            name: 'hospitalName',
                            widget: 'tableselect',
                            idKey: 'title',
                            nameKey: 'title',
                            transcode(v) {
                                return [v];
                            },
                            modalOptions: {
                                title: '就职医院',
                                checked: {
                                    multi: false,
                                    label: 'title'
                                },
                                hideFooter: true,
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
                                    format: {
                                        list: 'data',
                                        count: 'totalCount',
                                        pageSize: 'pageSize',
                                        currentPage: 'pageNumber'
                                    },
                                    //表格工具栏
                                    toolbar: [],
                                    //表格搜索
                                    filter: {
                                        align: 'left',
                                        fields: [{
                                            label: '医院名称',
                                            name: 'like',
                                            widget: 'search',
                                            placeholder: '请输入医院名称'
                                        }]
                                    },
                                    //数据条目操作
                                    recordTools: false,
                                    store: HospitalStore
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '科室',
                            name: 'office',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '职称',
                            name: 'rank',
                            widget: 'select',
                            data: Sunset.Service.Dictionary.getEnums('HOSPITAL_DUTY').map(item => ({
                                text: item.value,
                                value: item.value
                            }))
                        }, {
                            label: '头像',
                            name: 'picture',
                            widget: 'image',
                            monopolize: true,
                            url: '/upload/api/1.0.0/file/storage',
                            max: 1,
                            thumbnail(result) {
                                if (result) {
                                    return Base.transformNfsFilePath(result);
                                }
                            }
                        }, {
                            label: '价格',
                            name: 'consultFee',
                            widget: 'number',
                            prepend: '&yen;',
                            digits: 2,
                            append: '元',
                            monopolize: true
                        }, {
                            label: '标签',
                            name: 'expertLabel',
                            widget: 'input',
                            placeholder: '专家描述关键字,英文逗号分隔',
                            monopolize: true
                        }, {
                            label: '擅长',
                            name: 'skilledField',
                            monopolize: true,
                            widget: 'textarea'
                        }, {
                            label: '介绍',
                            name: 'introduction',
                            monopolize: true,
                            widget: 'editor'
                        }],
                        cast: (model) => {
                            this.currentModel = model;
                            if (model.relations && model.relations.length) {
                                model.consultFee = Sunset.Numbers.fixed(model.relations[0].consultFee / 100.0, 2);
                            }
                            return model;
                        },
                        format: (model) => {
                            return {
                                consultExpert: JSON.stringify({
                                    id: model.id,
                                    expertId: model.expertId,
                                    picture: model.picture,
                                    office: model.office,
                                    rank: model.rank,
                                    skilledField: model.skilledField,
                                    introduction: model.introduction,
                                    hospitalName: model.hospitalName,
                                    expertLabel: model.expertLabel
                                }),
                                relations: JSON.stringify([{
                                    consultFee: Sunset.Numbers.fixed(model.consultFee * 100, 0)
                                }])
                            };
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