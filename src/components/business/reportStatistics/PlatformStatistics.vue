<style lang="sass">
    .report-stats-container {
        background: #FFF;
        padding: 15px;
        .chart-container {
            padding: 20px 0px;
            .report-stas-pie {
                width: 100%;
                height: 280px;
            }
            .report-stas-line {
                width: 100%;
                height: 400px;
            }
        }
    }
</style>
<template>
    <sunset-layout title="远程诊断 - 平台统计">
        <div v-show="!dataview" class="report-stats-container">
            <div>
                <sunset-filter :options="filterOptions" @filter="refresh"></sunset-filter>
            </div>
            <div class="chart-container" v-show="!empty">
                <sunset-chart v-ref:typechart class="report-stas-pie" :options="typeChartOptions" @chart-click="refreshDataview"></sunset-chart>
                <sunset-chart v-ref:timechart class="report-stas-line" :options="timeChartOptions" @chart-click="refreshDataview"></sunset-chart>
            </div>
            <div class="chart-container" v-show="empty">
                <h3 style="text-align:center;">无数据</h3>
            </div>
        </div>
        <div v-show="dataview" class="report-stats-container">
            <sunset-toolbar style="margin-bottom:5px;" :options="backToolbar"></sunset-toolbar>
            <report-table v-ref:reporttable></report-table>
        </div>
    </sunset-layout>
</template>

