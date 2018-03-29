<style lang="sass">
    .consult-process-container {
        .ivu-modal-body {
            padding: 0px;
        }
    }
</style>
<template>
    <sunset-layout title="专家咨询管理">
        <div class="consult-process-container">
            <sunset-crud :options="options"></sunset-crud>
            <sunset-view-modal v-ref:viewmodal :options="viewModalOptions" :consult="currentConsult">
                <process-detail :consult="currentConsult"></process-detail>
            </sunset-view-modal>
        </div>
    </sunset-layout>
</template>
<script>
    import ConsultStore from './ConsultStore.js';
    import HospitalStore from '../hospital/HospitalStore';
    import ProcessDetail from './ConsultProcessDetail.vue';

    const now = new Date().getTime();

    export default {
        components: {
            ProcessDetail
        },
        methods: {

        },
        data() {
            return {
                currentConsult: null,
                viewModalOptions: {
                    title: '咨询聊天记录'
                },
                options: {
                    title: '咨询流程',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '咨询标题',
                            name: 'diseaseDesc'
                        }, {
                            title: '咨询医生',
                            name: 'consultExpert.name',
                            style : 'width:120px;'
                        }, {
                            title: '消息数',
                            name: 'messageCount',
                            style : 'width:120px;'
                        }, {
                            title: '状态',
                            name: 'status',
                            enum: 'PATIENT_CONSULT_STATUS',
                            style : 'width:120px;'
                        }, {
                            title: '创建时间',
                            format: 'DATETIME',
                            name: 'createTime',
                            style : 'width:180px;'
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
                        toolbar: false,
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        recordTools: [{
                            label: '查看',
                            icon: 'eye',
                            color: 'info',
                            disabled(record) {
                                return record.messageCount == 0;
                            },
                            operate: (record) => {
                                this.viewModalOptions.title = `【咨询消息记录】${record.diseaseDesc}`;
                                this.currentConsult = record;
                                this.$refs.viewmodal.open();
                            },
                            permission: 'ConsultProcess_VIEW_MESSAGE'
                        }],
                        store: ConsultStore
                    },
                    //表格表单
                    formOptions: {}
                }
            }
        }
    };
</script>