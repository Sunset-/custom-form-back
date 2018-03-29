<template>
    <sunset-layout title="自定义表单管理">
        <sunset-crud v-ref:crud @signal="operateCrudSignal" :options="options">
            <div slot="CRUD_FORM">
                <sunset-form v-ref:infoform :options="options.formOptions" @signal="operateSignal"></sunset-form>
                <div class="ivu-col ivu-col-span-24">
                    <div class="group-title" style="font-size:16px;padding:5px 15px;">配置信息【表单项】</div>
                </div>
                <sunset-toolbar :options="toolbarOptions" style="margin-bottom:5px;"></sunset-toolbar>
                <sunset-table v-ref:configtable :options="filedsOptions"></sunset-table>
                <sunset-form v-ref:configform :options="configOptions"></sunset-form>
                <sunset-form-modal v-ref:fieldmodal :options="fieldmodalOptions"></sunset-form-modal>
                <sunset-form-modal v-if="renderFormModalOptions" v-ref:renderformmodal :options="renderFormModalOptions"></sunset-form-modal>
                <div style="text-align:center;margin-top:5px;">
                    <sunset-toolbar :options="saveToolbarOptions"></sunset-toolbar>
                </div>
            </div>
        </sunset-crud>
    </sunset-layout>
</template>
<script>
    import CustomFormStore from './CustomFormStore';
    import DictionaryStore from '../dictionary/DictionaryStore';

    export default {
        methods: {
            operateSignal(signal, record) {
                this.$refs.crud.operateSignal(signal, record);
            },
            operateCrudSignal(signal, record) {
                if (signal == 'RESET_FORM') {
                    this.$refs.infoform.reset(record);
                    this.setConfig(record && record.formContent);
                }
            },
            setConfig(config) {
                try {
                    this.form = config ? JSON.parse(config) : {};
                } catch (e) {
                    this.form = {};
                }
                this.$refs.configform.reset(this.form);
                this.$refs.configtable.setData(this.form.fields || []);
            },
            getConfig() {
                return this.$refs.configform.generateModel().then(res => {
                    res.fields = this.form.fields || [];
                    return JSON.stringify(res);
                });
            },
            saveForm(form) {
                Object.assign(this.form, form);
            },
            saveField(field) {
                var fields = this.form.fields || [],
                    originFieldIndex;
                if (field._id && (originFieldIndex = fields.findIndex(item => item._id == field._id)) >= 0) {
                    fields.splice(originFieldIndex, 1, field);
                } else {
                    field._id = new Date().getTime();
                    fields.push(field);
                }
                this.form.fields = fields;
                this.$refs.configtable.setData(this.form.fields || []);
            },
            removeField(field) {
                var fields = this.form.fields || [];
                this.form.fields = fields.filter(item => item != field);
                this.$refs.configtable.setData(this.form.fields || []);
            },
            orderField(field, orig) {
                var currentIndex = this.form.fields.indexOf(field);
                if (orig == 'UP' && currentIndex > 0) {
                    this.form.fields.splice(currentIndex, 1);
                    this.form.fields.splice(currentIndex - 1, 0, field);
                } else if (orig == 'DOWN' && currentIndex < this.form.fields.length) {
                    this.form.fields.splice(currentIndex, 1);
                    this.form.fields.splice(currentIndex + 1, 0, field);
                }
                this.$refs.configtable.setData(this.form.fields || []);
            },
            _castStringToObject(str) {
                if (Sunset.isString(str)) {
                    return eval('(' + str + ')')
                } else {
                    return str;
                }
            },
            preview() {
                this.renderFormOptions = null;
                this.$nextTick(() => {
                    var config = Sunset.clone(this.form);
                    if (config) {
                        if (config.cast) {
                            config.cast = this._castStringToObject(config.cast);
                        }
                        if (config.format) {
                            config.format = this._castStringToObject(config.format);
                        }
                        if (config.submit) {
                            config.submit = this._castStringToObject(config.submit);
                        }
                        if (config.validate) {
                            config.validate = this._castStringToObject(config.validate);
                        }
                        if (config.rebuild) {
                            config.rebuild = this._castStringToObject(config.rebuild);
                        }
                        var fields = config.fields;
                        config.fields = fields.map(field => {
                            var other = field.other && this._castStringToObject(field.other) || {},
                                validate = field.validate && this._castStringToObject(field.validate);
                            delete field.other;
                            delete field.validate;
                            var field = Object.assign(other, field);
                            if (validate) {
                                field.validate = validate;
                            }
                            return field;
                        });
                        this.renderFormModalOptions = {
                            title: '预览表单',
                            width: 800,
                            formOptions: config,
                            toolbar: false
                        };
                        this.$nextTick(() => {
                            this.$refs.renderformmodal.open();
                        });
                    }
                });
            }
        },
        data() {
            return {
                allEnumTypes: null,
                options: {
                    title: '自定义表单',
                    //表格
                    tableOptions: {
                        columns: [{
                            title: '表单名称',
                            name: 'formName'
                        }, {
                            title: '表单标识',
                            name: 'formNo'
                        }, {
                            title: '更新时间',
                            format: 'DATETIME',
                            name: 'modifyDate',
                            align: 'center'
                        }],
                        showIndex: true,
                        pageNumberStart: 0,
                        pageSize: 10,
                        localPage: true,
                        multiCheck: false,
                        sortable: true,
                        lazy: false,
                        format: {
                            list: '',
                            count: 'length',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [{
                            label: '新增',
                            icon: 'plus-round',
                            color: 'success',
                            signal: 'ADD',
                            permission: 'CustomForm_ADD'
                        }],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            signal: 'MODIFY',
                            permission: 'CustomForm_MODIFY'
                        }],
                        store: CustomFormStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: {},
                        fields: [{
                            group: '基本信息',
                            label: '表单名称',
                            name: 'formName',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '表单标识',
                            name: 'formNo',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }],
                        tools: false
                    }
                },
                form: {},
                renderFormModalOptions: null,
                configOptions: {
                    cols: 3,
                    store: {},
                    fields: [{
                        group: '配置信息【表单】',
                        label: '多列布局',
                        name: 'cols',
                        widget: 'number',
                        validate: {
                            required: true,
                            maxlength: 1
                        }
                    }, {
                        label: '模型重建',
                        name: 'rebuild',
                        widget: 'coder',
                        monopolize: true
                    }, {
                        label: '正向格式化',
                        name: 'cast',
                        widget: 'coder',
                        monopolize: true
                    }, {
                        label: '反向格式化',
                        name: 'format',
                        widget: 'coder',
                        monopolize: true
                    }, {
                        label: '全局校验',
                        name: 'validate',
                        widget: 'coder',
                        monopolize: true
                    }, {
                        label: '提交',
                        name: 'submit',
                        widget: 'coder',
                        newline: true,
                        monopolize: true
                    }],
                    format: (model) => {
                        return model;
                    },
                    validate: (model) => {
                        return true;
                    },
                    submit: (model) => {
                        this.saveForm(model);
                    },
                    tools: false
                },
                filedsOptions: {
                    columns: [{
                        title: '分组',
                        name: 'group'
                    }, {
                        title: '名称',
                        name: 'label'
                    }, {
                        title: '标识',
                        name: 'name'
                    }, {
                        title: '类型',
                        name: 'widget'
                    }, {
                        title: '换行',
                        name: 'newline',
                        format(v) {
                            return v ? '是' : '否';
                        }
                    }, {
                        title: '独占一行',
                        name: 'monopolize',
                        format(v) {
                            return v ? '是' : '否';
                        }
                    }],
                    showIndex: true,
                    pageSize: 10,
                    localPage: true,
                    sortable: false,
                    multiCheck: false,
                    lazy: true,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    recordTools: {
                        tools: [{
                            label: '修改',
                            icon: 'edit',
                            color: 'warning',
                            operate: (record) => {
                                this.$refs.fieldmodal.open(record);
                            }
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            operate: (record) => {
                                this.removeField(record);
                            }
                        }, {
                            label: '上移',
                            icon: 'arrow-up-c',
                            color: 'info',
                            operate: (record) => {
                                this.orderField(record, 'UP');
                            }
                        }, {
                            label: '下移',
                            icon: 'arrow-down-c',
                            color: 'info',
                            operate: (record) => {
                                this.orderField(record, 'DOWN');
                            }
                        }]
                    },
                    datasource: (data) => {}
                },
                toolbarOptions: {
                    tools: [{
                        label: '新增表单项',
                        color: 'success',
                        operate: () => {
                            this.$refs.fieldmodal.open({});
                        }
                    }, {
                        label: '预览表单',
                        color: 'info',
                        operate: () => {
                            this.preview();
                        }
                    }]
                },
                fieldmodalOptions: {
                    title: '编辑表单项',
                    width: 800,
                    style: 'height:650px;overflow:auto;',
                    formOptions: {
                        cols: 2,
                        store: {},
                        fields: [{
                            group: '基本信息',
                            label: '组名',
                            name: 'group',
                            widget: 'input'
                        }, {
                            label: '标题',
                            name: 'label',
                            widget: 'input'
                        }, {
                            label: '属性名',
                            name: 'name',
                            widget: 'input'
                        }, {
                            label: '默认值',
                            name: 'default',
                            widget: 'input'
                        }, {
                            label: '换行',
                            name: 'newline',
                            widget: 'switch'
                        }, {
                            label: '通行',
                            name: 'monopolize',
                            widget: 'switch'
                        }, {
                            label: '输入提示',
                            name: 'placeholder',
                            widget: 'input',
                            monopolize: true
                        }, {
                            group: '组件配置',
                            label: '组件类型',
                            name: 'widget',
                            widget: 'select',
                            data: [{
                                text: '文本输入框',
                                value: 'input'
                            }, {
                                text: '数值输入框',
                                value: 'number'
                            }, {
                                text: '搜索输入框',
                                value: 'searchinput'
                            }, {
                                text: '文本输入框组',
                                value: 'inputgroup'
                            }, {
                                text: '单选按钮',
                                value: 'radio'
                            }, {
                                text: '复选按钮',
                                value: 'checkbox'
                            }, {
                                text: '下拉框',
                                value: 'select'
                            }, {
                                text: '开关',
                                value: 'switch'
                            }, {
                                text: '日期',
                                value: 'date'
                            }, {
                                text: '级联框',
                                value: 'cascader'
                            }, {
                                text: '文本域',
                                value: 'textarea'
                            }, {
                                text: '文件上传',
                                value: 'file'
                            }, {
                                text: '富文本编辑',
                                value: 'editor'
                            }, {
                                text: '表格选择',
                                value: 'tableselect'
                            }, {
                                text: '树选择',
                                value: 'treeselect'
                            }, {
                                text: '按钮',
                                value: 'button'
                            }, {
                                text: '组件集',
                                value: 'widgetgroup'
                            }, {
                                text: 'Dicom上传',
                                value: 'dicom'
                            }, {
                                text: '视频上传',
                                value: 'video'
                            }, {
                                text: '检查图片上传',
                                value: 'checkimage'
                            }, {
                                text: '附件上传',
                                value: 'attachment'
                            }],
                            validate: {
                                required: true
                            }
                        }, {
                            label: '枚举字典',
                            name: 'enum',
                            widget: 'select',
                            data: {
                                HOSPITAL_TYPE: '1234'
                            },
                            data: (() => {
                                return Promise.resolve().then(() => {
                                    if (this.allEnumTypes) {
                                        return this.allEnumTypes;
                                    } else {
                                        return DictionaryStore.list({
                                            pageNumber: 0,
                                            pageSize: 9999
                                        }).then(res => {
                                            var types = res && res.data && res.data.map(
                                                item => ({
                                                    text: item.name,
                                                    value: item.typeStr
                                                })) || [];
                                            return this.allEnumTypes = types;
                                        });
                                    }
                                })
                            })(),
                            premise(model) {
                                return {
                                    'radio': true,
                                    'checkbox': true,
                                    'select': true
                                }[model.widget]
                            }
                        }, {
                            label: '默认首个',
                            name: 'defaultFirst',
                            widget: 'switch',
                            premise(model) {
                                return {
                                    'radio': true,
                                    'checkbox': true,
                                    'select': true
                                }[model.widget]
                            }
                        }, {
                            label: '其他配置',
                            name: 'other',
                            widget: 'coder',
                            style: 'height:200px;',
                            monopolize: true
                        }, {
                            group: '校验配置',
                            label: '校验配置',
                            name: 'validate',
                            widget: 'coder',
                            monopolize: true
                        }],
                        format: (model) => {
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        submit: (model) => {
                            this.saveField(model);
                        },
                        tools: false
                    }
                },
                saveToolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '保存',
                        color: 'success',
                        operate: () => {
                            Promise.all([this.$refs.infoform.generateModel(),
                                this.getConfig()
                            ]).then((result) => {
                                var form = result[0];
                                form.formContent = result[1];
                                return form;
                            }).then(form => {
                                CustomFormStore.save(form).then(res => {
                                    this.operateSignal('SAVED');
                                });
                            });
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.operateSignal('CANCEL');
                        }
                    }]
                }
            }
        }
    };
</script>