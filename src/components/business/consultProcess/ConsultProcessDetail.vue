<style lang="sass">
    .consult-chat-wrap {
        height: 500px;
        padding: 15px;
        overflow-y: auto;
        .cunsult-message-patient {
            position: relative;
            padding-left: 50px;
            margin-bottom: 10px;
            &>img {
                position: absolute;
                left: 0px;
                width: 40px;
                height: 40px;
                border-radius: 20px;
                overflow: hidden;
            }
            &>div {
                color: #444;
            }
        }
        .cunsult-message-doctor {
            background: #E2FFEA;
            padding: 10px 30px;
            margin-bottom: 10px;
            &>label {
                display: block;
                text-align: center;
            }
            &>div {
                text-indent: 28px;
                color: #444;
            }
        }
    }
</style>
<template>
    <div class="consult-chat-wrap">
        <sunset-loading :loading="loading" style="height:400px;">
            <template v-for="message in messages">
                <div v-if="message.from.accId==consult.consultAccId" class="cunsult-message-patient">
                    <img src="/assets/img/patient-avator.gif" alt="h" />
                    <label>{{message.from.name}}&nbsp;&nbsp;&nbsp;{{message.time | time}}</label>
                    <div>
                        {{{message.content}}}
                    </div>
                </div>
                <div v-if="message.from.accId==consult.expertAccountId" class="cunsult-message-doctor">
                    <label>{{message.time | time}}&nbsp;&nbsp;&nbsp;回复</label>
                    <div>
                        {{{message.content}}}
                    </div>
                </div>
            </template>
        </sunset-loading>
    </div>
</template>
<script>
    import ConsultStore from './/ConsultStore.js';

    export default {
        props: {
            consult: {}
        },
        data() {
            return {
                loading: true,
                topic: null,
                messages: []
            }
        },
        methods: {
            init() {
                if (this.consult.id) {
                    this.loadHistoryMessage();
                }
            },
            loadHistoryMessage() {
                //消息列表
                this.loading = true;
                this.messages = [];
                ConsultStore.getHistoryMessage(this.consult.id).then(res => {
                    var expertAccountId = this.consult.expertAccountId;
                    this.messages = res || [];
                    this.loading = false;
                });
            }
        },
        watch: {
            consult() {
                this.init();
            }
        }
    }
</script>