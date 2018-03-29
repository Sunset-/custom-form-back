<template>
    <div></div>
</template>
<script>
    import WebUploader from '../../../vendor/webuploader/webuploader.min';
    import SparkMD5 from './spark-md5.js';
    import DicomUtils from './DicomUtil.js';

    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            studies: {
                type: Array,
                default: []
            }
        },
        methods: {

        },
        data() {
            return {
                uploadOptions: {
                    // swf文件路径
                    swf: '../../../vendor/webuploader/Uploader.swf',
                    // 文件接收服务端。
                    server: '/upload/api/1.0.0/file/wuploader',
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: `#${this.id}`,
                    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                    resize: false,
                    chunked: true,
                    formData: {
                        taskToken: null,
                        uploadType: 'dicom',
                        md5s: "",
                    },
                    duplicate: true
                },
                map: {},
                taskToken: null
            };
        },
        methods: {
            init() {
                var uploader = this.uploader = WebUploader.create(this.uploadOptions),
                    percentages = {};
                //选择文件
                uploader.on('filesQueued', files => {
                    percentages = {};
                    Promise.resolve().then(() => {
                        return Promise.all(files.map(file => {
                            return SunsetFileTypeChecker.check(file, 'DICOM');
                        }))
                    }).then(res => {
                        var checkedFiles = [];
                        files.forEach((file, index) => {
                            if (res[index]) {
                                checkedFiles.push(file);
                            }
                        });
                        return checkedFiles;
                    }).then(files => {
                        this.md5(files).then(md5s => {
                            return new Promise((resolve, reject) => {
                                $.ajax({
                                    url: "/upload/api/1.0.0/file/exist",
                                    dataType: "text",
                                    method: "post",
                                    data: {
                                        md5s: Object.keys(md5s).join(',')
                                    },
                                    dataType: 'json'
                                }).then(function (res) {
                                    Object.keys(res).forEach(md5 => {
                                        md5s[md5].__md5 = md5;
                                        md5s[md5].__exist = !!res[md5];
                                    });
                                    resolve(files);
                                });
                            });
                        }).then(files => {
                            //上传
                            var exsitMd5s = [],
                                unExsitMd5s = [],
                                exsitFiles = [];
                            for (var i = 0, f; f = files[i++];) {
                                if (f.__exist == true) {
                                    uploader.skipFile(f);
                                    exsitMd5s.push(f.__md5);
                                    exsitFiles.push(f);
                                } else {
                                    percentages[f.id] = 0;
                                    unExsitMd5s.push(JSON.stringify({
                                        id: f.name,
                                        md5: f.__md5
                                    }));
                                }
                            }
                            $http({
                                url: '/business-service/fileRes/uploads',
                                type: 'POST',
                                data: {
                                    userId: 'admin'
                                }
                            }).then(taskToken => {
                                this.taskToken = taskToken;
                                uploader.option('formData', {
                                    taskToken: taskToken,
                                    uploadType: 'dicom',
                                    md5s: unExsitMd5s.join(';'),
                                });
                                if (exsitMd5s.length) {
                                    $.ajax({
                                        url: '/upload/api/1.0.0/file/fast',
                                        type: 'POST',
                                        data: {
                                            taskToken: taskToken,
                                            uploadType: 'dicom',
                                            md5s: exsitMd5s.join(',')
                                        }
                                    }).then((res) => {
                                        if (res != 'done') {
                                            for (var i = 0, f; f = exsitFiles[i++];) {
                                                f.setStatus("error");
                                            }
                                        }
                                        this.startUpload();
                                    }, () => {
                                        this.startUpload();
                                    });
                                } else {
                                    this.startUpload();
                                }
                            });
                        });
                    });
                });
                //上传进度
                uploader.on('uploadProgress', (file, percentage) => {
                    percentages[file.id] = percentage;
                    this.refreshProgress(percentages);
                });
                //上传失败
                uploader.on('uploadError', (file) => {
                    var item;
                    if (item = this.map[file.id]) {
                        item.status = 2;
                    }
                });
                //上传成功
                uploader.on('uploadSuccess', (file, response) => {
                    var item;
                    if (item = this.map[file.id]) {
                        item.status = 3;
                        item.src = response.data;
                    }
                });
                //上传完成
                uploader.on('uploadFinished', (file) => {
                    this.finishUpload();
                    var files = uploader.getFiles();
                    $(`#${this.id} input`).val('');
                    files && files.forEach(f => {
                        uploader.removeFile(f);
                    });
                });
            },
            startUpload() {
                this.uploader.upload();
                this.$emit('upload');
            },
            refreshProgress(percentages) {
                var current = 0,
                    ps = Object.keys(percentages);
                ps.forEach(p => {
                    current += percentages[p];
                });
                this.$emit('progress', current / ps.length);
            },
            finishUpload() {
                var taskToken = this.taskToken;
                $.ajax({
                    url: `/upload/api/1.0.0/file/uploaded/${taskToken}/dicom`,
                    type: 'POST'
                }).then(res => {
                    this.pollAnalysisResult(taskToken);
                });
            },
            /**
             * 轮询解析结果
             */
            pollAnalysisResult: function (taskToken, time) {
                var self = this,
                    time = time || 0;
                setTimeout(() => {
                    $http({
                        url: '/business-service/fileRes/resolved/',
                        type: 'GET',
                        data: {
                            taskToken: taskToken,
                            uploadType: 'dicom'
                        }
                    }).then((res) => {
                        if (res && res.flag) {
                            this.mergeDicomInfo(res.infoData);
                        } else {
                            this.pollAnalysisResult(taskToken, 2000);
                        }
                    });
                }, time);
            },
            mergeDicomInfo(studies) {
                studies.forEach(s => {
                    delete s.imageId;
                    s.studyDate = s.date;
                    this.studies.push(s);
                });
                this.$emit('uploaded');
            },
            //计算文件md5
            md5(files) {
                return new Promise((resolve, reject) => {
                    var total = files.length,
                        finish = 0,
                        md5s = {};
                    files && files.forEach(file => {
                        var blob = file.getSource().source,
                            chunkSize = 2 * 1024 * 1024,
                            chunks = Math.ceil(blob.size / chunkSize),
                            chunk = 0,
                            spark = new SparkMD5.ArrayBuffer(),
                            me = this,
                            blobSlice = blob.mozSlice || blob.webkitSlice || blob.slice,
                            loadNext, fr;
                        fr = new FileReader();
                        loadNext = function () {
                            var start, end;
                            start = chunk * chunkSize;
                            end = Math.min(start + chunkSize, blob.size);

                            fr.onload = function (e) {
                                spark.append(e.target.result);
                            };

                            fr.onloadend = function () {
                                fr.onloadend = fr.onload = null;
                                if (++chunk < chunks) {
                                    setTimeout(loadNext, 1);
                                } else {
                                    setTimeout(function () {
                                        finish++;
                                        md5s[spark.end()] = file;
                                        if (finish == total) {
                                            resolve(md5s);
                                        }
                                        loadNext = file = blob = spark = null;
                                    }, 1);
                                }
                            };
                            fr.readAsArrayBuffer(blobSlice.call(blob, start, end));
                        };
                        loadNext();
                    });

                });
            }
        },
        ready() {
            this.init();
        }
    };
</script>