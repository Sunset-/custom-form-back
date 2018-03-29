<template>
    <sunset-layout title="每日一例管理">
        <sunset-crud :options="options"></sunset-crud>
        <sunset-view-modal v-ref:viewmodal :options="shareModal">
            <dailycase-share v-ref:sharedetail :record="shareRecord"></dailycase-share>
        </sunset-view-modal>
    </sunset-layout>
</template>
<script>
    import DailycaseStore from './DailycaseStore';
    import DoctorStore from '../doctor/DoctorStore';
    import DailycaseShare from './DailycaseShare.vue';

    export default {
        components: {
            DailycaseShare
        },
        methods: {

        },
        data() {
            return {
                currentRecord: null,
                shareModal: {
                    title: 'title'
                },
                options: {
                    title: '每日一例',
                    store: DailycaseStore,
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '标题',
                            name: 'title'
                        }, {
                            title: '概要',
                            name: 'summary'
                        }, {
                            title: '创建时间',
                            name: 'createDate',
                            format: 'DATETIME',
                            style: {
                                'white-space': 'nowrap'
                            }
                        }, {
                            title: '状态',
                            name: 'isPublish',
                            style: {
                                'white-space': 'nowrap',
                                'text-align': 'center'
                            },
                            format(v, record) {
                                return `<span class="${v?'text-success':'text-disabled'}">${v?'已发布':'未发布'}</span>`;
                            }
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        lazy: false,
                        format: {
                            list: 'data',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [{
                            label: '新增每日一例',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'Dailycase_ADD'
                        }],
                        //表格搜索
                        filter: {
                            align: 'right',
                            fields: [{
                                label: '名称',
                                name: 'like',
                                widget: 'search',
                                placeholder: '请输入名称'
                            }]
                        },
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'Dailycase_MODIFY'
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            signal: 'DELETE',
                            permission: 'Dailycase_DELETE'
                        }, {
                            label: '分享',
                            icon: 'trash-a',
                            color: 'info',
                            operate: (record) => {
                                this.$refs.sharedetail.reset(record);
                                this.shareModal.title = `【分享影像】${record.title}`;
                                this.$refs.viewmodal.open();
                            }
                        }],
                        store: DailycaseStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: DailycaseStore,
                        fields: [{
                            label: '标题',
                            name: 'title',
                            widget: 'input',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '分类',
                            name: 'category',
                            widget: 'select',
                            enum: 'DAILYCASE_CATEGORY',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '系统分类',
                            name: 'medicalBodyCategory',
                            widget: 'select',
                            enum: 'DAILYCASE_BODY_SYSTEM',
                            dataType: String
                        }, {
                            label: '疾病分类',
                            name: 'diseaseVariety',
                            widget: 'select',
                            enum: 'DAILYCASE_DISEASE',
                            dataType: String
                        }, {
                            label: '选择医生',
                            name: 'providerId',
                            widget: 'tableselect',
                            nameKey: 'name',
                            transcode: (v) => {
                                return [this.currentRecord.provider];
                            },
                            modalOptions: {
                                title: '选择医生',
                                checked: {
                                    multi: false,
                                    label: 'name'
                                },
                                width: 800,
                                hideFooter: true,
                                tableOptions: {
                                    columns: [{
                                        title: '姓名',
                                        name: 'name'
                                    }, {
                                        title: '职称',
                                        name: 'rank',
                                        enum: 'HOSPITAL_DUTY'
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
                                    showIndex: true,
                                    pageNumberStart: 0,
                                    pageSize: 8,
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
                                            label: '医生名称',
                                            name: 'like',
                                            widget: 'search',
                                            placeholder: '请输入医生名称'
                                        }]
                                    },
                                    //数据条目操作
                                    recordTools: false,
                                    store: {
                                        list(filter) {
                                            return DoctorStore.list(filter).then(res => {
                                                res && res.data && res.data.forEach(item => {
                                                    item.id = `${item.id}_${item.name}`;
                                                })
                                                return res;
                                            })
                                        }
                                    }
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '是否发布',
                            name: 'isPublish',
                            widget: 'switch'
                        }, {
                            label: '展示结果',
                            name: 'optionalShowType',
                            widget: 'select',
                            enum: 'DAILYCASE_RESULT_PREMISE',
                            dataType: String,
                            validate: {
                                required: true
                            }
                        }, {
                            label: '展示时间',
                            name: 'timerDate',
                            widget: 'date',
                            type: 'datetime',
                            premise(model) {
                                return model.optionalShowType == '3';
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '评论数',
                            name: 'commentNum',
                            widget: 'number',
                            digits: '0',
                            premise(model) {
                                return model.optionalShowType == '4';
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '关键词',
                            name: 'keywords',
                            widget: 'input',
                            monopolize: true,
                            validate: {
                                required: true,
                                maxlength: 100
                            }
                        }, {
                            label: '概要',
                            name: 'summary',
                            widget: 'textarea',
                            monopolize: true,
                            validate: {
                                required: true,
                                maxlength: 150
                            }
                        }, {
                            label: '影像文件',
                            name: 'imageInfo',
                            widget: 'dicom',
                            monopolize: true
                        }, {
                            label: '图片附件',
                            name: 'staticImgs',
                            widget: 'file',
                            url: '/upload/api/1.0.0/file/storage',
                            thumbnail(result) {
                                if (result) {
                                    return Base.transformNfsFilePath(result);
                                }
                            },
                            monopolize: true
                        }, {
                            label: '内容',
                            name: 'content',
                            widget: 'editor',
                            monopolize: true,
                            validate: {
                                required: true
                            }
                        }, {
                            label: '诊断结果',
                            name: 'optionalContent',
                            widget: 'editor',
                            monopolize: true,
                            validate: {
                                required: true
                            }
                        }],
                        format: (model) => {
                            delete model.__sunset_col_texts;
                            if (model.imageInfo) {
                                var imageInfo = JSON.parse(model.imageInfo);
                                model.imageId = imageInfo[0].id;
                            }
                            if (model.providerId) {
                                var pdr = model.providerId.split('_');
                                model.providerId = pdr[0];
                                model.provider = pdr[1];
                            }
                            if (Sunset.isDate(model.timerDate)) {
                                model.timerDate = model.timerDate.getTime();
                            }
                            return model;
                        },
                        cast: (model) => {
                            this.currentRecord = model;
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