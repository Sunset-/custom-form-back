<style lang="sass">
    .read-page-detail-container {
        padding: 10px;
        #report-page {
            >section {
                margin: 5mm auto;
            }
        }
    }
</style>
<template>
    <div class="read-page-detail-container">
        <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
        <sunset-toolbar :options="toolbarRightOptions" style="float:right"></sunset-toolbar>

        <div id="report-page">
            <style lang="css">
                .macl-print-sheet {
                    overflow: hidden;
                    position: relative;
                    box-sizing: border-box;
                    page-break-after: always;
                    background: white;
                    margin: 5mm;
                }
                #report-page{
                    font-family: SimSun;
                }
                @media screen {
                    .macl-print-sheet {
                        background: white;
                        box-shadow: 0 .5mm 2mm rgba(0, 0, 0, .3);
                        margin: 5mm;
                    }
                    .macl-print-padding-10mm {
                        padding: 10mm;
                    }
                    .macl-print-A4 {
                        width: 230mm;
                    }
                    .macl-print-main {
                        min-height: 196mm;
                    }
                    <!--.macl-print-no {
                        display: none;
                    }
                    -->div,
                    p,
                    span,
                    h1,
                    h2,
                    h3,
                    h4,
                    h5 {
                        color: black;
                    }
                }

                @media print {
                    .macl-print-A4 {
                        width: 210mm;
                    }
                    .macl-print-padding-10mm {
                        padding: 0mm;
                    }
                    .macl-print-no {
                        display: none;
                    }
                    .macl-print-main {
                        min-height: 196mm;
                        p,
                        span {
                            orphans: 3;
                            widows: 2;
                        }
                    }
                }

                .macl-print-text-center {
                    text-align: center;
                }

                .macl-print-h1 {
                    margin-top: 5mm;
                    font-size: 10mm;
                }

                .macl-print-h3 {
                    font-size: 8mm;
                    margin-bottom: 8mm;
                }

                .macl-print-span {
                    font-size: 5mm;
                }

                .macl-print-h6 {
                    font-size: 4mm;
                }

                .macl-print-h7 {
                    font-size: 3mm;
                }

                .macl-print-shout-span span {
                    display: inline-table;
                    min-width: 47mm;
                }

                .macl-print-long-span span {
                    display: inline-table;
                    min-width: 60mm;
                }

                .macl-print-span-div {
                    font-size: 5mm;
                    font-weight: 700;
                    margin-top: 4mm;
                }

                .macl-print-stage {
                    text-indent: 12mm;
                }

                .macl-print-sheet p {
                    margin: 0;
                }

                .macl-print-right {
                    float: right;
                }

                .macl-print-left {
                    position: absolute;
                }

                .macl-print-left img {
                    width: 100px;
                    height: 100px;
                    background: #ccc;
                    border: 1px solid #ccc;
                }

                .macl-print-left div {
                    margin-top: -5px;
                    height: 100%;
                    background: #5cadff;
                    color: white;
                    text-align: center;
                }

                .macl-print-mark {
                    position: relative;
                    display: block;
                }

                .macl-print-clearfix {
                    clear: both;
                }

                .macl-print-image {
                    right: 50px;
                    width: 150px;
                    height: 150px;
                }

                .macl-print-report-status {
                    width: 35mm;
                    height: 35mm;
                    border: 2mm solid #ccc;
                    border-radius: 35mm;
                    text-align: center;
                    position: absolute;
                    bottom: 40mm;
                    right: 30mm;
                    font-size: 5mm;
                    line-height: 32mm;
                    animation: markMove 2s infinite;
                    text-shadow: 0px 0px 2px #999;
                }

                .macl-print-img {
                    width: 100px;
                    height: 100px;
                    margin: 2px;
                    padding: 2px;
                    border: 1px solid #ccc;
                }

                @keyFrames markMove {
                    0% {
                        transform: rotate(30deg);
                        box-shadow: 0px 0px 10px red, 0px 0px 5px rgba(0, 0, 255, 0.5) inset;
                    }
                    50% {
                        transform: rotate(-30deg);
                        box-shadow: 0px 0px 10px green, 0px 0px 5px rgba(0, 255, 0, 0.5) inset;
                    }
                    100% {
                        transform: rotate(30deg);
                        box-shadow: 0px 0px 10px blue, 1px 0px 5px rgba(255, 0, 0, 0.5) inset;
                    }
                }
            </style>


            <section class="macl-print-sheet macl-print-padding-10mm macl-print-A4" class="report-page">
                <!-- Write HTML just like a web page -->
                <div class="macl-print-mark macl-print-no ">
                    <div class="macl-print-left " @click="view(imageId)" style="cursor:pointer">
                        <img class="macl-print-no " :src="patient.imageId|dicom-thumbnail" alt="">
                        <div class="macl-print-no ">查看图片</div>
                    </div>
                    <div class="macl-print-right">
                        <Tag type="border" class="macl-print-no">{{REPORT_STATUS_TEXT[report.status||0]}}</Tag>
                        <Tag type="border" color="green" class="macl-print-no" v-if="task.is_knotty">疑难</Tag>
                        <Tag type="border" color="red" class="macl-print-no">{{{POSITIVE:'阳性',NEGATIVE:'阴性'}[formModel.positiveNegative]}}</Tag>
                    </div>
                    <div class="macl-print-clearfix"></div>

                </div>
                <article>
                    <div class="macl-print-section macl-print-text-center">
                        <div class="macl-print-h1">{{customer.hospital_name}}</div>
                        <div class="macl-print-h3">{{patient.deviceType | DeviceSubTitle}}</div>
                    </div>
                    <div class="macl-print-section">
                        <div class="macl-print-long-span">
                            <span class="macl-print-span">姓名:{{patient.name}}</span>
                            <span class="macl-print-span">性别:{{['男','女'][patient.sex||0]}}</span>
                            <span class="macl-print-span">年龄:{{patient.age}}岁</span>
                            
                            <span class="macl-print-span">设备:{{patient.deviceType}}</span>
                            <span class="macl-print-span">科室:{{patient.office}}</span>
                            <span class="macl-print-span">患者编号:{{patient.No}}</span>
                            
                            <span class="macl-print-span">检查日期:{{patient.check_time|time 'yyyy-MM-dd'}}</span>
                            <span class="macl-print-span">床号:{{patient.bedNo}}</span>
                            <span class="macl-print-span">住院号:{{patient.hospictalNo}}</span>
                        </div>
                        <hr/>
                    </div>
                    <div class="macl-print-section">
                        <div class="macl-print-span-div">检查部位与方法:<span class="macl-print-span">{{patient.check_points}}[{{patient.check_method}}]</span></div>
                    </div>

                    <div class="macl-print-section macl-print-no" v-if="patient.check_imgs">
                        <div class="macl-print-span-div">
                            附件:
                            <div class="macl-print-span">
                                <img class="macl-print-img viewer-image" group="cloud-image-otherfile" v-for="f in patient.check_imgs&&patient.check_imgs.split(',')"
                                    :src="f | upload-image" />
                            </div>
                        </div>
                    </div>
                    <div class="macl-print-main">
                        <div :id="'macl-print-main-'+task.id">
                            <div class="macl-print-section" v-if="formModel.show">
                                <div class="macl-print-span-div">影像学表现</div>
                                <span class="macl-print-span macl-print-stage">{{{formModel.show}}}</span>
                            </div>
                            <div class="macl-print-section" v-if="formModel.tip">
                                <div class="macl-print-span-div">影像学提示</div>
                                <span class="macl-print-span macl-print-stage">{{{formModel.tip}}}</span>
                            </div>
                            <div class="macl-print-section" v-if="!formModel.tip&&!formModel.show">
                                <div class="macl-print-span-div" style="text-align:center">未处理</div>
                            </div>
                        </div>

                        <div class="macl-print-section macl-print-no" v-if="formModel.suggest">
                            <div class="macl-print-span-div">建议</div>
                            <span class="macl-print-span macl-print-stage">{{formModel.suggest}}</span>
                        </div>
                        <div class="macl-print-section macl-print-no" v-if="formModel.markCount">
                            <div class="macl-print-span-div">标记:<span class="macl-print-span" style="color:#39f;cursor:pointer;font-size:1em;text-decoration:underline"
                                    @click="viewImageMark(formModel)">共{{formModel.markCount}}张</span></div>
                        </div>
                    </div>

                    <div class="macl-print-section macl-print-no ">
                        <div class="macl-print-right">
                            <img class="macl-print-image" v-if="report.status==4" src="/assets/img/report-pass.png">
                        </div>
                        <div class="macl-print-clearfix"></div>
                    </div>
                    <div class="macl-print-section">
                        <div class="macl-print-footer">
                            <span class="macl-print-h6"> 报告医生:<span v-if="(report.status==3)||(report.status==4)">{{report.write_name}}</span><span>
                            <span class="macl-print-h6" style="float:right" >审核医生:<span v-if="report.status==4">{{report.review_name}}</span></span>
                            <hr/>
                            <span class="macl-print-h6" style="float:right">报告时间:{{report.review_time|time 'yyyy-MM-dd'}}</span>
                            <p class="macl-print-h7">此报告仅供本院临床医生参考，结论只对本次检查有效。</p>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    </div>

    <sunset-form-modal v-ref:reportBase :options="reportBaseModel"></sunset-form-modal>

