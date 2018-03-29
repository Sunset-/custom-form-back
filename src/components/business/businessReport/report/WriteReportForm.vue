<style lang="sass">
    .write-report-form-page {
        padding: 10px;
        min-width: 600px;
        .write-report-form-view {
            background: #f5f7f9;
            position: relative;
            padding: 40px;
            margin-top: 5px;
            .report-title-mark {
                position: absolute;
                width: 100%;
                top: 0px;
                left: 0px;
                .report-marker-left {
                    left: 0px;
                    top: 1em;
                    position: absolute;
                    display: inline-block;
                    >span {
                        margin: 1em;
                        font-size: 1.2em;
                        color: #595959;
                    }
                }
                .report-marker-right {
                    display: inline-block;
                    position: absolute;
                    right: 0px;
                    top: 1em;
                }
            }
            .report-title {
                h1 {
                    text-align: center;
                    margin: 1em;
                    font-size: 2.4em;
                }
            }
            .report-base {
                span {
                    font-size: 1.1em;
                    display: inline-block;
                    min-width: 12em;
                    white-space: nowrap;
                    padding-bottom: .4em;
                }
            }
            .report-form {
                .report-form-label {
                    >strong {
                        font-size: 1.1em;
                    }
                }
                >div {
                    margin-top: 5px;
                    span,
                    p {
                        font-size: 1.1em !important;
                    }
                }
                .sunset-editor-container {
                    min-height: 170px;
                }
                .edui-editor-iframeholder {
                    min-height: 100px;
                }
                .edui-editor-bottomContainer {
                    display: none;
                }
                .report-form-item-label {
                    margin: 10px 0;
                }
            }
            .report-control {
                margin: 10px 0;
                button {
                    margin-bottom: 5px;
                    margin-right: 5px;
                }
            }
            .report-footer {
                >span {
                    color: #ff6600;
                }
                button {
                    float: right;
                }
            }
        }
    }
</style>

