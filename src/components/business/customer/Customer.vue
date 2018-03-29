<style lang="sass">
    @import '../../style/index.scss';
    .customers-wrap {
        margin-top: 10px;
        .customer-item {
            position: relative;
            background: #f5f7f9;
            padding: 10px;
            border: 1px solid #d7dde4;
            cursor: pointer;
            margin-bottom: 8px;
            border-radius: 2px;
            &.active {
                border: 1px solid $success;
            }
        }
    }
</style>
<template>
    <sunset-layout title="站点管理" type="leftside-content">
        <div slot="leftside">
            <div class="title">
                站点列表
                <div v-permission="'Customer_ADD'" style="float:right;">
                    <i-button size="small" type="success" icon="plus-round" @click="editCustomer">新增站点</i-button>
                </div>
            </div>
            <sunset-filter :options="customerFilter" @filter="refreshCustomers(1)"></sunset-filter>
            <div class="customers-wrap">
                <div v-for="c in customers" :class="['customer-item',selectedCustomer==c?'active':'']" @click="select(c)">
                    {{c.designation}}
                    <Icon type="settings" size="18" color="#3399ff" style="float:right;" @click="editCustomer(c)"></Icon>
                </div>
                <sunset-page @change="refreshCustomers" right="true" :simple="true" :page-number.sync="customerFilterParams.pageNumber" :show-total="true"
                    :page-size="customerFilterParams.pageSize" :total.sync="customerCount"></sunset-page>
            </div>
            <!-- 站点模态表单 -->
            <sunset-form-modal v-ref:formmodal :options="customerFormModal" @saved="refreshCustomers"></sunset-form-modal>
            <!-- 关联关系模态表单 -->
            <sunset-form-modal v-ref:relmodal :options="relFormModal" @saved="refreshRels"></sunset-form-modal>
        </div>
        <!-- 关联关系列表 -->
        <div slot="content">
            <sunset-toolbar :options="relToolbar"></sunset-toolbar>
            <Tabs active-key="in" :animated="false">
                <Tab-pane label="院内" key="in">
                    <sunset-table v-ref:relintable :options="relInTableOptions"></sunset-table>
                </Tab-pane>
                <Tab-pane label="院外" key="out">
                    <sunset-table v-ref:relouttable :options="relOutTableOptions"></sunset-table>
                </Tab-pane>
            </Tabs>
        </div>
    </sunset-layout>
