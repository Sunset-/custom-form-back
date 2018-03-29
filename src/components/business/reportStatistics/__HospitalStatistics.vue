<style lang="sass">
    @import '../../style/_variables.scss';
    .hospital-statistics-container {
        padding: 15px;
        background: #FFF;
        h3 {
            padding: 15px 10px;
        }
        h4 {
            margin: 5px 10px;
            padding: 10px 0px;
            font-size: 17px;
            border-bottom: 1px solid #cdcdcd;
        }
        .statistic-label-wrap {
            &.inline {
                max-width: 100%;
            }
            vertical-align: top;
            padding: 10px 0px 5px 10px;
            font-size: 0px;
            .statistic-label {
                display: inline-table;
                height: 60px;
                line-height: 60px;
                margin-right: 10px;
                margin-bottom: 10px;
                background: lighten($info, 25%);
                color: #FFF;
                &>div {
                    display: inline-block;
                    vertical-align: middle;
                }
                .statistic-label-title {
                    width: 36px;
                    height: 36px;
                    background: lighten($info, 5%);
                    border-radius: 20px;
                    margin: 0px 10px;
                    color: #FFF;
                    line-height: 36px;
                    text-align: center;
                    font-size: 14px;
                    font-family: "微软雅黑", "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
                }
                .statistic-label-detail {
                    line-height: 18px;
                    font-size: 12px;
                    text-align: right;
                    color: darken($info, 10%);
                    width: 100px;
                    padding-right: 10px;
                    b {
                        font-size: 18px;
                        padding: 0px 2px;
                    }
                }
                //CT
                &.label-urgent {
                    background: lighten($danger, 35%);
                    .statistic-label-title {
                        background: lighten($danger, 10%);
                    }
                    .statistic-label-detail {
                        color: darken($danger, 10%);
                    }
                }
                &.label-knotty {
                    background: lighten($warning, 35%);
                    .statistic-label-title {
                        background: lighten($warning, 10%);
                    }
                    .statistic-label-detail {
                        color: darken($warning, 10%);
                    }
                }
                &.label-error {
                    background: lighten($danger, 25%);
                    .statistic-label-title {
                        background: lighten($danger, 5%);
                    }
                    .statistic-label-detail {
                        color: darken($danger, 10%);
                    }
                }
                &.label-success {
                    background: lighten($success, 25%);
                    .statistic-label-title {
                        background: lighten($success, 0%);
                    }
                    .statistic-label-detail {
                        color: darken($success, 10%);
                    }
                }
            }
        }
        .statistic-table-wrap {
            display: inline-block;
            padding: 0px 10px 5px 10px;
            width: 100%;
            &>table {
                width: 100%;
                border-collapse: collapse;
                thead {
                    td {
                        background: #EFEFEF;
                    }
                }
                td {
                    text-align: center;
                    border: 1px solid #cdcdcd;
                    padding: 5px 10px;
                    font-size: 14px;
                    min-width: 70px;
                    &.notnull {
                        color: $info;
                        &.active {
                            background: lighten($info, 30%);
                        }
                    }
                    &.notnull:hover {
                        background: lighten($info, 35%);
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
<template>
    <sunset-layout title="报告统计">
        <div class="hospital-statistics-container">
            <div>
                <sunset-filter v-ref:filter :options="filterOptions" @filter="refresh"></sunset-filter>
                <h4>概要统计</h4>
                <div v-if="types.length" class="statistic-label-wrap">
                    <div class="statistic-label" v-for="t in types">
                        <div class="statistic-label-title">{{t.deviceType}}</div>
                        <div class="statistic-label-detail"><b>{{t.reportCount}}</b>例报告<br/><b>{{t.pointCount}}</b>个部位</div>
                    </div>
                    <div class="statistic-label label-urgent">
                        <div class="statistic-label-title">加急</div>
                        <div class="statistic-label-detail"><b>{{total.urgentCount}}</b>例报告</div>
                    </div>
                    <div class="statistic-label label-knotty">
                        <div class="statistic-label-title">疑难</div>
                        <div class="statistic-label-detail"><b>{{total.knottyCount}}</b>例报告</div>
                    </div>
                </div>
                <div v-if="types.length" class="statistic-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <td rowspan="2"></td>
                                <td colspan="2" v-for="t in types">{{t.deviceType}}</td>
                                <td rowspan="2">加急</td>
                                <td rowspan="2">疑难</td>
                            </tr>
                            <tr>
                                <template v-for="t in types">
                                    <td>申请数</td>
                                    <td>部位数</td>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="expert in experts">
                                <td :class="{notnull:true,active:active(null,expert)}" @click="detail(null,expert)">{{expert.expertName}}</td>
                                <template v-for="t in types">
                                    <td :class="{notnull:expert[t.deviceType]&&expert[t.deviceType].reportCount||0,active:active(t.deviceType,expert)}" @click="detail(t.deviceType,expert)">{{expert[t.deviceType]&&expert[t.deviceType].reportCount||0}}</td>
                                    <td :class="{notnull:expert[t.deviceType]&&expert[t.deviceType].pointCount||0,active:active(t.deviceType,expert)}" @click="detail(t.deviceType,expert)">{{expert[t.deviceType]&&expert[t.deviceType].pointCount||0}}</td>
                                </template>
                                <td :class="{notnull:expert.urgentCount,active:active(null,expert,3)}" @click="detail(null,expert,3)">{{expert.urgentCount||0}}</td>
                                <td :class="{notnull:expert.knottyCount,active:active(null,expert,5)}" @click="detail(null,expert,5)">{{expert.knottyCount||0}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">总计</td>
                                <td :class="{notnull:true,active:active(t.deviceType)}" colspan="2" v-for="t in types" @click="detail(t.deviceType)">{{t.pointCount||0}}个部位（{{t.reportCount||0}}份报告）</td>
                                <td :class="{notnull:total.knottyCount,active:active(null,null,3)}" @click="detail(null,null,3)">{{total.urgentCount||0}}</td>
                                <td :class="{notnull:total.knottyCount,active:active(null,null,5)}" @click="detail(null,null,5)">{{total.knottyCount||0}}</td>
                            </tr>
                            <tr>
                                <td :class="{notnull:true,active:active()}" :colspan="types.length*2+2" @click="detail()">{{total.pointCount||0}}个部位（{{total.reportCount||0}}份报告）</td>
                            </tr>
                        </tbody>
                        </thead>
                    </table>
                </div>
                <div v-if="!types.length">
                    <h3>无数据</h3>
                </div>
            </div>
            <div>
                <h4>报告列表及下载</h4>
                <div v-if="counts.length" class="statistic-label-wrap inline">
                    <div v-for="count in counts" :class="['statistic-label',count.color]">
                        <div class="statistic-label-title">{{count.title}}</div>
                        <div class="statistic-label-detail">{{{count.detail}}}</div>
                    </div>
                </div>
                <sunset-table style="margin: 0px 10px;" v-ref:detailtable :options="detailTableOptions"></sunset-table>
            </div>
        </div>
    </sunset-layout>
</template>

<script>
    import HospitalStatisticsStore from './HospitalStatisticsStore';

    export default {
        methods: {
            refresh(filter) {
                HospitalStatisticsStore.statistics(filter || {}).then(res => {
                    var types = [],
                        typeMap = {},
                        type = null,
                        expertMap = {},
                        experts = [],
                        expert = null,
                        total = {
                            reportCount: 0,
                            pointCount: 0,
                            urgentCount: 0,
                            knottyCount: 0
                        };
                    res && res.forEach(item => {
                        if (!(type = typeMap[item.deviceType])) {
                            type = {
                                deviceType: item.deviceType,
                                reportCount: 0,
                                pointCount: 0,
                                urgentCount: 0,
                                knottyCount: 0
                            };
                            types.push(type);
                            typeMap[item.deviceType] = type;
                        }
                        if (!(expert = expertMap[item.expertId])) {
                            expert = {
                                expertId: item.expertId,
                                expertName: item.expertName,
                                urgentCount: 0,
                                knottyCount: 0
                            };
                            experts.push(expert);
                            expertMap[item.expertId] = expert;
                        }
                        expert[item.deviceType] = item;
                        expert.urgentCount += item.ji;
                        expert.knottyCount += item.yi;

                        typeMap[item.deviceType].reportCount += item.reportCount;
                        typeMap[item.deviceType].pointCount += item.pointCount;
                        typeMap[item.deviceType].urgentCount += item.ji;
                        typeMap[item.deviceType].knottyCount += item.yi;
                        total.reportCount += item.reportCount;
                        total.pointCount += item.pointCount;
                        total.urgentCount += item.ji;
                        total.knottyCount += item.yi;
                    });
                    this.types = types;
                    this.experts = experts;
                    this.total = total;
                });
                this.currentFilter.select = JSON.stringify({
                    "order": "createTime Desc",
                    "between": {
                        "col": "reportFinishTime",
                        "range": [Sunset.Dates.parse(filter.startTime).getTime(), Sunset.Dates.parse(filter.endTime)
                            .getTime() +
                            86399999
                        ]
                    }
                });
                this.detail();
            },
            detail(type, expert, taskProperty) {
                var filter = this.currentFilter;
                filter.deviceType = type;
                filter.expertId = expert && expert.expertId;
                filter.taskProperty = taskProperty;
                this.$refs.detailtable.refresh(1, true);
                //统计
                var countFilter = JSON.parse(JSON.stringify(filter));
                HospitalStatisticsStore.detailCount(countFilter).then(res => {
                    var counts = [];
                    counts.push({
                        title: '总计',
                        color: 'label-total',
                        detail: `<b>${res.total.count}</b>例报告<br><b>${res.total.point}</b>个部位`
                    });
                    Object.keys(res.deviceType).forEach(type => {
                        counts.push({
                            title: type,
                            detail: `<b>${res.deviceType[type].deviceTypeCount}</b>例报告<br><b>${res.deviceType[type].pointCount}</b>个部位`
                        });
                    });
                    res.patientType['1'] && counts.push({
                        title: '门诊',
                        detail: `<b>${res.patientType['1']}</b>例报告`
                    });
                    res.patientType['2'] && counts.push({
                        title: '住院',
                        detail: `<b>${res.patientType['2']}</b>例报告`
                    });
                    res.patientType['4'] && counts.push({
                        title: '体检',
                        detail: `<b>${res.patientType['4']}</b>例报告`
                    });
                    res.patientType['8'] && counts.push({
                        title: '急诊',
                        detail: `<b>${res.patientType['8']}</b>例报告`
                    });
                    res.positiveNegative.negative && counts.push({
                        title: '阴性',
                        color: 'label-success',
                        detail: `<b>${res.positiveNegative.negative}</b>例报告`
                    });
                    res.positiveNegative.positive && counts.push({
                        title: '阳性',
                        color: 'label-error',
                        detail: `<b>${res.positiveNegative.positive}</b>例报告`
                    });
                    res.urgentDoubt.urgent && counts.push({
                        title: '加急',
                        color: 'label-urgent',
                        detail: `<b>${res.urgentDoubt.urgent}</b>例报告`
                    });
                    res.urgentDoubt.doubt && counts.push({
                        title: '疑难',
                        color: 'label-knotty',
                        detail: `<b>${res.urgentDoubt.doubt}</b>例报告`
                    });
                    this.counts = counts;
                });
            },
            active(type, expert, taskProperty) {
                var filter = this.currentFilter;
                return filter.deviceType == type && filter.expertId == (expert && expert.expertId) && filter.taskProperty ==
                    taskProperty;
            }
        },
        data() {
            return {
                total: {},
                types: [],
                experts: [],
                counts: [],
                currentFilter: {
                    deviceType: null,
                    expertId: null,
                    taskProperty: null,
                    tellWRstatus: null,
                    reportStatus: '4',
                    taskStatus: '5,6'
                },
                filterOptions: {
                    left: false,
                    fields: [{
                        label: '统计时间',
                        name: 'date',
                        widget: 'date',
                        type: 'daterange',
                        placeholder: '开始时间',
                        style: 'width:320px;',
                        changeFilter: true,
                        clearable: false,
                        shortcuts: [{
                                text: '今天',
                                value() {
                                    var now = new Date();
                                    now.setHours(0);
                                    now.setMinutes(0);
                                    now.setSeconds(0);
                                    now.setMilliseconds(0);
                                    return [now, new Date(now.getTime() + 86399999)];
                                }
                            },
                            {
                                text: '一周内',
                                value() {
                                    var now = new Date();
                                    now.setHours(0);
                                    now.setMinutes(0);
                                    now.setSeconds(0);
                                    now.setMilliseconds(0);
                                    return [new Date(now.getTime() - 86400000 * 6), new Date(now.getTime() +
                                        86399999)];
                                }
                            },
                            {
                                text: '本月',
                                value() {
                                    var now = new Date();
                                    now.setHours(0);
                                    now.setMinutes(0);
                                    now.setSeconds(0);
                                    now.setMilliseconds(0);
                                    return [new Date(now.getTime() - 86400000 * 6), new Date(now.getTime() +
                                        86399999)];
                                }
                            },
                            {
                                text: '三月内',
                                value() {
                                    var now = new Date();
                                    now.setHours(0);
                                    now.setMinutes(0);
                                    now.setSeconds(0);
                                    now.setMilliseconds(0);
                                    return [new Date(now.getTime() - 86400000 * 90), new Date(now.getTime() +
                                        86399999)];
                                }
                            },
                            {
                                text: '本年',
                                value() {
                                    var now = new Date();
                                    now.setHours(0);
                                    now.setMinutes(0);
                                    now.setSeconds(0);
                                    now.setMilliseconds(0);
                                    var end = new Date(now.getTime() +
                                        86399999);
                                    now.setMonth(0);
                                    now.setDate(1);
                                    var start = new Date(now.getTime());
                                    return [start, end];
                                }
                            }
                        ]
                    }],
                    format: function (filter) {
                        if (filter.date && filter.date[0] && filter.date[1]) {
                            filter.startTime = Sunset.Dates.format(filter.date[0], 'yyyy-MM-dd');
                            filter.endTime = Sunset.Dates.format(filter.date[1], 'yyyy-MM-dd');
                        } else {
                            var date = new Date();
                            filter.endTime = Sunset.Dates.format(date, 'yyyy-MM-dd');
                            date.setDate(1);
                            filter.startTime = Sunset.Dates.format(date, 'yyyy-MM-dd');
                        }
                        delete filter.date;
                        return filter;
                    }
                },
                detailTableOptions: {
                    columns: [{
                        title: '医生/团队',
                        name: 'expert.name'
                    }, {
                        title: '患者名称',
                        name: 'baseInfo.patientName'
                    }, {
                        title: '性别',
                        name: 'baseInfo.patientSex',
                        enum: 'PATIENT_SEX'
                    }, {
                        title: '年龄',
                        name: 'baseInfo.patientAge'
                    }, {
                        title: '设备类型',
                        name: 'baseInfo.deviceType'
                    }, {
                        title: '检查部位',
                        name: 'applyForm.checkPoint.points'
                    }, {
                        title: '部位数',
                        name: 'applyForm.checkPoint.pointCount'
                    }, {
                        title: '申请医生',
                        name: 'applicant.designation'
                    }, {
                        title: '申请时间',
                        name: 'applyTime',
                        format: 'DATETIME'
                    }, {
                        title: '完成时间',
                        name: 'reportFinishTime',
                        format: 'DATETIME'
                    }, {
                        title: '报告医生',
                        name: 'report.writerInfo.designation'
                    }, {
                        title: '审核医生',
                        name: 'report.reviewerInfo.designation'
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
                        label: '下载',
                        icon: 'android-download',
                        color: 'info',
                        operate: () => {
                            HospitalStatisticsStore.download(this.currentFilter)
                        }
                    }],
                    //表格搜索
                    filter: false,
                    formatFilter: (filter) => {
                        var currentFilter = this.currentFilter;
                        var select = JSON.parse(currentFilter.select);
                        select.pageNumber = filter.pageNumber;
                        select.pageSize = filter.pageSize;
                        this.currentFilter.select = JSON.stringify(select);
                        return currentFilter;
                    },
                    //数据条目操作
                    recordTools: [],
                    store: HospitalStatisticsStore,
                    method: 'detailList'
                }
            }
        },
        ready() {
            var filter = {};
            var date = new Date();
            filter.endTime = date.getTime();
            date.setDate(1);
            filter.startTime = date.getTime();
            this.$refs.filter.reset({
                date: [filter.startTime, filter.endTime]
            });
        }
    }
</script>