<template>
    <sunset-layout title="缴费查询">
        <sunset-crud :options="options"></sunset-crud>
    </sunset-layout>
</template>
<script>
    import PaymentStore from './PaymentStore.js';

    const now = new Date().getTime();

    export default {
        methods: {

        },
        data() {
            return {
                options: {
                    title: '停车缴费',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '车牌号',
                            name: 'plateNumber'
                        },{
                            title: '订单号',
                            name: 'orderNo'
                        }, {
                            title: '停车时长',
                            name: 'duration'
                        }, {
                            title: '总费用',
                            name: 'totalAmount'
                        },{
                            title: '缴费金额',
                            name: 'currentReceivable'
                        }, {
                            title: '入库时间',
                            format: 'DATETIME',
                            name: 'startTime'
                        }, {
                            title: '出库时间',
                            format: 'DATETIME',
                            name: 'endTime'
                        }, {
                            title: '状态',
                            name: 'status',
                            format(v){
                                return {
                                    '0' : '<span class="text-danger">未缴费</span>',
                                    '1' : '<span class="text-success">已缴费</span>',
                                    '2' : '<span class="text-disabled">未缴费，已过期</span>'
                                }[v];
                            }
                        }],
                        showIndex: true,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        format: {
                            list: 'rows',
                            count: 'count',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: {
                            align: 'left',
                            fields: [{
                                label: '缴费日期',
                                name: 'date',
                                widget: 'date',
                                type: 'daterange',
                                placement: 'bottom-start',
                                placeholder: '缴费日期区间',
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
                                label: '车牌号',
                                name: 'plateNumber',
                                widget: 'search',
                                placeholder: '车牌号'
                            }],
                            format(model) {
                                return {
                                    startTime: model.date && model.date[0],
                                    endTime: model.date && model.date[1] && (new Date(model.date[1].getTime() +
                                        86399999)),
                                    plateNumber: model.plateNumber
                                }
                            }
                        },
                        //数据条目操作
                        recordTools: false,
                        store: PaymentStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: PaymentStore,
                        fields: [{
                            label: '车牌号',
                            name: 'plateNumber',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '金额',
                            name: 'price',
                            widget: 'number',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '时间',
                            name: 'date',
                            widget: 'date',
                            type: 'daterange',
                            validate: {
                                required: true
                            }
                        }],
                        format: (model) => {
                            model.startTime = model.date[0];
                            model.endTime = model.date[1];
                            model.duration = model.endTime.getTime() - model.startTime.getTime();
                            model.accountId = 1;
                            model.orderNo = 'order_test_1';
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