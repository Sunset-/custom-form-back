<style lang="sass">
    .read-page-container {
        background: white;
        overflow: auto;
    }
</style>
<template>
    <div class="read-page-container">
        <Tabs :animated="false" v-show="tabStatus" :active-key="tabIndex">
            <Tab-pane label="报告查看" key="0">
                <read-page-detail :patient="patient" :report="report" :task="task" :customer="customer" :form-model="formModel" :tools="tools"
                    :back="goBack" :image-id="imageId" @reload="reload"></read-page-detail>
            </Tab-pane>
            <Tab-pane label="报告流程" key="1">
                <read-page-process :process-model="processModel" :image-id="imageId"></read-page-process>
            </Tab-pane>
        </Tabs>
        <div v-show="!tabStatus">
            <div v-show="tabIndex&&(tabIndex==0)">
            <read-page-detail :patient="patient" :report="report" :task="task" :customer="customer" :form-model="formModel"
                :tools="tools" :back="goBack" :image-id="imageId" :reject="reject" @reload="reload"></read-page-detail>
            </div>
            <div v-show="tabIndex&&(tabIndex==1)">
            <read-page-process :process-model="processModel" :image-id="imageId"></read-page-process>
            </div>
        </div>
    </div>
</template>
<script>
    //import SignStore from '../../sign/SignStore';

    import {
        TaskDetail,
        Report
    } from '../service';
    import ReadPageDetail from './ReadPageDetail';
    import ReadPageProcess from './ReadPageProcess';
    import {
        POSITIVE_NEGATIVE,
        BACK_REASON,
        REPORT_STATUS,
        OWNER_PRIVILEGE,
        CONSULTATION_MEMBER,
        TASK_TYPE,
        OWN_TYPE,
        REPORT_STATUS_TEXT
    } from '../config';
    import {
        getAttribute,
        dataAdapter
    } from '../util';

    import WriteReportFormDictionary from './WriteReportFormDictionary';
    // TabIndex
    export default {
        components: {
            ReadPageDetail,
            ReadPageProcess
        },
        props: {
            taskId: {
                default: ''
            },
            tabStatus: {
                default: true
            },
            tabIndex: {
                default: 0
            }, //0表示报告查看，1表示报告流程
            tools: {
                default: function () {
                    return {
                        goback: true,
                        print: true,
                        viewimage: true,
                        changeinfo: true
                    };
                }
            },
            back: {
                default: function () {
                    return function () {};
                }
            },
            reject: {
                default: function () {
                    return function () {};
                }
            }
        },
        data() {
            return {
                detailModel: {

                },
                processModel: {

                },
                imageId: "",
                formModel: {
                    show: '',
                    tip: '',
                    suggest: '',
                    positiveNegative: 'POSITIVE',
                    imageMark: '',
                    markCount: 0
                },
                patient: {},
                report: {},
                task: {},
                customer: {},
            };
        },
        watch: {
            taskId(newValue, oldValue) {
                if (!newValue) return newValue;
                this._getDetail(newValue);
                this._getLog(newValue);
                return newValue;
            }
        },
        methods: {
            reload(force) {
                if (force) {
                    if (this.taskId) {
                        this._getDetail(this.taskId);
                        this._getLog(this.taskId);
                    }
                } else {
                    this.taskId = '';

                }

            },
            goBack() {
                this.taskId = '';
                this.back(true);
            },
            _getLog(id) {
                Report.HISTORY({
                    taskId: id
                }).then((report) => {
                    Report.LOG({
                        taskId: id
                    }).then((res) => {
                        this.processModel = logHandle(report, res);
                    });
                });

                function logHandle(reportMap, logs) {
                    // var reportMap = {};

                    // reports && reports.forEach((item) => {
                    //     reportMap[item.id] = item;
                    // });
                    logs && logs.forEach((item) => {
                        let report = reportMap[item.reportId];
                        report = reportHandle(report);

                        switch (item.doWhat) {
                            case '写报告完成':
                                item.style = 'edit';
                                item.color = 'green';
                                item.report = report;
                                break;
                            case '修改报告完成':
                                item.style = 'edit';
                                item.color = 'green';
                                item.report = report;
                                break;
                            case '重写报告完成':
                                item.style = 'edit';
                                item.color = "green";
                                item.report = report;
                                break;
                            case '审核不通过':
                                item.style = 'close';
                                item.color = "red";
                                item.remark = `【驳回原因：${report.remark||'无'}】`;
                                break;
                            case '审核通过':
                                item.style = 'checkmark';
                                item.color = "green";
                                item.report = report;
                                break;
                            case '作废报告':
                                break;
                            default:
                                item.color = 'green';
                                item.report = report;
                        }

                        if (item.doWhat.indexOf('报告提交审核给') > -1) {
                            item.report = false;
                        }

                        if (item.doWhat.indexOf('保存并转发') > -1) {
                            // debugger;
                        }

                    });
                    return logs;
                }

                function reportHandle(report) {
                    if (report) {
                        report.markCount = 0;
                        // 标注
                        if (report.imageMark && report.imageMark != '{}') {
                            try {
                                let marks = JSON.parse(report.imageMark);
                                var markCount = 0;
                                for (var st in marks) {
                                    if (marks.hasOwnProperty(st)) {
                                        var se = marks[st];
                                        for (var img in se) {
                                            if (se.hasOwnProperty(img)) {
                                                var img = se[img];
                                                for (var fm in img) {
                                                    if (img.hasOwnProperty(fm)) {
                                                        markCount++; // += img[fm].length;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                report.marks = marks;
                                report.markImageCount = markCount;
                            } catch (e) {}
                            report.imageMark = report.marks || {};
                            report.markCount = report.markImageCount || 0;

                        }
                    }
                    return report;
                }
            },
            _getDetail(id) {
                TaskDetail.GET({
                    taskId: id
                }).then(res => {
                    if (res) {
                        this.patient = WriteReportFormDictionary.patient(res);
                        this.report = WriteReportFormDictionary.report(res);
                        this.imageId = this.patient.imageId;
                        this.task = WriteReportFormDictionary.task(res, {
                            UserId: this.USERID
                        });
                        this.$emit('base-load', {
                            type: this.patient.deviceType,
                            imageId: this.patient.imageId
                        });
                        this.customer = WriteReportFormDictionary.customer(res);
                        this.baseData = res;

                        this.detailModel.patient = this.patient;
                        this.detailModel.report = this.report;
                        this.detailModel.task = this.task;
                        this.detailModel.customer = this.customer;

                        let report = res.currentReport;
                        if (report) {

                            this.formModel.suggest = report.suggests

                            //标注shuliang

                            this.formModel.markCount = 0;

                            // 标注
                            if (report.imageMark && report.imageMark != '{}') {
                                try {
                                    let marks = JSON.parse(report.imageMark);
                                    var markCount = 0;
                                    for (var st in marks) {
                                        if (marks.hasOwnProperty(st)) {
                                            var se = marks[st];
                                            for (var img in se) {
                                                if (se.hasOwnProperty(img)) {
                                                    var img = se[img];
                                                    for (var fm in img) {
                                                        if (img.hasOwnProperty(fm)) {
                                                            markCount++; // += img[fm].length;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    report.marks = marks;
                                    report.markImageCount = markCount;
                                } catch (e) {}
                                this.formModel.imageMark = report.marks || {};
                                this.formModel.markCount = report.markImageCount || 0;
                            }

                            for (let key in POSITIVE_NEGATIVE) {
                                if (POSITIVE_NEGATIVE[key] == report.positiveNegative) {
                                    this.formModel.positiveNegative = key;
                                    break;
                                }
                            }
                            try {
                                this.formModel.show = report.imagingFinding;
                            } catch (e) {}
                            try {
                                this.formModel.tip = report.imagingTips;
                            } catch (e) {}

                            this.detailModel.formModel = this.formModel;
                        }
                    }

                });
            }
        },
        ready() {
            //SignStore.currentUser().then(res => {
                //if (res) {
                    // this.USER = res;
                    // this.USERID = res.account.id;

                    let id = this.$route.params.id;
                    if (id) {
                        this._getDetail(id);
                        this._getLog(id);
                    }
                //}
            //});
        }
    }
</script>