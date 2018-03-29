<template>
    <div>
        <sunset-form v-ref:form :options="options"></sunset-form>
    </div>
</template>

<script>
    import CustomFormStore from '../../customForm/CustomFormStore';

    export default {
        data() {
            return {
                options: {
                    cols: 3,
                    fields: [{
                        group: '配置信息',
                        label: '自定义表单',
                        name: 'formNo',
                        widget: 'select',
                        data() {
                            return CustomFormStore.list({
                                pageNumber: 0,
                                pageSize: 9999
                            }).then(res => res && res.map(item => ({
                                text: item.formName,
                                value: item.formNo
                            })));
                        }
                    }, {
                        label: '其他配置',
                        name: 'other',
                        widget: 'coder',
                        monopolize: true,
                        style : 'height:300px;'
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