<template>
    <div>
        <div v-show="!taskId">
            <sunset-table v-ref:table :options="tableOptions"></sunset-table>
        </div>
        <div v-show="taskId">
            <read-page :task-id="taskId" :tools="{goback: true,print: true}" :back="businessReportBack"></read-page>
        </div>
    </div>
</template>
<script>
    import ReportCenterStore from '../reportCenter/ReportCenterStore';
    import ReadPage from '../businessReport/report/ReadPage.vue';

    module.exports = {
        components: {
            ReadPage
        },
        methods: {
            search(filter) {
                this.$refs.table.search({
                    applyAccId: null,
                    customerId: filter.customerId,
                    deviceType: filter.deviceType,
                    memberAccId: filter.memberAccId,
                    reportStatus: null,
                    startTime: filter.startTime,
                    endTime: filter.endTime,
                    taskProperty: filter.taskProperty,
                    unTaskProperty: filter.unTaskProperty,
                    taskStatus: filter.taskStatus || '1,2,3,4,5,6,7,8,9',
                    teamId: filter.teamId,
                    tellWRstatus: null,
                    timeColName: filter.timeColName
                });
            },
            clear() {
                this.$refs.table.setData({
                    data: [],
                    count: 0
                });
            },
            businessReportBack() {
                this.taskId = null;
            }
        },
        data() {
            return {
                taskId: null,
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
                        title: '报告医生',
                        name: 'writer',
                        format(v) {
                            return v && v.name;
                        }
                    }, {
                        title: '审核医生',
                        name: 'reviewer',
                        format(v) {
                            return v && v.name;
                        }
                    }, {
                        title: '报告时长',
                        name: 'reportFinishTime',
                        format(v, record) {
                            var time = parseInt(((v || new Date()) - record.createTime) / 1000),
                                hours = parseInt(time / 3600),
                                minutes = parseInt(time % 3600 / 60),
                                seconds = parseInt(time % 60);
                            return `${hours?hours+'时':''}${minutes?minutes+'分':''}${seconds?seconds+'秒':''}`;
                        }
                    }],
                    showIndex: false,
                    pageSize: 10,
                    pageNumberStart: 0,
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
                    //数据条目操作
                    recordTools: [{
                        label: '查看',
                        color: 'info',
                        operate: (record) => {
                            this.taskId = record.taskId;
                        }
                    }],
                    store: ReportCenterStore
                }
            }
        }

    };
</script>