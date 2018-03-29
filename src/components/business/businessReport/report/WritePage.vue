<template lang="html">
    <div class="write-report-page-container">
        <div class="write-report-dicom">
            <iframe :src="url" width="" height=""></iframe>
        </div>
        <div class="write-report-page" :class="{'active':!writePageOpen}">
            <div class="write-report-left-menu">
                <write-report-left-menu v-ref:report-left-menu @write-page-switch="writePageSwitch"></write-report-left-menu>
            </div>
            <div class="write-report-form">
                <write-report-form v-ref:report-form v-on:template-save="template_save" v-on:base-load="baseLoad"></write-report-form>
            </div>
            <div class="write-report-template">
                <write-report-template v-ref:report-template v-on:reportform-select="reportform_select"></write-report-template>
            </div>
        </div>
    </div>
</template>

<script>
    import WriteReportForm from './WriteReportForm';
    import WriteReportTemplate from './WriteReportTemplate';
    import WriteReportLeftMenu from './WriteReportLeftMenu';


    window.CateyesPubSub = window.CateyesPubSub || $({});

    export default {
        components: {
            WriteReportForm,
            WriteReportTemplate,
            WriteReportLeftMenu
        },
        data() {
            return {
                url: "http://www.peaimage.com/index.html#/cateyes/view/f355c24988bc460fa67073c85d508f1e/service/false/",
                writePageOpen: true
            };
        },
        methods: {
            template_save(options) {
                this.$refs.reportTemplate.addTemplate(options);
            },
            reportform_select(options) {
                this.$refs.reportForm.selectTemplate(options);
            },
            writePageSwitch(toggle) {
                this.writePageOpen = toggle;
            },
            baseLoad(options) {
                //设置默认类型
                let type = options.type||'MR';
                if (type != 'MR' && type != "CT") {
                    type = "b251616410ef4e1ab991bc056a82e359";
                }
                this.$refs.reportTemplate.selectType(type);
                
                //修改URL；
                if(options.imageId){
                    this.url=`/cateyes/cateyes.html?studyIds=${options.imageId}&which=service&show=true`;
                }
            },
        },

        ready() {
            
        }
    }
</script>

<style lang="sass">
    .write-report-page-container {
        width: 100%;
        height: 100%;
        position: absolute;
        .write-report-dicom {
            position: absolute;
            left: 0px;
            right: 50px;
            height: 100%;
            z-index: 1;
            background: #000;
            >iframe {
                width: 100%;
                height: 100%;
                border-width: 0px;
            }
        }
        .write-report-page {
            position: absolute;
            width: 1200px;
            max-width: 85%;
            height: 100%;
            z-index: 2;
            top: 0px;
            right: 0px;
            bottom: 0px;
            background: #ccc;
            display: flex;
            box-shadow: 0px 0px 1px #3399ff inset;
            border-left: 1px solid #3399ff;
            .write-report-left-menu {
                width: 50px;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                background: #4a4a4a;
            }
            .write-report-form {
                overflow: auto;
                position: absolute;
                left: 50px;
                right: 300px;
                top: 0;
                bottom: 0;
            }
            .write-report-template {
                width: 300px;
                position: absolute;
                right: 0px;
                top: 0px;
                bottom: 0px;
                background: #f8f8f8;
                flex-direction: column;
                display: flex;
            }
            &.active {
                width: 50px;
                .write-report-left-menu {}
                .write-report-form {
                    display: none;
                }
                .write-report-template {
                    display: none;
                }
            }
        }
    }
</style>