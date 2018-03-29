<style lang="sass">
    .share-wrap {
        position: relative;
        text-align: left;
        font-size: 14px;
        padding-top: 10px;
        padding-left: 35px;
        i {
            font-size: 30px;
            margin-left: 5px;
            cursor: pointer;
        }
        img {
            width: 120px;
            position: absolute;
            top: 50px;
            left: 140px;
        }
    }
</style>
<template>
    <div class="dailycase-share-wrap">
        <sunset-form v-ref:form :options="formOptions"></sunset-form>
        <div class="share-wrap">分享到：
            <i class="fa fa-qq text-info" @click="formShare('QQ')"></i>
            <i class="fa fa-weibo text-danger" @click="formShare('Sina')"></i>
            <i class="fa fa-weixin text-success" @mouseenter="generateCode(true)" @mouseleave="generateCode(false)"></i>
            <img v-show="showShareCode" :src="shareCode">
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            reset(record) {
                this.$refs.form.reset(this.model = {
                    id: record.id,
                    title: record.title,
                    summary: record.summary,
                    imageId: record.imageId,
                    link: Base.transformCateyesUrlPeaimage(record.imageId),
                    phoneLink: Base.transformCateyesUrlPhonePeaimage(record.imageId)
                });
            },
            formShare(type) {
                this.shareType = type;
                this.$refs.form.submit();
            },
            share(type, model) {
                window.open(Base.Share[type]({
                    url: model.link,
                    title: model.title,
                    summary: model.summary,
                    pics: [
                        Base.transformDicomThumbnailPeaimage(model.imageId)
                    ]
                }));
            },
            generateCode(show) {
                if (show) {
                    this.shareCode = this.shareCode || Base.Share.Wechat({
                        url: `http://wap.peaimage.com/#!/app/find/${this.model.id}`,
                        title: this.model.title,
                        summary: this.model.summary,
                        pics: [
                            Base.transformDicomThumbnailPeaimage(this.model.imageId)
                        ]
                    });
                    this.showShareCode = true;
                } else {
                    this.showShareCode = false;
                }
            }
        },
        data() {
            return {
                model: {},
                shareType: '',
                showShareCode: false,
                shareCode: '',
                formOptions: {
                    cols: 1,
                    fields: [{
                        label: '标题',
                        name: 'title',
                        widget: 'input'
                    }, {
                        label: '描述',
                        name: 'summary',
                        widget: 'textarea'
                    }, {
                        label: '影像链接(电脑)',
                        name: 'link',
                        widget: 'textarea',
                        readonly: true
                    }, {
                        label: '影像链接(手机)',
                        name: 'phoneLink',
                        widget: 'textarea',
                        readonly: true
                    }],
                    tools: false,
                    submit: (model) => {
                        this.share(this.shareType, model);
                    }
                },
                toolbarOptions: {
                    tools: [{
                        label: 'QQ',
                        color: 'info'
                    }, {
                        label: '微信',
                        color: 'success'
                    }, {
                        label: '新浪微博',
                        color: 'error'
                    }]
                }
            }
        }
    }
</script>