<template lang="html">

    <div class="write-report-form-page">
        <div class="write-report-form-header-buttons">
            <i-button type="error" style="float:right" @click="$refs.returnsendermodal.open();" v-if="!task.is_consultation_writer&&task.is_owner&&!task.finished">退回申请</i-button>
            <sunset-toolbar :options="topToolbar"></sunset-toolbar>
        </div>
        <div class="write-report-form-view">
            <div class="report-title-mark">
                <div class="report-marker-left">
                    <span>申请人：{{customer.apply_name}}</span>
                    <span>电话：{{customer.apply_phone}}</span>
                </div>
                <div class="report-marker-right">
                    <Tag type="border" color="green">{{REPORT_STATUS_TEXT[task.report_status||0]}}</Tag>

                    <Tag :type="(!task.is_high_risk)? 'border':'dot' " color="red" @click="markerRisk()">高危</Tag>
                    <Tag :type="(!task.is_knotty)? 'border': 'dot'" color="yellow" @click="markerKnotty()">疑难</Tag>
                </div>
            </div>
            <div class="report-title">
                <h1>{{customer.hospital_name}}</h1>
            </div>
            <div class="report-base">
                <span><strong>姓名：</strong>{{patient.name}}</span>
                <span><strong>性别：</strong>{{['男','女'][patient.sex||0]}}</span>
                <span><strong>年龄：</strong>{{patient.age}}</span>
                <span><strong>设备：</strong>{{patient.deviceType}}</span>
                <span><strong>科室：</strong>{{patient.office}}</span>
                <span><strong>床号：</strong>{{patient.bedNo}}</span>
                <span><strong>住院号：</strong>{{patient.hospictalNo}}</span>
                <span><strong>患者电话：</strong>13201656687</span>
                <span><strong>患者编号：</strong>{{patient.No}}</span>
                <span><strong>检查日期：</strong>{{patient.check_time|time 'yyyy-MM-dd'}}</span>
                <div class="">
                    <span><strong>检查部位与方法：</strong>{{patient.check_points}}[{{patient.check_method}}]</span>
                </div>
            </div>
            <div class="report-form">
                <div class="">
                    <label class="report-form-label"><strong>影像学表现：</strong></label>
                    <sunset-editor :readonly="!task.can_editor" :value.sync="formModel.show" toolbar="bold,italic,superscript,subscript,spechars"></sunset-editor>
                </div>
                <div class="">
                    <label class="report-form-label"><strong>影像提示：</strong></label>
                    <sunset-editor :readonly="!task.can_editor" :value.sync="formModel.tip" toolbar="bold,italic,superscript,subscript,spechars"></sunset-editor>
                </div>
                <div class="">
                    <label class="report-form-label"><strong>建议：</strong></label>
                    <i-input type="textarea" :disabled="!task.can_editor" :value.sync="formModel.suggest"></i-input>
                </div>
                <div class="report-form-item-label">
                    <label class="report-form-label"><strong>报告标签：</strong></label>
                    <Radio-group :model.sync="formModel.positiveNegative">
                        <template>
                            <Radio value="POSITIVE" :disabled="!task.can_editor">阳性</Radio>
                            <Radio value="NEGATIVE" :disabled="!task.can_editor">阴性</Radio>
                        </template>
                    </Radio-group>
                </div>

                <div class="report-message">
                    <div v-if="formModel.markCount">
                        标记影像共<span style="color:red">{{formModel.markCount}}</span>张
                    </div>
                </div>
                <div v-if="report.reject_message">
                    <span style="color:red"><strong>报告已被驳回,驳回原因:</strong> {{report.reject_message}}</span>
                </div>
            </div>

            <div class="report-control">
                <sunset-toolbar :options="formToolbar"></sunset-toolbar>
            </div>
            <div class="report-footer">
                <i-button type="warning" @click="$emit('template-save', formModel);">存为模板</i-button>
                <span>* 提示：专家回复意见仅供患者及临床医师参考，不做任何法律依据。</span>
            </div>
        </div>
    </div>
    <sunset-table-modal v-ref:teammodal :options="selectDocterModel"></sunset-table-modal>
    <sunset-form-modal v-ref:rejectmodal :options="rejectFormModel"></sunset-form-modal>
    <sunset-form-modal v-ref:returnsendermodal :options="returnFormModel"></sunset-form-modal>
    <sunset-view-modal v-ref:historymodal :options="viewHistoryModel">
        <report-history></report-history>
    </sunset-view-modal>
    <sunset-view-modal v-ref:descriptionmodal :options="viewDescriptionModel">
        <patient-description :message="patient.check_describe" :other-files="patient.check_imgs"></patient-description>
    </sunset-view-modal>

    <sunset-view-modal v-ref:highriskmodal :options="viewHightRiskModel">
        <high-risk-tip :ok="_markerRiskOk" :cancel="$refs.highriskmodal.cancel"></high-risk-tip>
    </sunset-view-modal>

    <sunset-view-modal v-ref:consultationmodal :options="viewDescriptionModel">
        <consultation-suggests :list="report.consultations"></consultation-suggests>
    </sunset-view-modal>

</template>

