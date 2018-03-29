<template>
    <sunset-layout title="诊断中心">
        <div v-show="!taskId">
            <sunset-crud v-ref:crud :options="options"></sunset-crud>
        </div>
        <div v-show="taskId">
            <read-page :task-id="taskId" :tools="{goback: true,print: true}" :back="businessReportBack"></read-page>
        </div>
    </sunset-layout>
</template>
<script>
    import ReportCenterStore from './ReportCenterStore.js';
    import TeamStore from '../team/TeamStore';
    import CustomerStore from '../customer/CustomerStore';

    import ReadPage from '../businessReport/report/ReadPage.vue';

    export default {
        components: {
            ReadPage
        },
        methods: {
            businessReportBack() {
                this.taskId = null;
            }
        },
        data() {
            return {
                taskId: null,
                options: {
                    title: '诊断报告',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '医院',
                            name: 'customer.name'
                        }, {
                            title: '患者',
                            name: 'applyForm.patient.patientName'
                        }, {
                            title: '诊断团队',
                            name: 'expert.name'
                        }, {
                            title: '设备',
                            name: 'deviceType'
                        }, {
                            title: '部位',
                            name: 'applyForm.checkPoint.points'
                        }, {
                            title: '检查时间',
                            name: 'patientCheckTime',
                            format: 'DATETIME'
                        }, {
                            title: '报告类型',
                            name: 'taskProperty',
                            style: 'text-align:center',
                            format(v, record) {
                                var labels = [];
                                if (v & 2) {
                                    labels.push('<label class="text-danger">急</label>');
                                }
                                if (v & 4) {
                                    labels.push('<label class="text-warning">疑</label>');
                                }
                                if (v & 32) {
                                    labels.push('<label style="color:purple;">危</label>');
                                }
                                return labels.length ? labels.join(' | ') : '-';
                            }
                        }, {
                            title: '报告状态',
                            name: 'reportStatus',
                            enum: 'REPORT_STATUS'
                        }, {
                            title: '当前医生',
                            name: 'owner.name'
                        }, {
                            title: '审核医生',
                            name: 'reviewer.name'
                        }, {
                            title: '总用时',
                            name: 'createTime',
                            format(v, record) {
                                var time = parseInt(((record.reportFinishTime || new Date()) - v) / 1000),
                                    hours = parseInt(time / 3600),
                                    minutes = parseInt(time % 3600 / 60),
                                    seconds = parseInt(time % 60);
                                return `${hours?hours+'时':''}${minutes?minutes+'分':''}${seconds?seconds+'秒':''}`;
                            }
                        }],
                        showIndex: false,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        pageNumberStart: 0,
                        sortable: true,
                        lazy: true,
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
                                name: 'date',
                                widget: 'date',
                                type: 'daterange',
                                placement: 'bottom-start',
                                placeholder: '缴费日期区间',
                                changeFilter: true,
                                shortcuts: [{
                                    text: '最近一周',
                                    value() {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                        return [start, end];
                                    }
                                }, {
                                    text: '最近一个月',
                                    value() {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                        return [start, end];
                                    }
                                }, {
                                    text: '最近三个月',
                                    value() {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                        return [start, end];
                                    }
                                }]
                            }, {
                                name: 'customer',
                                widget: 'select',
                                style: {
                                    width: '180px'
                                },
                                data: () => {
                                    return CustomerStore.relationAll({
                                        "pageNumber": 0,
                                        "pageSize": 1000
                                    }).then(data => {
                                        return data && data.map(c => ({
                                            text: c.designation,
                                            value: c.id
                                        })) || [];
                                    });
                                },
                                clearable: true,
                                placeholder: '选择站点',
                                changeFilter: true
                            }, {
                                name: 'team',
                                widget: 'select',
                                style: {
                                    width: '150px'
                                },
                                data: () => {
                                    return TeamStore.relationAll({
                                        "pageNumber": 0,
                                        "pageSize": 1000
                                    }).then(data => {
                                        return data && data.map(team => ({
                                            text: team.teamName,
                                            value: team.teamId
                                        })) || [];
                                    });
                                },
                                clearable: true,
                                placeholder: '医生团队',
                                changeFilter: true
                            }, {
                                name: 'deviceType',
                                widget: 'select',
                                enum: 'DICOM_TYPE',
                                clearable: true,
                                placeholder: '设备类型',
                                changeFilter: true
                            }, {
                                name: 'taskType',
                                widget: 'select',
                                enum: 'TASK_TYPE',
                                clearable: true,
                                placeholder: '报告类型',
                                changeFilter: true,
                                style: 'width:90px'
                            }, {
                                name: 'reportStatus',
                                widget: 'select',
                                enum: 'REPORT_STATUS',
                                clearable: true,
                                placeholder: '报告状态',
                                changeFilter: true,
                                style: 'width:90px'
                            }, {
                                name: 'delFlag',
                                widget: 'select',
                                enum: 'REPORT_DELETE_STATUS',
                                placeholder: '删除状态',
                                changeFilter: true,
                                style: 'width:90px'
                            }, {
                                name: 'patientName',
                                widget: 'search',
                                clearable: true,
                                placeholder: '患者姓名'
                            }],
                            format(model) {
                                var startTime,
                                    endTime;
                                if (model.date && model.date[0] && model.date[1]) {
                                    startTime = Sunset.Dates.format(model.date[0], 'yyyy-MM-dd 00:00:00');
                                    endTime = Sunset.Dates.format(model.date[1], 'yyyy-MM-dd 23:59:59');
                                } else {
                                    startTime = Sunset.Dates.format(new Date(0), 'yyyy-MM-dd 00:00:00');
                                    endTime = Sunset.Dates.format(new Date(), 'yyyy-MM-dd 23:59:59');
                                }
                                return {
                                    applyAccId: '',
                                    customerId: model.customer,
                                    deviceType: model.deviceType,
                                    memberAccId: '',
                                    patientName: model.patientName,
                                    reportStatus: model.reportStatus,
                                    delFlag: model.delFlag,
                                    startTime: startTime,
                                    endTime: endTime,
                                    taskProperty: model.taskType,
                                    taskStatus: '1,2,3,4,5,7,8,9',
                                    teamId: model.team,
                                    writeOrReview: '',
                                    order : ' createTime DESC '
                                };
                            }
                        },
                        //数据条目操作
                        recordTools: [{
                            label: '查看',
                            color: 'info',
                            permission: 'Reporting_VIEW',
                            operate: (record) => {
                                this.taskId = record.taskId;
                            }
                        }, {
                            label: '删除',
                            color: 'error',
                            confirm: '确定删除此任务',
                            permission: 'Reporting_DELETE',
                            premise(record) {
                                return !record.delFlag;
                            },
                            operate: (record) => {
                                ReportCenterStore.removeById(record.taskId).then(res => {
                                    Sunset.tip('删除成功', 'success');
                                    this.$refs.crud.operateSignal('REFRESH');
                                });
                            }
                        }],
                        store: ReportCenterStore
                    },
                    //表格表单
                    formOptions: {}
                }
            }
        }
    };
</script>