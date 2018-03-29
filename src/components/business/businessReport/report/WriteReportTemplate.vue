<template lang="html">
    <div class="template-type">
        <i-select :model.sync="select.type" style="width:80px" @on-change="selectType">
            <i-option v-for="item in template.types" :value="item.id">{{ item.title }}</i-option>
        </i-select>
    </div>
    <Tabs :active-key="select.root" :animated="false" class="template-list" @on-click="selectTemplate">
        <Tab-pane label="公共模版" key="PUBLIC">
            <div class="template-point">
                <span v-for="point in  template.points" :class="{'active':(select.point == point.id)}" @click="selectPoint(point.id)">{{point.title}}</span>
            </div>
            <div class="template-detail-list">

                <div v-for="detail in template.details" class="template-detail-item" :class="DetailClassControl(detail)" @click="selectDetail(detail)"
                    @mouseenter="dataDetails(detail,$event)" @mouseleave="hiddenDetail(detail,$event)">
                    {{detail.title}}
                </div>
            </div>
        </Tab-pane>
        <Tab-pane label="个人模版" key="SELF" @on-click="selectTemplate('SELF')">
            <div class="template-point">
                <div class="point-item" v-for="point in  template.points">
                    <div :class="{'active':(select.point == point.id)}" @click="selectPoint(point.id)">{{point.title}}</div>
                    <span>
                        <Icon type="edit" @click="$refs.pointsmodal.open(point)"></Icon>
                        <Icon type="trash-a" @click="deleteTemplate(point)"></Icon>
                    </span>
                </div>
            </div>

            <div class="template-detail-list ">
                <div v-for="detail in template.details" class="template-detail-item self" :class="DetailClassControl(detail)">
                    <div @click="selectDetail(detail)" @mouseenter="dataDetails(detail,$event)" @mouseleave="hiddenDetail(detail,$event)">
                        {{{detail.title}}}
                    </div>
                    <span>
                        <Icon type="edit" @click="$refs.detailmodal.open(detail)"></Icon>
                        <Icon type="trash-a" @click="deleteTemplate(detail,false)"></Icon>
                    </span>
                    <div>
                        &nbsp;
                    </div>
                </div>
            </div>
        </Tab-pane>
    </Tabs>

    <div class="template-detail" :class="DetailClassControl(detail)" v-el:detail>
        <h3>{{detail.title}}</h3>
        <div class="message">
            <strong>影像学所见：</strong>{{{detail.description}}}
        </div>
        <div class="message">
            <strong>影像学提示：</strong>{{{detail.contents}}}
        </div>
    </div>
    <sunset-form-modal v-ref:templatemodal :options="templateFormModel"></sunset-form-modal>
    <sunset-form-modal v-ref:pointsModal :options="templatePointModel"></sunset-form-modal>
    <sunset-form-modal v-ref:detailModal :options="detailModal"></sunset-form-modal>
</template>

