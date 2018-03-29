<style lang="sass" scoped>
    .read-page-process-container {
        background: white;
        padding: 20px;
        span,
        p,
        h1,
        h2,
        h3,
        h4,
        h5,
        div {
            font-size: 14px;
            line-height: 1.8em;
        }
        .report-detail-message {
            text-indent: 2em;
        }
    }
</style>
<template>
    <div class="read-page-process-container">
        <Timeline>
            <Timeline-item v-for="item in processModel" :color="item.color">
                <Icon :type="item.style" slot="dot" v-if="item.style"></Icon>
                <p class="time">
                    {{item.createTime|time}} {{item.processor&&item.processor.designation}} {{item.doWhat}} <span style="color:red;">{{item.remark}}</span>
                    <span
                        v-if="item.report" style="color:#39f;">[{{{'2':'阳性','3':'阴性'}[item.report.positiveNegative]}}]</span>
                </p>
                <p class="content" v-if="item.report">
                    <p v-if="item.report"><strong>影像所见</strong><span class="report-detail-message">{{{item.report.imagingFinding||'未书写'}}}</span>                        </p>
                    <p v-if="item.report"><strong>影像学提示</strong><span class="report-detail-message">{{{item.report.imagingTips||'未书写'}}}</sapn></p>
                    <p v-if="item.report&&item.report.suggests"><strong>建议</strong><span class="report-detail-message">{{item.report.suggests}}</span></p>
                    <p v-if="item.report&&item.report.markCount"><strong>标记</strong><span @click="viewImageMark(item)" style="color:red;cursor:pointer">共标记{{item.report.markCount}}张</span></p>
                </p>
            </Timeline-item>
        </Timeline>
    </div>
</template>
<script>
    import {
        TaskDetail,
        Report
    } from '../service';
    export default {
        name: "ReadPageProcess",
        props: {
            processModel: {
                default: function () {}
            },
            imageId: {
                default: ''
            }
        },

        data() {
            return {
                logs: []
            };
        },
        methods: {
            viewImageMark(item) {
                let c = Base.openCateyes(this.imageId);
                if (item && item.report) {
                    c.CateyesPubSub = c.CateyesPubSub || $({});
                    c.CateyesPubSub.replyMarks = item.report.marks;
                }
            }
        },
        ready() {

        }

    }
</script>