<script>
    import CustomerStore from '../customer/CustomerStore.js';
    import ReportTable from './ReportDataTable.vue';
    import StatisticsStore from './StatisticsStore.js';

    const TASK_PROPERTY_DELAY = '8';

    const TYPE_COLOR = {
        CT: '#0099FF',
        MR: '#00CC99',
        DX: '#6666FF',
        CR: '#CC9900',
        '未超时完成': '#00cc66',
        '超时完成': '#0099FF',
        '未完成未超时': '#ff9900',
        '超时未完成': '#d9534f'
    };

    export default {
        components: {
            ReportTable
        },
        data() {
            return {
                //数据视图
                dataview: false,
                currentFilter: {},
                backToolbar: [{
                    label: '返回',
                    color: 'ghost',
                    operate: () => {
                        this.dataview = false;
                        this.$refs.reporttable.clear();
                    }
                }],
                //图表视图
                empty: false,
                typeChartOptions: {
                    title: {
                        text: '平台报告申请统计',
                        x: 'left'
                    },
                    label: {
                        normal: {
                            formatter: '{b}: {c}例'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [{
                        name: '设备类型',
                        type: 'pie',
                        radius: '70%',
                        center: ['15%', '60%'],
                        data: [],
                        itemStyle: {
                            normal: {
                                color(item) {
                                    return TYPE_COLOR[item.name];
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }, {
                        name: '任务状态',
                        type: 'pie',
                        radius: '70%',
                        center: ['45%', '60%'],
                        data: [],
                        itemStyle: {
                            normal: {
                                color(item) {
                                    return TYPE_COLOR[item.name];
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                },
                timeChartOptions: {
                    title: {
                        text: '报告申请趋势图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: []
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}例'
                        }
                    },
                    series: []
                },
                pending: false,
                filterOptions: {
                    fields: [{
                        name: 'opcId',
                        widget: 'select',
                        changeFilter: true,
                        style: {
                            width: '180px'
                        },
                        data: () => {
                            return CustomerStore.relationAll({
                                "pageNumber": 0,
                                "pageSize": 1000
                            }).then(data => {
                                var allIds = [],
                                    opcs;
                                opcs = data && data.map(c => {
                                    return {
                                        text: c.designation,
                                        value: c.id
                                    };
                                }) || [];
                                opcs.unshift({
                                    text: '全部',
                                    value: ''
                                });
                                return opcs;
                            });
                        },
                        clearable: true,
                        placeholder: '选择站点'
                    }, {
                        name: 'date',
                        widget: 'date',
                        type: 'daterange',
                        placement: 'bottom-start',
                        placeholder: '缴费日期区间',
                        changeFilter: true,
                        clearable: false,
                        default: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
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
                        name: 'timeUnit',
                        widget: 'radio',
                        type: 'button',
                        default: 'day',
                        changeFilter: true,
                        data: [{
                            text: '小时',
                            value: 'hour'
                        }, {
                            text: '日',
                            value: 'day'
                        }, {
                            text: '月',
                            value: 'month'
                        }]
                    }],
                    format(filter) {
                        var timeAxis = [],
                            start = filter.date[0],
                            end = filter.date[1],
                            current,
                            formater = {
                                hour: 'yyyy-MM-dd:HH',
                                day: 'yyyy-MM-dd',
                                month: 'yyyy-MM'
                            }[filter.timeUnit];
                        start.setHours(0);
                        end.setHours(23);
                        current = new Date(start.getTime());
                        while (current < end) {
                            timeAxis.push(Sunset.Dates.format(current, formater));
                            if (filter.timeUnit == 'hour') {
                                current.setHours(current.getHours() + 1);
                            } else if (filter.timeUnit == 'day') {
                                current.setDate(current.getDate() + 1);
                            } else if (filter.timeUnit == 'month') {
                                current.setMonth(current.getMonth() + 1);
                            } else {
                                break;
                            }
                        }
                        return {
                            opcId: filter.opcId,
                            startTime: Sunset.Dates.format(start, 'yyyy-MM-dd 00:00:00'),
                            endTime: Sunset.Dates.format(end, 'yyyy-MM-dd 23:59:59'),
                            timeUnit: filter.timeUnit,
                            timeAxis: timeAxis
                        };
                    }
                }
            }
        },
        methods: {
            generateTimeRanges() {
                var filter = this.filter;
            },
            refresh(filter) {
                if (this.pending) {
                    return;
                }
                this.currentFilter = filter;
                var timeAxis = filter.timeAxis;
                delete filter.timeAxis;
                var types = Sunset.Service.Dictionary.getEnums('DICOM_TYPE');
                this.pending = true;
                StatisticsStore.platform(filter).then(res => {
                    this.pending = false;
                    if (this.empty = res[1].length == 0) {
                        return;
                    }
                    //数量饼图
                    var typeRes = res[0],
                        typeData = [];
                    types && types.forEach(item => {
                        if (typeRes[item.value]) {
                            typeData.push({
                                value: typeRes[item.value],
                                name: item.value
                            })
                        }
                    });
                    this.typeChartOptions.series[0].data = typeData;
                    this.typeChartOptions.series[1].data = [{
                        name: '超时完成',
                        value: typeRes.finishTimeout
                    }, {
                        name: '未超时完成',
                        value: typeRes.finishUnTimeout
                    }, {
                        name: '超时未完成',
                        value: typeRes.unFinishTimeout
                    }, {
                        name: '未完成未超时',
                        value: typeRes.unFinishUnTimeout
                    }];
                    this.$refs.typechart.refresh();
                    //时间线图
                    var timeRes = res[1],
                        timeData = {},
                        series = [],
                        legend = [],
                        typeUnEmpty = {};
                    var dataTimeAxis = [],
                        push = false;
                    if (timeRes.length) {
                        while (timeAxis.length) {
                            if (timeAxis[0] == timeRes[0].timeAxis) {
                                push = true;
                            }
                            if (push) {
                                dataTimeAxis.push(timeAxis[0]);
                            }
                            if (timeAxis[0] == timeRes[timeRes.length - 1].timeAxis) {
                                break;
                            }
                            timeAxis.shift();
                        }
                    }
                    dataTimeAxis.forEach(time => {
                        var item = timeRes.filter(item => item.timeAxis == time)[0] || {};
                        types && types.forEach(type => {
                            timeData[type.value] = timeData[type.value] || [];
                            timeData[type.value].push(item[type.value] || 0);
                            if (item[type.value]) {
                                typeUnEmpty[type.value] = true;
                            }
                        });
                    });
                    Object.keys(timeData).forEach(type => {
                        if (typeUnEmpty[type]) {
                            legend.push(type);
                            series.push({
                                name: type,
                                type: 'line',
                                data: timeData[type],
                                lineStyle: {
                                    normal: {
                                        color: TYPE_COLOR[type]
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color(item) {
                                            return TYPE_COLOR[type];
                                        }
                                    },
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            });
                        }
                    });
                    this.timeChartOptions.legend.data = legend;
                    this.timeChartOptions.xAxis.data = dataTimeAxis;
                    this.timeChartOptions.series = series;
                    this.$refs.timechart.refresh();
                })
            },
            refreshDataview(params) {
                var filter = this.currentFilter;
                var map = {
                    '未超时完成': {
                        taskStatus: '5,6,7,9',
                        unTaskProperty: 8
                    },
                    '超时完成': {
                        taskStatus: '5,6,7,9',
                        taskProperty: 8
                    },
                    '未完成未超时': {
                        taskStatus: '1,2,3,4,8',
                        unTaskProperty: 8
                    },
                    '超时未完成': {
                        taskStatus: '1,2,3,4,8',
                        taskProperty: '8'
                    }
                };
                this.$refs.reporttable.search(Object.assign({
                    deviceType: map[params.name] ? null : params.name,
                    startTime: filter.startTime,
                    taskStatus: null,
                    taskProperty: null,
                    unTaskProperty: null,
                    endTime: filter.endTime,
                    customerId: filter.opcId
                }, map[params.name] || {}));
                this.dataview = true;
            }
        }
    }
</script>