<script>
    import {
        TemplateRoot,
        Template,
        TemplateSelf
    } from '../service';
    import {
        POSITIVE_NEGATIVE
    } from '../config';
    var TemplateService = null;
    export default {
        data() {
            let self = this;
            return {
                template: {
                    types: [],
                    points: [],
                    details: []
                },
                select: {
                    root: 'PUBLIC',
                    type: '',
                    point: '',
                    detail: ''
                },
                template_self: {
                    types: [],
                    points: [],
                    details: []
                },
                detail: {},
                templateFormModel: {
                    title: '添加模版',
                    formOptions: {
                        cols: '2',
                        fields: [{
                            label: '模版类别',
                            name: 'type',
                            widget: 'select',
                            valuePlace: 'id',
                            textPlace: 'title',
                            validate: {
                                required: true
                            },
                            data() {
                                return TemplateRoot.LIST();
                            },
                        }, {
                            label: '分类类型',
                            name: 'pointCategory',
                            widget: 'radio',
                            data: {
                                'select': '已有分类',
                                'new': '新增分类',
                            }
                        }, {
                            label: '标题',
                            name: 'title',
                            widget: 'input',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '分类',
                            name: 'point',
                            widget: 'select',
                            watch: 'type,pointCategory',
                            valuePlace: 'id',
                            textPlace: 'title',
                            premise(model) {
                                return model.pointCategory == 'select';
                            },
                            rebuild(model, options, formModel) {
                                options.data = res => {
                                    return TemplateSelf.LIST({
                                        id: model.type
                                    }).then(res => {
                                        if (res && res[0] && res[0].id) {
                                            model.point = res[0].id
                                        } else {
                                            model.point = '';
                                        }
                                        return res;
                                    });
                                };
                            },
                            data : [],
                            validate: {
                                required: true
                            }
                        }, {
                            label: '分类名称',
                            name: 'pointName',
                            widget: 'input',
                            watch: 'type,pointCategory',
                            valuePlace: 'id',
                            textPlace: 'title',
                            premise(model) {
                                return model.pointCategory == 'new';
                            },
                            // rebuild(model, options, formModel) {
                            //     if (model.pointCategory != 'new') {
                            //         return this.premise = () => {
                            //             return false;
                            //         }
                            //     } else {
                            //         return this.premise = () => {
                            //             return true;
                            //         }
                            //     }
                            // },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '影像学表现',
                            name: 'description',
                            widget: 'editor',
                            monopolize: true,
                            toolbar: 'bold,italic,superscript,subscript,spechars',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '影像提示',
                            name: 'contents',
                            widget: 'editor',
                            monopolize: true,
                            toolbar: 'bold,italic,superscript,subscript,spechars',
                            validate: {
                                required: true
                            }

                        }, {
                            label: '是否正常',
                            name: 'isNormal',
                            widget: 'radio',
                            valuePlace: 'key',
                            textPlace: 'value',
                            data: [{
                                    key: '0',
                                    value: '正常模版'
                                },
                                {
                                    key: '1',
                                    value: '异常模版'
                                }
                            ],
                            validate: {
                                required: true
                            }
                        }],
                        tools: false,
                        cast(model) {
                            //阴阳性转换
                            model.isNormal = model.isNormal - 2;

                            return model;
                        },
                        format(model) {

                            let options = {
                                description: model.description || '',
                                contents: model.contents || '',
                                rootId: model.type || '',
                                ownerName: model.point || '',
                                ownerId: model.point || '',
                                root: model.type,
                                isNormal: model.isNormal || '0',
                                title: model.title,
                            };

                            if (model.pointCategory == 'new') {
                                delete options.ownerId;
                            } else {
                                delete options.ownerName;
                            }
                            return options;
                        },
                        submit(model) {
                            TemplateSelf.SAVE(model).then(res => {
                                if (res) {
                                    self.$refs.templatemodal.cancel();
                                    Sunset.tip('模版保存成功', 'success');
                                    self.selectType();
                                }
                            });
                        }
                    }
                },
                templatePointModel: {
                    title: '修改',
                    formOptions: {
                        cols: "1",
                        fields: [{
                            label: '部位',
                            name: 'title',
                            widget: 'input',
                            validate: {
                                required: true
                            }
                        }],
                        tools: false,
                        cast(model) {
                            var newModel = {};
                            Object.assign(newModel, model);
                            return newModel;
                        },
                        submit: this.upDataTemplate
                    }
                },
                detailModal: {
                    title: '修改',
                    formOptions: {
                        cols: "1",
                        fields: [{
                            label: '标题',
                            name: 'title',
                            widget: 'input',
                            validate: {
                                required: true
                            }

                        }, {
                            label: '影像学表现',
                            name: 'description',
                            widget: 'editor',
                            monopolize: true,
                            toolbar: 'bold,italic,superscript,subscript,spechars',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '影像提示',
                            name: 'contents',
                            widget: 'editor',
                            monopolize: true,
                            toolbar: 'bold,italic,superscript,subscript,spechars',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '是否正常',
                            name: 'isNormal',
                            widget: 'radio',
                            valuePlace: 'key',
                            textPlace: 'value',
                            data: [{
                                    key: '0',
                                    value: '正常模版'
                                },
                                {
                                    key: '1',
                                    value: '异常模版'
                                }
                            ],
                            validate: {
                                required: true
                            }
                        }],
                        tools: false,
                        cast(model) {
                            var newModel = {};
                            Object.assign(newModel, model);
                            return newModel;
                        },
                        submit: (model) => {
                            return this.upDataTemplate(model, false);
                        }
                    }
                }
            }
        },
        methods: {
            addTemplate(model) {
                let options = {
                    isNormal: POSITIVE_NEGATIVE[model.positiveNegative] || '0',
                    description: model.show || '',
                    contents: model.tip || '',
                    type: this.select.type || 'MR',
                    pointCategory: 'select',
                }
                this.$refs.templatemodal.open(options);
            },
            selectTemplate(type) {

                this.select.root = type;
                if (type == 'PUBLIC') {
                    TemplateService = Template;
                }

                if (type == 'SELF') {
                    TemplateService = TemplateSelf;
                }
                (this.template.types.length > 0) && this.selectType(this.select.type);
            },
            selectType(data) {
                if (data) {
                    this.select.type = data;
                } else {
                    data = this.select.type;
                }
                return this.getTemplateType({
                    id: data
                });
            },
            selectPoint(data) {
                this.select.point = data;
                return this.getTemplate({
                    id: data
                });
            },
            DetailClassControl(data) {
                let className = [];
                if (this.select.detail == data) {
                    className.push('active');
                }
                if (data.isNormal == 0) {
                    className.push('success');
                } else if (data.isNormal == 1) {
                    className.push('error');
                }
                return className.join(' ');
            },
            selectDetail(data) {
                this.select.detail = data;
                this.$emit('reportform-select', data);
            },
            dataDetails(data, $event) {
                this.detail = data;
                this.$els.detail.style.display = "block";
                this.$els.detail.style.top = ($event.pageY - $event.layerY) + 'px';
            },
            hiddenDetail(data, $event) {
                this.detail = {};
                this.$els.detail.style.display = "none";
            },
            getTemplate(options) {
                this.template.details = [];
                return TemplateService.LIST(options).then(res => {
                    this.template.details = res;
                });
            },

            upDataTemplate(options, points = true) {
                return TemplateSelf.SAVE(options).then(res => {
                    if (points) {
                        this.select.point = options.id;
                        this.selectType(this.select.type).then(res => {
                            this.select.point = options.id;
                        });
                    } else {
                        this.selectPoint(this.select.point).then(res => {
                            this.select.detail = options;
                        });
                    }
                    this.$refs.pointsmodal.cancel();
                    this.$refs.detailmodal.cancel();
                });
            },
            deleteTemplate(options, points = true) {
                let clear = Sunset.confirm({
                    content: `请确认要删除此${points?"部位":"模版"}`,
                    loading: true,
                    onOk: () => {
                        TemplateSelf.DELETE({
                            id: options.id
                        }).then(res => {
                            clear();
                            Sunset.tip('删除成功', 'success');
                            if (points) {
                                this.selectType(this.select.type);
                            } else {
                                this.selectPoint(this.select.point);
                            }
                        }).catch(clear);
                    }
                });
            },
            getTemplateType(options, type_detail = true) {
                this.template.points = [];
                this.template.details = [];
                return TemplateService.LIST(options).then(res => {
                    this.template.points = res;

                    type_detail && (res.length > 0) && this.selectPoint(res[0].id);
                    return res;
                });
            },
            getTemplateRoot(type_detail = true) {
                this.template.types = [];
                this.template.points = [];
                this.template.details = [];
                return TemplateRoot.LIST().then(res => {
                    if (res) {
                        this.template.types = res;
                        type_detail && this.selectType(res[0].id)
                    }
                    return res;
                });
            },
        },
        ready() {
            this.selectTemplate('PUBLIC');
            this.getTemplateRoot();
        }
    }