<script>
    import {
        TaskDetail,
        Report,
        Team
    } from '../service';
    import SignStore from '../../sign/SignStore';
    import CaseStore from '../clouddisk/CloudImageStore';


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

    import ReportHistory from './ReportHistory';
    import PatientDescription from './PatientDescription';
    import HighRiskTip from './subComponent/HighRiskTip';
    import WriteReportFormDictionary from './WriteReportFormDictionary';
    import ConsultationSuggests from './ConsultationSuggests';

    import AuthorityHandle from './WritePage/authorityHandle';



    window.CateyesPubSub = window.CateyesPubSub || $({});


    export default {
        components: {
            ReportHistory,
            PatientDescription,
            HighRiskTip,
            ConsultationSuggests
        },
        data() {
            var self = this;
            return {
                USERID: "",
                TASKID: this.$route.params.id || '',
                topToolbar: [{
                    label: '原始报告',
                    color: 'info',
                    premise: () => {
                        return !!this.report.have;
                    },
                    operate: () => {
                        this.$refs.historymodal.open();
                    }
                }, {
                    label: '病情描述',
                    color: 'success',
                    operate: () => {
                        this.$refs.descriptionmodal.open();
                    }
                }, {
                    label: '打开影像',
                    color: 'info',
                    premise: () => {
                        return !!this.report.have;
                    },
                    operate: () => {
                        Base.openCateyes(this.patient.imageId);
                    }
                }, {
                    label: '会诊意见',
                    color: 'warning',
                    premise: () => {
                        return false && !!this.task.is_consultation;
                    },
                    operate: () => {
                        this.$refs.consultationmodal.open();
                    }
                }],

                formToolbar: [{
                    label: '提交会诊意见',
                    color: 'primary',
                    premise: () => {
                        return false && self.reportControlButtonShow("CONSULTATION_REPORT");
                    },
                    operate: () => {
                        this.ReportConsultationReport();
                    }
                }, {
                    label: '审核通过(自)',
                    color: 'primary',
                    premise: () => {
                        return this.reportControlButtonShow("REPLY_REVIEW");
                    },
                    operate: () => {
                        this.ReportReviewSelf();
                    },
                }, , {
                    label: '审核通过',
                    color: 'primary',
                    premise: () => {
                        return this.reportControlButtonShow("REVIEW");
                    },
                    operate: () => {
                        this.ReportReview();
                    },
                }, {
                    label: '提交审核',
                    color: 'info',
                    premise: () => {
                        return this.reportControlButtonShow("SUBMIT");
                    },
                    operate: () => {
                        this.ReportWrite();
                    }
                    // operate: () => {
                    //     this.memberFilter = item => {
                    //         if (item.accountId == this.USERID || Math.min(item.weakPrivilege, item.strongPrivilege) <
                    //             3) {
                    //             return false;
                    //         }
                    //         return true
                    //     }
                    //     //选择审核医生
                    //     this.selectDocterModel.checked.multi = false;
                    //     this.$refs.teammodal.open(null, null, true).then(this.ReportWrite);
                    // },
                }, {
                    label: '保存并转发',
                    color: 'warning',
                    premise: () => {
                        return this.reportControlButtonShow("FORWARD");
                    },
                    operate: () => {
                        this.memberFilter = item => {
                            if (item.accountId != this.USERID) {
                                if (this.task.report_status == 4) {
                                    return false;
                                }
                                if (this.task.report_status == 3 && Math.min(item.weakPrivilege, item.strongPrivilege) <
                                    3) {
                                    return false;
                                }
                                return true;
                            }
                        }
                        this.selectDocterModel.checked.multi = false;
                        this.$refs.teammodal.open(null, null, true).then(this.ReportForward);
                    },
                }, {
                    label: '影像会诊',
                    color: 'primary',
                    premise: () => {
                        return false && this.reportControlButtonShow("CONSULTATION");
                    },
                    operate: () => {
                        this.selectDocterModel.checked.multi = true;
                        this.memberFilter = item => {
                            if (item.accountId == this.USERID) {
                                return false;
                            }
                            return true
                        }
                        this.$refs.teammodal.open(null, null, true).then(this.ReportConsultation);
                    },
                }, {
                    label: '驳回',
                    color: 'error',
                    premise: () => {
                        return this.reportControlButtonShow("REJECT");
                    },
                    operate: () => {
                        this.$refs.rejectmodal.open();
                    },
                }],
                REPORT_STATUS_TEXT,
                rejectFormModelShow: false,
                rejectFormModel: {
                    title: '驳回报告',
                    formOptions: {
                        cols: '1',
                        fields: [{
                            label: '驳回原因',
                            name: 'message',
                            widget: 'textarea',
                            validate: {
                                required: true
                            },
                            data: {

                            }
                        }],
                        tools: false,
                        store: {
                            save: this.ReportReject,
                        }
                    }
                },
                selectDocterModel: {
                    title: '医生列表',
                    checked: {
                        multi: false,
                        label: 'memberName',
                        max: 9999,
                    },
                    tableOptions: {
                        columns: [{
                            title: '姓名',
                            name: 'memberName'
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: true,
                        multiCheck: false,
                        sortable: true,
                        idKey: 'accountId',
                        format: {
                            list: '',
                            count: 'length',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },

                        datasource: () => {
                            return this._selectMemberTeam().then(res => {
                                if (this.memberFilter) {
                                    return res.filter(this.memberFilter);
                                } else {
                                    return res;
                                }
                            });
                        }
                    }
                },
                returnFormModel: {
                    title: '退回申请',
                    formOptions: {
                        cols: '1',
                        fields: [{
                            label: '退回原因',
                            name: 'reasonType',
                            widget: 'select',
                            valuePlace: '',
                            textPlace: '',
                            data: BACK_REASON,
                            validate: {
                                required: true
                            }
                        }, {
                            label: '说明',
                            name: 'reason',
                            widget: 'textarea',
                            validate: {
                                required: true
                            }
                        }],
                        tools: false,
                        submit(model) {
                            let options = {
                                taskId: self.TASKID,
                                reasonType: model.reasonType,
                                reason: model.reason
                            };
                            TaskDetail.RETURN_SENDER(options).then(res => {
                                Sunset.tip('报告退回成功', 'success');
                                self.operateFinish(true);

                                self.$refs.returnsendermodal.cancel();
                            });
                        }
                    }
                },
                viewHistoryModel: {
                    title: '原始报告',
                },
                viewDescriptionModel: {
                    title: '病情描述'
                },
                viewHightRiskModel: {
                    title: '影像科危急值报告范围说明',
                    toolbar: false
                },
                USER: {},
                baseData: {},
                task: {},
                report: {},
                patient: {},
                customer: {},
                formModel: {
                    show: '',
                    tip: '',
                    suggest: '',
                    positiveNegative: 'POSITIVE',
                    imageMark: '',
                    markCount: 0
                }
            };
        },
        methods: {
            selectTemplate(options) {

                this.formModel.show = this.formModel.show + options.description;
                this.formModel.tip = this.formModel.tip + options.contents;

                for (let key in POSITIVE_NEGATIVE) {
                    if ((POSITIVE_NEGATIVE[key] - 2) == options.isNormal) {
                        if (this.formModel.positiveNegative != 'NEGATIVE') {
                            this.formModel.positiveNegative = key;
                        }
                    }
                }
            },
            reportControlButtonShow(button) {
                let type = button.alias || button;


                if (!this.baseData || !this.baseData.task) {
                    return false;
                }
                let _dictionary = {
                    is_owner: 'task.is_owner',
                    is_team: 'task.is_team',
                    is_consultation: 'task.is_consultation',
                    report_status: 'task.report_status',
                    is_double_sign: 'task.is_double_sign',
                    own_privilege: 'task.owner_privilege',
                    is_consultation_submiter: 'task.is_consultation_submiter',
                    is_consultation_writer: 'task.is_consultation_writer',
                    task_status: 'task.status',
                    is_abandon: 'task.is_abandon'
                };

                let c = {};
                dataAdapter(_dictionary, c, this);

                c.report_status = c.report_status || 0;
                c.is_not_owner = !c.is_owner;
                c.is_not_team = !c.is_team;
                c.is_not_consultation = !c.is_consultation;
                return AuthorityHandle(c, type);
            },


            ReportReviewSelf() {
                var options = this._getOptions(true);
                if (!options) {
                    return;
                }
                if (this.task.owner_id != this.USERID) {
                    options = {
                        reportId: this.report.id,
                        reviewerId: this.USERID
                    };
                } else {
                    options.reviewerAccountId = this.USERID;
                }
                let clear = Sunset.confirm({
                    content: '请确认审核通过此报告',
                    loading: true,
                    onOk: () => {
                        Report.WRITE(options).then(res => {
                            clear();
                            Sunset.tip('审核成功', 'success');
                            this._refreshData();
                            setTimeout(() => {
                                this.operateFinish(true);
                            }, 1000);
                        }).catch(clear);
                    }
                });
            },
            ReportReview() {
                let options = this._getOptions(true);
                if (!options) {
                    return;
                }
                options.reviewerAccountId = this.USERID;
                let clear = Sunset.confirm({
                    content: '请确认审核通过此报告',
                    loading: true,
                    onOk: () => {
                        Report.REVIEW(options).then(res => {
                            clear();
                            Sunset.tip('审核成功', 'success');
                            this._refreshData();
                            setTimeout(() => {
                                this.operateFinish(true);
                            }, 1000);

                        }).catch(clear);
                    }
                });
            },
            ReportWrite(data) {
                // this.$refs.teammodal.cancel();
                let options = this._getOptions(true);
                if (!options) {
                    return;
                }
                // options.reviewerAccountId = data[0].accountId;
                let clear = Sunset.confirm({
                    content: `请确认将此报告提交审核`,
                    loading: true,
                    onOk: () => {
                        Report.WRITE(options).then(res => {
                            clear();
                            Sunset.tip('提交成功', 'success');
                            this._refreshData();
                            setTimeout(() => {
                                this.operateFinish(true);
                            }, 1000);


                        }).catch(clear);
                        return true;
                    }
                });
            },
            CloseWritePage() {
                let clear = Sunset.confirm({
                    content: `请确认关闭写报告页面`,
                    loading: true,
                    onOk: () => {
                        window.close();
                        return true;
                    },
                    onCancel: () => {
                        if (this.TASKID && this.TASKID != "SPACE") {
                            SignStore.currentUser().then(res => {
                                this.USER = res;
                                this._getDetail(this.TASKID);

                            });
                        }
                    }
                });
            },
            ReportConsultation(data) {
                if (!data || data.lenth < 1) {
                    return false
                }
                this.$refs.teammodal.cancel();
                let options = {
                    taskId: this.TASKID,
                    doctorExpertIds: {}
                };

                let names = [];
                data.forEach(item => {
                    options.doctorExpertIds[item.accountId] = '2';
                    names.push(item.memberName);
                });
                let clear = Sunset.confirm({
                    content: `请确认${names.join(',')}参加会诊`,
                    loading: true,
                    onOk: () => {
                        Report.CONSULTATION(options).then(res => {
                            clear();
                            Sunset.tip('邀请会诊成功', 'success');
                            this._refreshData();

                        }).catch(clear);
                        return true;
                    }
                });
            },
            ReportConsultationReport() {
                let options = this._getOptions(true);
                if (!options) {
                    return;
                }
                let clear = Sunset.confirm({
                    content: `请确认提交报告`,
                    loading: true,
                    onOk: () => {
                        Report.REPLY_REPORT(options).then(res => {
                            clear();
                            Sunset.tip('提交成功', 'success');
                            this._refreshData();
                            setTimeout(() => {
                                this.operateFinish(true);
                            }, 1000);

                        }).catch(clear);
                        return true;
                    }
                });
            },
            ReportForward(data) {
                if (!data || data.lenth < 1) {
                    return false
                }
                this.$refs.teammodal.cancel();

                let options = this._getOptions();
                if (!options) {
                    return;
                }

                options = {
                    reportFlow: JSON.stringify(options),
                    newProcessor: data[0].accountId
                };
                let clear = Sunset.confirm({
                    content: `请确认转发此报告给${data[0].memberName}`,
                    loading: true,
                    onOk: () => {
                        Report.SAVE_FORWARD(options).then(res => {
                            clear();
                            Sunset.tip('转发成功', 'success');
                            this._refreshData();
                            setTimeout(() => {
                                this.operateFinish(true);
                            }, 1000);
                        }).catch(clear);
                        return true;
                    }
                });

                return true;
            },
            ReportReject(model) {
                this.$refs.rejectmodal.cancel();
                let options = {
                    reportId: this.report.id,
                    isPass: false,
                    remark: model.message || ''
                };

                let clear = Sunset.confirm({
                    content: `请确认要驳回报告`,
                    loading: true,
                    onOk: () => {
                        Report.REJECT(options).then(res => {
                            clear();
                            Sunset.tip('驳回成功', 'success');
                            this._refreshData();
                            setTimeout(() => {
                                this.operateFinish(true);
                            }, 1000);
                        }).catch(clear);
                    }
                });
            },
            markerKnotty() {
                if (this.task.is_finished) {
                    return;
                }
                let clear = Sunset.confirm({
                    content: `确定将此片标记为疑难片（将提醒医院延长报告时间）？`,
                    loading: true,
                    onOk: () => {
                        Report.MARK_KNOTTY({
                            taskId: this.TASKID
                        }).then(res => {
                            clear();
                            Sunset.tip('标记成功', 'success');
                            this.task.is_knotty = true;
                        }).catch(clear);
                    }
                });
            },
            markerRisk() {
                if (this.task.is_finished) {
                    return;
                }
                this.$refs.highriskmodal.open();
            },
            _markerRiskCancel() {
                this.$refs.highriskmodal.cancel();
            },
            _markerRiskOk() {
                let options = {
                    taskId: this.TASKID,
                    taskProperty: '32'
                };
                Report.MARK_HIGH_RISK(options).then(res => {
                    this.$refs.highriskmodal.cancel();
                    Sunset.tip('高危标记成功', 'success');
                    this.task.is_high_risk = true;
                });
            },
            _getDetail(id) {

                TaskDetail.GET({
                    taskId: id
                }).then(res => {
                    if (res) {

                        this.patient = WriteReportFormDictionary.patient(res);
                        this.report = WriteReportFormDictionary.report(res);
                        this.task = WriteReportFormDictionary.task(res, {
                            UserId: this.USERID
                        });

                        if(this.task.can_editor){
                            Report.LOCK_NEW({taskId:id}).then(res=>{
                                console.dir(res);
                            });
                        }
                        
                        this.$emit('base-load', {
                            type: this.patient.deviceType,
                            imageId: this.patient.imageId
                        });
                        this.customer = WriteReportFormDictionary.customer(res);

                        this.baseData = res;
                        this._initCachRefresher();
                        let report = res.currentReport;
                        let self = this;
                        window.CateyesPubSub.on('AFTER_CATEYES_MARK', function (e, count) {
                            self.formModel.markCount = count;
                            let marks = window.CateyesPubSub.getAllMarks();
                            self.formModel.imageMark = marks;
                        });

                        if (report) {

                            this.formModel.suggest = report.suggests;

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


                            window.CateyesPubSub.replyMarks = report.marks;


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
                        }
                        this._initLockRefresher(this.task.is_owner);
                        // this._initCachRefresher();

                        this.$emit('BASEDATA_READY', res);
                    }

                });
            },


            /**
             * 操作成功
             */

            _selectMemberTeam(num) {
                let options = {};
                let expert = getAttribute(this.baseData, 'expert');

                if (expert && expert.expertId) {
                    options.id = expert.expertId;
                    // options.weakPrivilege = 1;
                    return Team.SELECT_MEMBER_TEAM(options);
                }
                return new Promise((resolve, reject) => {});
            },
            _getOptions(focus) {
                let options = {};
                options = {
                    // cacheOwnerId:this.USERID,
                    workTaskId: this.TASKID,
                    imagingFinding: this.formModel.show,
                    imagingTips: this.formModel.tip,
                    positiveNegative: POSITIVE_NEGATIVE[this.formModel.positiveNegative],
                    suggests: this.formModel.suggest,
                    imageMark: '{}',
                };
                try {
                    let marks = window.CateyesPubSub.getAllMarks();
                    options.imageMark = marks ? JSON.stringify(marks) : '{}';
                } catch (e) {
                    console.error(e);
                }

                if (focus) {
                    if (!options.imagingFinding) {
                        Sunset.tip('未填写影像学表现', 'error');
                        options = null;
                    }

                    if (!options.imagingTips) {
                        Sunset.tip('未填写影像提示', 'error');
                        options = null;
                    }

                    if (!options.positiveNegative) {
                        Sunset.tip('未选择阴阳性', 'error');
                        options = null;
                    }

                }
                return options;
            },
            _refreshData() {

                if (this.TASKID && this.TASKID != "SPACE") {
                    SignStore.currentUser().then(res => {
                        this.USER = res;
                        this.USERID = res.account.id;

                        this._getDetail(this.TASKID);
                    });
                }
            },

            _initLockRefresher(flag) {
                var taskId = this.TASKID;

                this.timer && clearTimeout(this.timer);
                if (flag !== false) {

                    this.timer = setInterval(() => {
                        Report.LOCK({
                            taskId
                        });
                    }, 10000);
                }
            },

            _initCachRefresher(flag) {
                var taskId = this.TASKID;
                //定时缓存
                this.cacheTimer && clearTimeout(this.cacheTimer);
                //定时缓存
                var cacheModal = localStorage.getItem('CACHE_REPORT_' + taskId + '_' + this.USERID);
                if (cacheModal) {
                    try {
                        let model = JSON.parse(cacheModal);
                        this.formModel = model.formModel;
                        window.CateyesPubSub.replyMarks = this.formModel.imageMark;
                    } catch (e) {
                        console.error(e);
                    }
                }
                this.cacheTimer = setInterval(() => {
                    var model = {
                        formModel: this.formModel
                    };
                    try {
                        let marks = window.CateyesPubSub.getAllMarks();
                        model.formModel.imageMark = marks || {};
                    } catch (e) {
                        console.error(e);
                    }
                    localStorage.setItem('CACHE_REPORT_' + taskId + '_' + this.USERID, JSON.stringify(model));
                }, 2000);
            },

            clearCache() {
                clearTimeout(this.cacheTimer);
                localStorage.removeItem('CACHE_REPORT_' + this.TASKID);
            },

            operateFinish(type) {
                this.parentWindow && this.parentWindow.postMessage('SUNSET_REFRESH_CONSULT', '/');

                if (type) {
                    let clear = Sunset.confirm({
                        content: '报告已处理完成，点击确定关闭本页面',
                        loading: true,
                        onOk: () => {
                            clear();
                            window.close();
                            return true;
                        }
                    });
                }
            }

        },
        events: {
            BASEDATA_READY(res) {
                if (this.patient) {
                    document.title =
                        `${this.patient.age} ${['男', '女'][this.patient.sex || 0]} ${this.patient.deviceType}`
                }
                this._selectMemberTeam();
            }
        },

        ready() {

            let self = this;
            window.addEventListener('message', function (e) {
                let data = e.data || "";
                switch (data) {
                    case "SUNSET_CONNECT":
                        self.parentWindow = e.source;
                        e.source.postMessage('SUNSET_CONNECTED', '/');
                        break;
                }
            }, false);
            window.onbeforeunload = function () {
                self.parentWindow && self.parentWindow.postMessage('SUNSET_REFRESH_CONSULT', '/');
            };
            this._refreshData();
        }
    }
</script>