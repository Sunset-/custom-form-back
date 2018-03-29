<style lang="sass">
    .widget-upload-btn {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 80px;
        line-height: 29px;
        padding: 0px;
        border: 2px solid #d7dde4;
        background: #FFF;
        color: #FFF;
        overflow: hidden;
        &:before {
            content: '';
            position: absolute;
            z-index: 0;
            left: 10%;
            width: 80%;
            top: 50%;
            margin-top: -2px;
            height: 4px;
            background: #d7dde4;
            cursor: pointer;
        }
        &:after {
            content: '';
            position: absolute;
            z-index: 0;
            left: 50%;
            margin-left: -2px;
            top: 10%;
            height: 80%;
            width: 4px;
            background: #d7dde4;
            cursor: pointer;
        }
        .webuploader-element-invisible {
            display: none;
        }
    }

    .widget-upload-progress {
        display: inline-block;
        width: 80px;
        height: 80px;
    }
</style>
<template>
    <div class="sunset-field">
        <dicom-card v-for="s in dicoms" :data="s" @remove="removeStudy" viewable removeable></dicom-card>
        <div v-show="!uploading" :id="id" class="widget-upload-btn">
        </div>
        <div v-show="uploading" class="widget-upload-progress">
            <div class="progress-circle">
                <Circle :percent="percent" :size="80" :stroke-color="color">
                    <Icon v-if="percent == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
                    <span v-else style="font-size:24px">{{ percent }}%</span>
                </Circle>
            </div>
        </div>
        <dicom-uploader v-ref:uploader :id="id" :studies.sync="studies" @upload="startUpload" @progress="progress" @uploaded="uploaded"></dicom-uploader>
    </div>
</template>
<script>
    import DicomUploader from '../../dicomUploader/DicomUploader.vue';
    import DicomCard from './DicomCard';

    var uid = 0;

    export default {
        components: {
            DicomUploader,
            DicomCard
        },
        props: {
            options: {
                type: Object
            },
            value: {}
        },
        data() {
            return {
                id: `sunset-widget-dicom-uploader-${++uid}`,
                pending: false,
                uploading: false,
                percent: 0,
                studies: []
            };
        },
        computed: {
            max() {
                return this.options.max || 1;
            },
            color() {
                switch (this.percent) {
                    case 0:
                        return '#ABABAB';
                        break;
                    case 100:
                        return '#5cb85c';
                        break;
                    default:
                        return '#2db7f5';
                }
            },
            dicoms() {
                var dicoms = [],
                    value = this.value;
                if (value) {
                    dicoms = JSON.parse(value);
                    if (!Sunset.isArray(dicoms)) {
                        dicoms = [dicoms];
                    }
                }
                return dicoms;
            }
        },
        methods: {
            refreshValue() {
                this.pending = true;
                if (this.studies.length) {
                    this.value = JSON.stringify(this.studies);
                } else {
                    this.value = '';
                }
                this.$nextTick(() => {
                    this.pending = false;
                });
            },
            removeStudy(s) {
                this.studies.splice(this.studies.indexOf(s), 1);
                this.refreshValue();
            },
            startUpload() {
                this.percent = 0;
                this.uploading = true;
            },
            progress(p) {
                this.percent = parseInt(p * 100);
            },
            uploaded() {
                this.uploading = false;
                this.refreshValue();
                this.$nextTick(() => {
                    this.percent = 0;
                });
            }
        },
        events: {
            REFRESH_WIDGET_VALUE() {
                this.$refs.uploader.init();
            },
            SUNSET_UPLOAD_SUCCESS() {
                this.refreshValue();
            },
            SUNSET_IMAGE_REMOVE(data) {
                var queue = this.queue;
                for (var i = 0, item; item = queue[i]; i++) {
                    if (item == data) {
                        this.queue.splice(i, 1);
                        break;
                    }
                }
                this.refreshValue();
            }
        },
        watch: {
            value(value) {
                if (!this.pending) {
                    try {
                        var studies = this.studies;
                        if (value) {
                            var values = JSON.parse(value);
                            if (Sunset.isArray(values)) {
                                values.forEach(item => {
                                    studies.push(item);
                                });
                            } else {
                                studies.push(values);
                            }
                        } else {
                            while (studies.pop()) {}
                        }
                    } catch (e) {
                        while (this.studies.pop()) {}
                        console.error(e);
                    } finally {
                        this.pending = false;
                    }
                }
            }
        }
    }
</script>