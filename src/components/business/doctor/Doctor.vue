<template>
    <sunset-layout title="医生管理">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
</template>
<script>
    import DoctorStore from './DoctorStore';
    import HospitalStore from '../hospital/HospitalStore';

    const now = new Date().getTime();

    export default {
        methods: {

        },
        data() {
            return {
                options: {
                    title: '医生',
                    //表格
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
                            name: 'org',
                            format(v) {
                                return Base.HOSPITAL_MAP[v] && Base.HOSPITAL_MAP[v].title || v;
                            }
                        }, {
                            title: '联系电话',
                            name: 'phone'
                        }, {
                            title: '创建时间',
                            format: 'DATETIME',
                            name: 'createDate'
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
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'Doctor_MODIFY'
                        }],
                        store: DoctorStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: DoctorStore,
                        fields: [{
                            group: '账号信息',
                            label: '用户名',
                            name: 'acc',
                            widget: 'input',
                            premise(record) {
                                return !record.id;
                            },
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '密码',
                            name: 'pwd',
                            widget: 'input',
                            premise(record) {
                                return !record.id;
                            },
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            group: '医生信息',
                            label: '姓名',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '性别',
                            name: 'sex',
                            widget: 'radio',
                            enum: 'SEX',
                            dataType: String,
                            defaultFirst: true
                        }, {
                            label: '就职医院',
                            name: 'org',
                            widget: 'tableselect',
                            nameKey: 'title',
                            transcode(v) {
                                return [Base.HOSPITAL_MAP[v[0]] && Base.HOSPITAL_MAP[v[0]].title];
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
                            label: '职务',
                            name: 'rank',
                            widget: 'select',
                            enum: 'HOSPITAL_DUTY'
                        }, {
                            label: '教育职称',
                            name: 'rankEdu',
                            widget: 'select',
                            enum: 'EDUCATIONAL_TITLE'
                        }, {
                            label: '学历',
                            name: 'rankAcademic',
                            widget: 'select',
                            enum: 'EDUCATION'
                        }, {
                            label: '医院职务',
                            name: 'rankAdmin',
                            widget: 'select',
                            enum: 'DUTY'
                        }, {
                            label: '头像',
                            name: 'headPicture',
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
                            label: '证件拍照',
                            name: 'authPic',
                            widget: 'image',
                            monopolize: true,
                            url: '/upload/api/1.0.0/file/storage',
                            thumbnail(result) {
                                if (result) {
                                    return Base.transformNfsFilePath(result);
                                }
                            }
                        }, {
                            label: '简介',
                            name: 'intr',
                            widget: 'textarea',
                            monopolize: true
                        }],
                        format: (model) => {
                            model.phone = model.acc;
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