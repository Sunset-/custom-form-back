<template lang="html">
    <div class="write-report-left-menu-container" @click="switchWritePage">
        <div>
            {{toggle?'关闭报告':'打开报告'}}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                toggle: true
            };
        },
        methods: {
            switchWritePage() {
                this.toggle = !this.toggle;
                this.$emit('write-page-switch', this.toggle);
            }
        }
    }
</script>

<style lang="sass">
    .write-report-left-menu-container {
        position: relative;
        width: 100%;
        height: 100%;
        color: #ccc;
        writing-mode: vertical-lr;
        font-size: 2em;
        >div {
            display: block;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
            position: relative;
            height: 130px;
            text-align: center;
            width: 100%;
            line-height: 50px;
        }
        &:hover {
            background: #3399ff;
            color: white;
            cursor: pointer;
        }
    }
</style>