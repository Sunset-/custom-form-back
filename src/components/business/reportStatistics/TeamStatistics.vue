<style lang="sass">
    .report-team-stats-container {
        background: #FFF;
        padding: 15px;
        .chart-container {
            padding: 20px 0px;
            .report-team-pie {
                width: 100%;
                height: 300px;
            }
            .report-member-pie {
                display: inline-block;
                width: 400px;
                height: 300px;
            }
        }
    }
</style>
<template>
    <sunset-layout title="远程诊断 - 团队统计">
        <div v-show="!dataview" class="report-team-stats-container">
            <div>
                <sunset-filter :options="filterOptions" @filter="refresh"></sunset-filter>
            </div>
            <div class="chart-container" v-show="!empty">
                <div>
                    <sunset-chart v-ref:teamchart class="report-team-pie" :options="teamChartOptions" @chart-click="refreshDataview"></sunset-chart>
                </div>
                <div>
                    <sunset-chart v-ref:memberchart v-for="options in memberCharts" class="report-member-pie" :options="options" @chart-click="refreshDataview"></sunset-chart>
                </div>
            </div>
            <div class="chart-container" v-show="empty">
                <h3 style="text-align:center;">无数据</h3>
            </div>
        </div>
        <div v-show="dataview" class="report-team-stats-container">
            <sunset-toolbar style="margin-bottom:5px;" :options="backToolbar"></sunset-toolbar>
            <report-table v-ref:reporttable></report-table>
        </div>
    </sunset-layout>
</template>

<script>
    import TeamStore from '../team/TeamStore.js';
    import ReportTable from './ReportDataTable.vue';
    import StatisticsStore from './StatisticsStore.js';

    const TASK_PROPERTY_DELAY = '8';

    const TYPE_COLOR = {
        CT: '#0099FF',
        MR: '#00CC99',
        DX: '#6666FF',
        CR: '#CC9900',
        '正常': '#00cc66',
        '超时': '#ff9900'
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
                memberCharts: [],
                teamChartOptions: {
                    title: {
                        text: '团队报告统计',
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
                        center: ['15%', '50%'],
                        data: [],
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
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
                        center: ['40%', '50%'],
                        data: [],
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
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
                memberChartOptions: {
                    title: {
                        text: '团队报告统计',
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
                        radius: '45%',
                        center: ['50%', '50%'],
                        data: [],
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
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
                        radius: ['60%', '80%'],
                        center: ['50%', '50%'],
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
                pending: false,
                filterOptions: {
                    fields: [{
                        name: 'teamId',
                        widget: 'select',
                        changeFilter: true,
                        defaultFirst: true,
                        style: {
                            width: '180px'
                        },
                        data: () => {
                            return TeamStore.relationAll({
                                "pageNumber": 0,
                                "pageSize": 1000
                            }).then(data => {
                                var teams = [];
                                data && data.forEach(c => {
                                    if (c.teamType == '2') {
                                        teams.push({
                                            text: c.teamName,
                                            value: c.teamId
                                        });
                                    }
                                });
                                return teams;
                            })
                        },
                        clearable: false,
                        placeholder: '选择团队'
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
                    }],
                    format(filter) {
                        return {
                            teamId: filter.teamId,
                            startTime: Sunset.Dates.format(filter.date[0], 'yyyy-MM-dd 00:00:00'),
                            endTime: Sunset.Dates.format(filter.date[1], 'yyyy-MM-dd 23:59:59')
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
                StatisticsStore.team(filter).then(res => {
                    this.pending = false;
                    if (this.empty = (res.team.normal == 0 && res.team.timeout == 0)) {
                        return;
                    }
                    //数量饼图
                    var team = res.team,
                        typeData = [];
                    types && types.forEach(item => {
                        if (team[item.value]) {
                            typeData.push({
                                value: team[item.value],
                                name: item.value
                            })
                        }
                    });
                    this.teamChartOptions.series[0].data = typeData;
                    this.teamChartOptions.series[1].data = [{
                        name: '正常',
                        value: team.normal
                    }, {
                        name: '超时',
                        value: team.timeout
                    }];
                    this.$refs.teamchart.refresh();

                    var memberCharts = [];
                    res.members.forEach(member => {
                        if (!member.normal && !member.timeout) {
                            return;
                        }
                        var options = Sunset.clone(this.memberChartOptions);
                        options.title.text = `${member.memberName}`;
                        var typeData = [];
                        types && types.forEach(item => {
                            if (member[item.value]) {
                                typeData.push({
                                    value: member[item.value],
                                    name: item.value,
                                    memberAccId: member.memberAccId
                                })
                            }
                        });
                        options.series[0].data = typeData;
                        options.series[1].data = [{
                            name: '正常',
                            value: member.normal,
                            memberAccId: member.memberAccId
                        }, {
                            name: '超时',
                            value: member.timeout,
                            memberAccId: member.memberAccId
                        }];
                        memberCharts.push(options);
                    });
                    this.memberCharts = memberCharts;
                });
            },
            refreshDataview(params) {
                var filter = this.currentFilter;
                this.$refs.reporttable.search({
                    deviceType: (params.name != '超时' && params.name != '正常') ? params.name : null,
                    startTime: filter.startTime,
                    taskProperty: params.name == '超时' ? TASK_PROPERTY_DELAY : null,
                    unTaskProperty: params.name == '正常' ? TASK_PROPERTY_DELAY : null,
                    endTime: filter.endTime,
                    teamId: filter.teamId,
                    memberAccId: params.data.memberAccId,
                    timeColName: 'reportFinishTime'
                });
                this.dataview = true;
            }
        }
    }
</script>