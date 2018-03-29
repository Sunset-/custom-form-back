<template>
    <sunset-layout title="医生团队管理">
        <sunset-crud v-ref:crud :options="options"></sunset-crud>
        <sunset-table-modal v-ref:doctorselector :options="doctorModalOptions"></sunset-table-modal>
    </sunset-layout>
</template>
<script>
    import TeamStore from './TeamStore';
    import DoctorStore from '../doctor/DoctorStore';

    const DEFAULT_MEMBER_ROLE = 0; //普通成员
    const DEFAULT_MEMBER_LEVEL = 3; //审核医生

    export default {
        methods: {

        },
        data() {
            return {
                options: {
                    title: '团队',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '头像',
                            name: 'teamPicture',
                            style: 'width:120px;text-align:center;',
                            format: (v) => {
                                return `<img style="width:60px;height:60px;" src="${Base.transformNfsFilePath(v)}" onerror="this.src='/assets/img/default.png'" />`
                            }
                        }, {
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
                            permission: 'Team_ADD'
                        }],
                        //表格搜索
                        filter: {
                            align: 'right',
                            style: 'float:right',
                            fields: [{
                                label: '团队名称',
                                name: 'like',
                                widget: 'search',
                                placeholder: '请输入团队名称'
                            }]
                        },
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            operate: (record) => {
                                TeamStore.getById(record.id).then(res => {
                                    res && res.teamMembers && res.teamMembers.sort(function (o1, o2) {
                                        return o1.joinDate < o2.joinDate ? -1 : (o1.joinDate >
                                            o2.joinDate ? 1 : 0);
                                    });
                                    this.$refs.crud.operateSignal('MODIFY', res);
                                });
                            },
                            permission: 'Team_MODIFY'
                        }],
                        store: TeamStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: TeamStore,
                        fields: [{
                            group: '基本信息',
                            label: '团队名称',
                            name: 'teamName',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '联系电话',
                            name: 'connectPhone',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '团队头像',
                            name: 'teamPicture',
                            widget: 'image',
                            monopolize: true,
                            url: '/upload/api/1.0.0/file/storage',
                            max: 1,
                            thumbnail(result) {
                                if (result) {
                                    return Base.transformNfsFilePath(result);
                                }
                            },
                            validate: {
                                maxlength: 32
                            }
                        }, {
                            group: '团队成员',
                            label: '成员列表',
                            name: 'teamMembers',
                            widget: 'table',
                            monopolize: true,
                            table: {
                                columns: [{
                                    title: '医生名称',
                                    name: 'memberName'
                                }, {
                                    title: '角色',
                                    name: 'memberType',
                                    widget: 'radio',
                                    enum: 'TEAM_MEMBER_ROLE'
                                }, {
                                    title: '职称',
                                    name: 'strongPrivilege',
                                    widget: 'radio',
                                    enum: 'TEAM_MEMBER_LEVEL'
                                }],
                                recordTools: {
                                    length: 1,
                                    size: 'small',
                                    tools: [{
                                        label: '删除',
                                        icon: 'trash-a',
                                        color: 'error',
                                        signal: 'REMOVE'
                                    }]
                                },
                                footTools: [{
                                    label: '设置团队成员',
                                    icon: 'plus-round',
                                    color: 'info',
                                    operate: (list) => {
                                        this.$refs.doctorselector.open(list.map(item => ({
                                            name: item.memberName,
                                            accId: item.accountId
                                        }))).then(res => {
                                            res = res.map(item => ({
                                                accountId: item.accId,
                                                memberName: item.name,
                                                memberType: DEFAULT_MEMBER_ROLE,
                                                strongPrivilege: DEFAULT_MEMBER_LEVEL
                                            }));
                                            var exsits = {},
                                                newExsits = {};
                                            list.forEach(item => {
                                                exsits[item.accountId] = true;
                                            });
                                            res && res.forEach(item => {
                                                newExsits[item.accountId] = true;
                                                if (!exsits[item.accountId]) {
                                                    list.push(item);
                                                }
                                            });
                                            for (var i = 0; i < list.length; i++) {
                                                if (!newExsits[list[i].accountId]) {
                                                    list.splice(i, 1);
                                                    i--;
                                                }
                                            }
                                            this.$refs.doctorselector.cancel();
                                        })
                                    }
                                }]
                            }
                        }],
                        format: (model, record) => {
                            if (model.id) {
                                var deleteIds;
                                var oldMembers = record.teamMembers,
                                    newMembers = model.teamMembers;
                                if (oldMembers) {
                                    var newIds = {},
                                        delIds = [];
                                    newMembers.map(function (item) {
                                        newIds[item.accountId] = true
                                    });
                                    oldMembers.map(function (item) {
                                        if (!newIds[item.accountId]) {
                                            delIds.push(item.id);
                                        }
                                    });
                                    deleteIds = delIds.length ? delIds : null;
                                }
                                return {
                                    doctorTeam: model,
                                    needDeleteIds: deleteIds
                                };
                            } else {
                                return model;
                            }
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: null
                    }
                },
                doctorModalOptions: {
                    title: '选择团队成员',
                    checked: {
                        multi: true,
                        max: 999,
                        label: 'name'
                    },
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
                        }],
                        showIndex: false,
                        pageNumberStart: 0,
                        pageSize: 5,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        idKey: 'accId',
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
                                label: '姓名',
                                name: 'like',
                                widget: 'search',
                                placeholder: '请输入医生姓名'
                            }]
                        },
                        //数据条目操作
                        recordTools: false,
                        store: DoctorStore
                    }
                }
            }
        }
    };
</script>