</template>
<script>
    // -----------------------------------------------------------------------
    // Eros Fratini - eros@recoding.it
    // jqprint 0.3
    //
    // - 19/06/2009 - some new implementations, added Opera support
    // - 11/05/2009 - first sketch
    //
    // Printing plug-in for jQuery, evolution of jPrintArea: http://plugins.jquery.com/project/jPrintArea
    // requires jQuery 1.3.x
    //
    // Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
    //------------------------------------------------------------------------

    (function ($) {
        var opt;

        $.browser = {};

        $.fn.jqprint = function (options) {
            opt = $.extend({}, $.fn.jqprint.defaults, options);

            var $element = (this instanceof jQuery) ? this : $(this);

            if (opt.operaSupport && $.browser.opera) {
                var tab = window.open("", "jqPrint-preview");
                tab.document.open();

                var doc = tab.document;
            } else {
                var $iframe = $("<iframe  />");

                if (!opt.debug) {
                    $iframe.css({
                        position: "absolute",
                        width: "0px",
                        height: "0px",
                        left: "-600px",
                        top: "-600px"
                    });
                }

                $iframe.appendTo("body");
                var doc = $iframe[0].contentWindow.document;
            }

            if (opt.importCSS) {
                if ($("link[media=print]").length > 0) {
                    $("link[media=print]").each(function () {
                        doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") +
                            "' media='print' />");
                    });
                } else {
                    $("link").each(function () {
                        doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") +
                            "' />");
                    });
                }
            }

            if (opt.printContainer) {
                doc.write($element.outer());
            } else {
                $element.each(function () {
                    doc.write($(this).html());
                });
            }

            doc.close();
            (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow).focus();
            setTimeout(function () {
                var client_window = (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow);
                var printMain = client_window.document.getElementById(`macl-print-main-${opt.taskId}`)
                console.dir(printMain.clientHeight);
                var page = parseInt((printMain.clientHeight - 750) / 1152 + 1);
                console.dir(page);
                printMain.style.height = 751 + 1195 * page;
                client_window.print();
                if (tab) {
                    tab.close();
                }
            }, 1000);
        }

        $.fn.jqprint.defaults = {
            debug: false,
            importCSS: true,
            printContainer: true,
            operaSupport: true
        };

        // Thanks to 9__, found at http://users.livejournal.com/9__/380664.html
        jQuery.fn.outer = function () {
            return $($('<div></div>').html(this.clone())).html();
        }
    })($);
    // import 'paper-css/paper.css';
    // import printHtmlElement from 'print-html-element';

    // import '../../../vendor/typeplate.css';

    import {
        REPORT_STATUS_TEXT
    } from "../config";
    //import SignStore from '../../sign/SignStore';
    import {
        Report
    } from '../service';
    export default {
        name: "ReadPageDetail",
        props: {
            detailModel: {
                default: function () {
                    return {};
                }
            },
            patient: {},
            task: {},
            report: {},
            customer: {},
            formModel: {},
            tools: {
                default: function () {
                    return {
                        goback: true, //回退
                        print: true, //打印
                        viewimage: true, //查看图像
                        reject: true, //作废
                        addcenter: true,
                        changeinfo: true
                    };
                }
            },
            back: {
                default: function () {
                    return function () {}
                }
            },
            imageId: {
                default: ''
            },
            reject: {
                default: function () {}
            }
        },
        data() {
            var self = this;
            return {
                reportBaseModel: {
                    title: '修改',
                    formOptions: {
                        cols: "2",
                        fields: [{
                            label: '姓名',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '性别',
                            name: 'sex',
                            widget: 'radio',
                            valuePlace: 'key',
                            textPlace: 'value',
                            data: [{
                                key: '0',
                                value: '男'
                            }, {
                                key: '1',
                                value: '女'
                            }],
                        }, {
                            label: '年龄',
                            name: 'age',
                            widget: 'input',

                        }, {
                            label: '申请科室',
                            name: 'office',
                            widget: 'input',

                        }, {
                            label: '住院号',
                            name: 'hospictalNo',
                            widget: 'input',

                        }, {
                            label: '床号',
                            name: 'bedNo',
                            widget: 'input',

                        }, {
                            label: '患者编号',
                            name: 'No',
                            widget: 'input',
                        }],
                        tools: false,
                        submit: (model) => {
                            let options = {
                                patientName: model.name,
                                patientSex: model.sex,
                                patientAge: model.age,
                                patientNo: model.No,
                                studyNo: this.patient.imageNo || '',
                                inHospitalNo: model.hospictalNo || '',
                                bedNo: model.bedNo || '',
                                applyOffice: model.office || '',
                                type:this.patient.deviceType||'',
                                // patientPhone: model.patientPhone,
                                patientIdNumber: this.patient.ICard || ''
                            };
                            Report.CONSULTATION({
                                id: this.task.apply_form_id,
                                fixedField: JSON.stringify(options)
                            }).then(res => {
                                if (res) {
                                    Sunset.tip('修改成功');
                                    this.$emit('reload', true);
                                    this.$refs.reportbase.cancel();
                                }

                            });
                        }
                    }
                },
                REPORT_STATUS_TEXT,
                toolbarOptions: [{
                    label: '返回',
                    color: 'ghost',
                    premise: () => {

                        return self.tools.goback;
                    },
                    operate: () => {
                        this.$emit('reload');
                        this.back(true);
                    }
                }, {
                    label: '打印',
                    color: 'primary',
                    premise: () => {
                        return self.tools.print;
                    },
                    operate: () => {

                        $('#report-page').jqprint({
                            taskId: this.task.id
                        });
                    }
                }, {
                    label: '查看影像',
                    color: 'primary',
                    premise: () => {
                        return false;
                    },
                    operate: () => {
                        if (this.patient && this.patient.imageId) {
                            Base.openCateyes(this.patient.imageId);
                        }
                    }
                }, {
                    label: '修改报告',
                    color: 'info',
                    premise: () => {
                        if(this.task.status==6){
                            return false;
                        }
                        return self.tools.changeinfo;
                    },
                    operate: () => {
                        let options = {
                            name: this.patient.name,
                            sex: this.patient.sex || 0,
                            age: this.patient.age || '',
                            office: this.patient.office || '',
                            hospictalNo: this.patient.hospictalNo || '',
                            bedNo: this.patient.bedNo || '',
                            No: this.patient.No || ''
                        };
                        this.$refs.reportbase.open(options);
                    }
                }],
                toolbarRightOptions: [{
                    label: '作废',
                    color: 'error',
                    premise: () => {
                        return self.tools.reject && (self.task.status == 5);
                    },
                    operate: () => {
                        let clear = Sunset.confirm({
                            content: `请确认作废报告`,
                            loading: true,
                            onOk: () => {
                                let options = {
                                    taskId: this.task.id
                                };
                                Report.INVALID(options).then(res => {
                                    clear();
                                    if (res) {
                                        this.$emit('reload');
                                        this.$emit('reject');
                                        Sunset.tip('作废成功', 'success');
                                        this.back(true);
                                    }
                                }).catch(clear);
                                return true;
                            }
                        });
                    }
                }, {
                    label: '收藏',
                    color: 'ghost',
                    premise: () => {
                        return self.tools.addcenter && (this.task.status == 6) && (!this.task.collect);
                    },
                    operate: () => {
                        let clear = Sunset.confirm({
                            content: `请确认收藏报告`,
                            loading: true,
                            onOk: () => {
                                let options = {
                                    taskId: this.task.id,
                                    collectType: 'customer'
                                };
                                Report.ADD_CENTER(options).then(res => {
                                    clear();
                                    if (res) {
                                        this.$emit('reject');
                                        this.task.collect = true;
                                        Sunset.tip('收藏成功', 'success');
                                    }
                                }).catch(clear);
                                return true;
                            }
                        });
                    }
                }, {
                    label: '已收藏',
                    color: 'ghost',
                    premise: () => {
                        return self.tools.addcenter && (this.task.status == 6) && (this.task.collect);

                    }
                }]
            };
        },
        computed: {
            imgUrl() {
                let url = `${url}/report-show/#!/app/reportview/${task.taskId}`;
                return url;
            }
        },
        methods: {
            viewImageMark(item) {
                let c = Base.openCateyes(this.imageId);
                if (item) {
                    c.CateyesPubSub = c.CateyesPubSub || $({});
                    c.CateyesPubSub.replyMarks = item.imageMark;
                }
            },
            view(imageId) {
                if (imageId) {
                    Base.openCateyes(this.patient.imageId);
                }
            }
        },

        ready() {
            document.body.classList.add('A4');
            // SignStore.currentUser().then(res => {
            //     if (res) {
            //         this.USER = res;
            //         this.USERID = res.account.id;
            //     }
            // });
        }
    }
</script>