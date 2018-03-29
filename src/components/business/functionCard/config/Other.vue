<template>
    <div>
        <sunset-form v-ref:form :options="options"></sunset-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: {
                    cols: 3,
                    fields: [{
                        group: '配置信息',
                        label: '其他配置',
                        name: 'other',
                        widget: 'coder',
                        monopolize: true,
                        style: 'height:300px;'
                    }],
                    tools: false
                }
            }
        },
        methods: {
            setConfig(config) {
                var data = null;
                if (config) {
                    try {
                        var data = JSON.parse(config);
                    } catch (e) {}
                }
                this.$refs.form.reset(data);
            },
            getConfig() {
                return this.$refs.form.generateModel().then(res => {
                    return JSON.stringify(res);
                });
            }
        }
    }
</script>