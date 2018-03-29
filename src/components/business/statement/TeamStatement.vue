<style lang="sass">
    .team-statement-container {
        background: #FFF;
        padding: 15px;
        .team-statement-price-wrap {
            margin-top: 10px;
            &>.team-statement-price {
                margin-bottom: 5px;
                font-size: 18px;
                span {
                    display: inline-block;
                    width: 40px;
                }
            }
        }
        .team-statement-table {
            margin-top: 10px;
            border-collapse: collapse;
            th {
                background: #efefef;
            }
            th,
            td {
                border: 1px solid #ccc;
                width: 100px;
                height: 30px;
                text-align: center;
            }
        }
    }
</style>
<template>
    <sunset-layout title="医生团队对账单">
        <div class="team-statement-container">
            <sunset-filter v-ref:filter :options="filterOptions" @filter="statistics"></sunset-filter>
            <div v-show="currentTeam">
                <div class="team-statement-price-wrap" v-show="prices.length">
                    <div class="team-statement-price" v-for="price in prices">
                        <span>{{price.type}}</span>：
                        <label style="color:#09c;">【写报告】{{price.writePrice}}元</label>
                        <label style="color:green;">【审报告】{{price.reviewPrice}}元</label>
                    </div>
                </div>
                <div v-show="!prices.length" style="font-size:16px;padding:10px 0px;">
                    未设置价格，请先设置价格
                </div>
                <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
            </div>
            <table class="team-statement-table">
                <tr>
                    <th>医生姓名</th>
                    <template v-for="t in types">
                        <th colspan="2">{{t}}（个数）</th>
                        <th>价格（元）</th>
                    </template>
                    <th>总价格（元）</th>
                </tr>
                <template v-for="member in members">
                    <tr>
                        <td rowspan="2">{{member.personName}}</td>
                        <template v-for="d in member.details">
                            <td>写报告</td>
                            <td>{{ d.writePointCount||0}}</td>
                            <td rowspan="2">{{d.deviceTypeFee||0}}</td>
                        </template>
                        <td rowspan="2">{{member.personTotalFee||0}}</td>
                    </tr>
                    <tr>
                        <template v-for="d in member.details">
                            <td>审报告</td>
                            <td>{{d.reviewPointCount||0}}</td>
                        </template>
                    </tr>
                </template>
                <tr>
                    <td>合计（元）</td>
                    <td :colspan="types.length*3+1">{{totalFee}}</td>
                </tr>
            </table>
        </div>
        <sunset-form-modal v-ref:formmodal :options="formModalOptions" @saved="saved"></sunset-form-modal>
    </sunset-layout>
</template>

<script>
    import TeamStore from '../team/TeamStore.js';
    import StatementStore from './StatementStore.js';

    export default {
        data() {
            return {
                types: ['CT', 'MR', 'DR'],
                prices: [],
                members: [],
                totalFee: 0,
                teamMap: {},
                currentTeam: null,
                currentFilter: null,
                filterOptions: {
                    fields: [{
                        name: 'teamId',
                        widget: 'select',
                        changeFilter: true,
                        defaultFirst: false,
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
                                    this.teamMap[c.teamId] = c;
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
                        placeholder: '日期区间',
                        name: 'date',
                        widget: 'date',
                        changeFilter: true,
                        default: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
                        type: 'daterange'
                    }],
                    format(filter) {
                        return {
                            teamId: filter.teamId,
                            startTime: Sunset.Dates.format(filter.date[0], 'yyyy-MM-dd 00:00:00'),
                            endTime: Sunset.Dates.format(filter.date[1], 'yyyy-MM-dd 23:59:59')
                        };
                    },
                    searchButton: {
                        color: 'primary',
                        label: '统计'
                    }
                },
                toolbarOptions: {
                    tools: [{
                        label: '设置价格',
                        color: 'success',
                        operate: () => {;
                            this.formModalOptions.title = `设置价格【${this.currentTeam.teamName}】`;
                            StatementStore.getPrice(this.currentTeam.teamId).then(res => {
                                var defaultPrice = res || {};
                                var model = {
                                    teamId: this.currentTeam.teamId
                                };
                                var prices = Object.keys(defaultPrice).map(type => {
                                    model[`${type}_0`] = defaultPrice[type] && defaultPrice[
                                        type][0] || 0;
                                    model[`${type}_1`] = defaultPrice[type] && defaultPrice[
                                        type][1] || 0;
                                });
                                this.$refs.formmodal.open(model);
                            });
                        }
                    }, {
                        label: '导出对账单',
                        color: 'info',
                        operate: () => {
                            var filter = this.currentFilter;
                            window.open(
                                `/manage-service/work_stats/team/total/bill/download?teamId=${filter.teamId}&startTime=${filter.startTime}&endTime=${filter.endTime}`
                            )
                        }
                    }]
                },
                formModalOptions: {
                    title: '设置阅片价格',
                    formOptions: {
                        cols: '2',
                        fields: (() => {
                            var fields = [];
                            var DICOM_TYPE = Sunset.Service.Dictionary.getEnums('DICOM_TYPE');
                            DICOM_TYPE.forEach(item => {
                                var type = item.value;
                                fields.push({
                                    group: `${type}单价`,
                                    label: '写价格',
                                    widget: 'number',
                                    digits : 2,
                                    append: '元',
                                    default: 0,
                                    name: `${type}_0`
                                });
                                fields.push({
                                    label: '审价格',
                                    widget: 'number',
                                    digits : 2,
                                    append: '元',
                                    default: 0,
                                    name: `${type}_1`
                                })
                            });
                            return fields;
                        })(),
                        tools: false,
                        format(model) {
                            var prices = {};
                            var teamId;
                            Object.keys(model).forEach(key => {
                                if (key == 'teamId') {
                                    teamId = model.teamId;
                                } else {
                                    var s = key.split('_');
                                    prices[s[0]] = prices[s[0]] || [];
                                    prices[s[0]][s[1]] = model[key];
                                }
                            });
                            return {
                                teamId,
                                prices: JSON.stringify(prices)
                            };
                        },
                        store: StatementStore,
                        method: 'savePrice'
                    }
                }
            }
        },
        methods: {
            statistics(filter) {
                if (!filter.teamId) {
                    Sunset.tip('请选择团队');
                    return;
                }
                this.currentFilter = filter;
                this.currentTeam = this.teamMap[filter.teamId];
                StatementStore.getPrice(filter.teamId).then(res => {
                    var defaultPrice = res || {};
                    var prices = [];
                    Object.keys(defaultPrice).forEach(type => {
                        if (defaultPrice[type] && (defaultPrice[type][0] > 0 || defaultPrice[type][1] >
                                0)) {
                            prices.push({
                                type: type,
                                writePrice: defaultPrice[type][0],
                                reviewPrice: defaultPrice[type][1]
                            });
                        }
                    });
                    this.prices = prices;
                });
                StatementStore.statistics(filter).then(res => {
                    if (res && res.data && res.data.length) {
                        this.types = res.data[0].details.map(item => item.deviceType);
                        this.members = res.data;
                        this.totalFee = res.totalFee || 0;
                    } else {
                        this.types = [];
                        this.members = [];
                    }
                });
            },
            saved() {
                Sunset.tip('价格修改成功', 'success');
                this.$refs.filter.search();
            }
        }
    }
</script>