</template>
<script>
    import CustomerStore from './CustomerStore';
    import HospitalStore from '../hospital/HospitalStore';
    import DoctorStore from '../doctor/DoctorStore';
    import TeamStore from '../team/TeamStore';

    const REL_IN_HOSPITAL = '0';
    const REL_OUT_HOSPITAL = '1';
    const REL_OUT_HOSPITAL_TEAM = '2';
    const IMAGE_DOCTOR = '1'; //影像医生
    const REL_OUTSIDE = '1'; //院外关系
    const REL_INSIDE = '2'; //院内关系
    const WRITE_AND_REVIEW = '3'; //书写并审核报告

    export default {
        methods: {

        },
        data() {
            return {
                selectedCustomer: null,
                customers: [],
                customerCount: 0,
                customerFilterParams: {
                    pageNumber: 1,
                    pageSize: 10,
                    like: ''
                },
                customerFilter: {
                    left: false,
                    fields: [{
                        label: '搜索',
                        name: 'keyword',
                        widget: 'search',
                        style: {
                            width: '100%'
                        },
                        placeholder: '输入站点名称搜索'
                    }],
                    format: (filter) => {
                        this.customerFilterParams.like = filter.keyword;
                    }
                },
                customerFormModal: {
                    title: '站点信息维护',
                    formOptions: {
                        cols: 2,
                        store: CustomerStore,
                        fields: [{
                            label: '站点ID',
                            name: 'id',
                            widget: 'input',
                            readonly: true,
                            monopolize: true,
                            premise(model) {
                                return model.id;
                            }
                        }, {
                            label: '所在医院',
                            name: 'hospital',
                            widget: 'tableselect',
                            monopolize: true,
                            nameKey: 'title',
                            transcode(v) {
                                return (v || []).map(key => (Base.HOSPITAL_MAP[v] && Base.HOSPITAL_MAP[v].title ||
                                    v)).join(',');
                            },
                            modalOptions: {
                                title: '站点所在医院',
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
                            label: '站点名称',
                            name: 'designation',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '联系人',
                            name: 'contactPerson',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '联系电话',
                            name: 'telephone',
                            widget: 'input',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '是否临床看片',
                            name: 'isAllowClinicDoctor',
                            widget: 'switch'
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
                relToolbar: [{
                    label: '设置关联医生',
                    icon: 'network',
                    color: 'info',
                    permission: 'Customer_ADDREL',
                    operate: () => {
                        if (!this.selectedCustomer) {
                            Sunset.tip('请选择一个站点');
                            return;
                        }
                        this.$refs.relmodal.open({
                            customerId: this.selectedCustomer.id,
                            relationJobType: '1',
                            relationType: REL_INSIDE,
                            expertType: REL_OUT_HOSPITAL,
                            reportService: WRITE_AND_REVIEW
                        });
                    }
                }],
                relInTableOptions: {
                    columns: [{
                        title: '医生姓名',
                        name: 'name'
                    }, {
                        title: '角色',
                        name: 'relationJobType',
                        enum: 'HOSPITAL_DOCTOR_TYPE'
                    }, {
                        title: '影像权限',
                        name: 'imagePermissions'
                    }, {
                        title: '联系电话',
                        name: 'connectPhone'
                    }],
                    showIndex: true,
                    pageNumberStart: 0,
                    pageSize: 10,
                    localPage: true,
                    multiCheck: false,
                    sortable: true,
                    lazy: true,
                    method: 'listRel',
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    filter: false,
                    //数据条目操作
                    recordTools: [{
                        label: '删除',
                        icon: 'trash-a',
                        color: 'error',
                        permission: 'Customer_DELETEREL',
                        operate: (record) => {
                            var clear = Sunset.confirm({
                                content: '确定删除此条目',
                                loading: true,
                                onOk: () => {
                                    CustomerStore.removeRel(record.relationId).then(res => {
                                        clear();
                                        Sunset.tip('删除成功', 'success');
                                        this.refreshRels();
                                    });
                                }
                            });
                        }
                    }]
                },
                relOutTableOptions: {
                    columns: [{
                        title: '医生姓名',
                        name: 'name'
                    }, {
                        title: '类型',
                        name: 'expertType',
                        format(v) {
                            return v == REL_OUT_HOSPITAL_TEAM ? '医生团队' : '医生';
                        }
                    }, {
                        title: '是否双签',
                        name: 'isDoubleSign',
                        style: {
                            'text-align': 'center'
                        },
                        format(v, record) {
                            if (record.expertType == REL_OUT_HOSPITAL_TEAM) {
                                return `<span class="${v?'text-success':'text-danger'}">${v?'是':'否'}</span>`
                            } else {
                                return '-';
                            }
                        }
                    }, {
                        title: '联系电话',
                        name: 'connectPhone'
                    }],
                    showIndex: true,
                    pageNumberStart: 0,
                    pageSize: 10,
                    localPage: true,
                    multiCheck: false,
                    sortable: true,
                    lazy: true,
                    method: 'listRel',
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    filter: false,
                    //数据条目操作
                    recordTools: [{
                        label: '删除',
                        icon: 'trash-a',
                        color: 'error',
                        permission: 'Customer_DELETEREL',
                        operate: (record) => {
                            var clear = Sunset.confirm({
                                content: '确定删除此条目',
                                loading: true,
                                onOk: () => {
                                    CustomerStore.removeRel(record.relationId).then(res => {
                                        clear();
                                        Sunset.tip('删除成功', 'success');
                                        this.refreshRels();
                                    });
                                }
                            });
                        }
                    }]
                },
                //表单
                relFormModal: {
                    title: '站点信息维护',
                    width: 800,
                    formOptions: {
                        cols: 3,
                        store: CustomerStore,
                        fields: [{
                            label: '关系类型',
                            name: 'relationType',
                            widget: 'radio',
                            monopolize: true,
                            data: [{
                                text: '院内',
                                value: REL_INSIDE
                            }, {
                                text: '院外',
                                value: REL_OUTSIDE
                            }],
                            validate: {
                                required: true
                            }
                        }, {
                            label: '角色',
                            name: 'relationJobType',
                            widget: 'radio',
                            monopolize: true,
                            enum: 'HOSPITAL_DOCTOR_TYPE',
                            premise(model) {
                                return model.relationType == REL_INSIDE;
                            }
                        }, {
                            label: '类型',
                            name: 'expertType',
                            widget: 'radio',
                            monopolize: true,
                            enum: 'CUSTOMER_REL_ROLE',
                            premise(model) {
                                return model.relationType == REL_OUTSIDE;
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '选择医生',
                            name: 'expertDoctor',
                            widget: 'tableselect',
                            monopolize: true,
                            premise(model) {
                                return model.expertType == REL_OUT_HOSPITAL;
                            },
                            nameKey: 'name',
                            getText(v) {
                                //return Base.HOSPITAL_MAP[v] && Base.HOSPITAL_MAP[v].title;
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
                                    store: DoctorStore
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '选择团队',
                            name: 'expertTeam',
                            widget: 'tableselect',
                            monopolize: true,
                            nameKey: 'teamName',
                            premise(model) {
                                return model.expertType == REL_OUT_HOSPITAL_TEAM;
                            },
                            getText(v) {
                                //return Base.HOSPITAL_MAP[v] && Base.HOSPITAL_MAP[v].title;
                            },
                            modalOptions: {
                                title: '选择医生团队',
                                checked: {
                                    multi: false,
                                    label: 'teamName'
                                },
                                width: 800,
                                hideFooter: true,
                                tableOptions: {
                                    columns: [{
                                        title: '团队名称',
                                        name: 'teamName'
                                    }, {
                                        title: '联系电话',
                                        name: 'connectPhone'
                                    }, {
                                        title: '创建时间',
                                        format: 'DATETIME',
                                        name: 'createDate'
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
                                            label: '团队名称',
                                            name: 'like',
                                            widget: 'search',
                                            placeholder: '请输入团队名称'
                                        }]
                                    },
                                    //数据条目操作
                                    recordTools: false,
                                    store: TeamStore
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '影像权限',
                            name: 'imagePermissions',
                            widget: 'checkbox',
                            enum: 'DICOM_TYPE',
                            monopolize: true,
                            premise(model) {
                                return model.relationType == REL_INSIDE;
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '服务类型',
                            name: 'reportService',
                            widget: 'radio',
                            enum: 'REPORT_SERVICE_TYPE',
                            monopolize: true,
                            premise(model) {
                                return model.relationType == REL_OUTSIDE;
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '是否双签',
                            name: 'isDoubleSign',
                            widget: 'switch',
                            monopolize: true,
                            premise(model) {
                                return model.expertType == REL_OUT_HOSPITAL_TEAM;
                            }
                        }],
                        format: (model) => {
                            model.isDoubleSign = !!model.isDoubleSign;
                            model.relationJobType = model.relationJobType || IMAGE_DOCTOR;
                            model.expertId = model.expertType == REL_OUT_HOSPITAL_TEAM ? model.expertTeam : model.expertDoctor;
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        method: 'saveRel',
                        tools: false
                    }
                }
            }
        },
        methods: {
            refreshCustomers(pageNumber) {
                var params = this.customerFilterParams;
                params.pageNumber = pageNumber || params.pageNumber;
                CustomerStore.list({
                    pageNumber: params.pageNumber - 1,
                    pageSize: params.pageSize,
                    like: params.like
                }).then(res => {
                    this.customers = res.data;
                    this.customerCount = res.totalCount;
                })
            },
            select(c) {
                this.selectedCustomer = c;
                this.refreshRels();
            },
            refreshRels() {
                if (this.selectedCustomer) {
                    CustomerStore.listRel({
                        customerId: this.selectedCustomer.id
                    }).then(data => {
                        var inRels = [],
                            outRels = [];
                        data && data.forEach(rel => {
                            if (rel.relationType == REL_INSIDE) {
                                inRels.push(rel);
                            } else {
                                outRels.push(rel);
                            }
                        });
                        this.$refs.relintable.setData(inRels);
                        this.$refs.relouttable.setData(outRels);
                    });
                }
            },
            editCustomer(c) {
                this.$refs.formmodal.open(c || {});
            }
        }
    };
</script>