</script>

<style lang="sass">
    .template-type {
        position: absolute;
        right: 0px;
        top: 1px;
        z-index: 3;
    }

    .template-list {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        >.ivu-tabs-content {
            position: absolute;
            top: 52px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            overflow-x: hidden;
            overflow-y: scroll;
        }
    }

    .template-point {
        // text-align: center;
        padding: 0 5px;
        >span {
            min-width: 35px;
            padding: 5px;
            display: inline-block;
            cursor: pointer;
            margin-top: 2px;
            &:hover {
                color: white;
                background: #5cadff;
            }
            &.active {
                color: white;
                background: #3399ff;
            }
        }
        .point-item {
            min-width: 35px;
            display: inline-block;
            cursor: pointer;
            margin-top: 2px;
            box-shadow: 0px 0px 1px #000 inset;
            >div {
                padding: 5px;
                display: inline-block;
                &:hover {
                    color: white;
                    background: #5cadff;
                }
                &.active {
                    color: white;
                    box-shadow: none;
                    background: #3399ff !important;
                }
            }
            i {
                padding: 4px;
                &:hover {
                    color: white;
                    background: purple;
                }
            }
        }
    }

    .template-detail-list {
        position: relative;
        overflow-y: hidden;
        padding-top: 10px;
        .template-detail-item {
            position: relative;
            padding: 10px;
            width: 100%;
            cursor: pointer;
            border-left: 3px solid #3399ff;
            border-right: 3px solid #3399ff;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            background: white;
            box-shadow: 0px 1px 1px #ccc inset;
            font-size: 1.2em;
            &:before {
                content: ' ';
                left: 0px;
                width: 1px;
                height: 10px;
                top: 0px;
                border-right: 10px solid transparent;
                position: absolute;
                border-top: 10px solid #3399ff;
            }
            &.active {
                color: white;
                box-shadow: none;
                background: #3399ff !important;
            }
            &:hover {
                color: white;
                background: #5cadff;
                border-left: 3px solid #3399ff !important;
                &:before {
                    border-top: 10px solid #3399ff !important;
                }
            }
            &.success {
                border-left: 3px solid #00cc66;
                border-right: 3px solid #00cc66;
                &:before {
                    border-top: 10px solid #00cc66;
                }
            }
            &.error {
                border-left: 3px solid #ff6600;
                border-right: 3px solid #ff6600;
                &:before {
                    border-top: 10px solid #ff6600;
                }
            }
        }
        .self {
            padding: 0px;
            >div:first-child {
                position: absolute;
                left: 0px;
                right: 60px;
                top: 0px;
                bottom: 0px;
                padding: 10px;
                height: 38px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            >div:last-child {
                padding: 10px;
            }
            >span {
                position: absolute;
                right: 0px;
                top: 0px;
                bottom: 0px;
                padding: 10px;
                height: 38px;
                >i {
                    padding: 4px;
                    &:hover {
                        color: white;
                        background: purple;
                    }
                }
            }
        }
    }

    .template-detail {
        display: none;
        position: fixed;
        width: 350px;
        background: white;
        top: 0px;
        right: 300px;
        padding: 5px;
        z-index: 9999;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        .message {
            color: #000;
            p {
                text-indent: 2em;
            }
        }
        &.success {
            border-left: 3px solid #00cc66;
            border-right: 3px solid #3399ff;
            color: #00cc66;
            &:before {
                border-top: 10px solid #00cc66;
            }
        }
        &.error {
            color: #ff6600;
            border-left: 3px solid #ff6600;
            border-right: 3px solid #3399ff;
            &:before {
                border-top: 10px solid #ff6600;
            }
        }
    }
</style>