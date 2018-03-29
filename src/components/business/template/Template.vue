<style>
    .template-container {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        padding: 10px;
        overflow: auto;
    }

    .ztree li span.button.ico_docu {
        background-size: cover !important;
    }
</style>
<template>
    <sunset-layout title="诊断模板管理" type="leftside-content" left-size="400">
        <div slot="leftside" class="template-container">
            <Tabs type="card" :animated="false" @on-click="clickTab">
                <Tab-pane v-for="type in templateTypes" v-ref:tree :label="type.title" :key="$index+''">
                    <sunset-toolbar :options="tools"></sunset-toolbar>
                    <sunset-tree :options="generateTreeOptions(type)" :nodes="treeNodes" @selected="selected"></sunset-tree>
                </Tab-pane>
            </Tabs>
        </div>
        <div slot="content">
            <sunset-form v-ref:form :options="formOptions" @signal="operateSignal"></sunset-form>
        </div>
    </sunset-layout>
</template>
<script>
    import TemplateStore from './TemplateStore';

    const TEMPLATE_TYPE = '1';
    const TEMPLATE = '2';
    const NORMAL_TEMPLTAE = '0';

    const TREE_ICONS = {
        RIGHT: '/assets/img/right.png',
        QUESTION: '/assets/img/questions.png',
        EDIT: '/assets/img/edit.png',
    };

    export default {
        data() {
            return {
                currentTemplate: null,
                currentTreeIndex: 0,
                templateTypes: [],
                treeNodes: [],
                tools: [{
                    label: '新增分类',
                    color: 'info',
                    operate: () => {
                        var tree = this.getCurrentTree();
                        tree.addNodes(null, {
                            name: '新增分类',
                            isParent: true,
                            ownerId: this.templateTypes[this.currentTreeIndex].id,
                            level: TEMPLATE_TYPE,
                            isNormal: NORMAL_TEMPLTAE
                        }, false, true, true);
                    }
                }, {
                    label: '新增模板',
                    color: 'success',
                    operate: () => {
                        if (this.currentTemplate && this.currentTemplate.level == TEMPLATE_TYPE) {
                            this.$refs.form.reset({
                                ownerId: this.currentTemplate.id,
                                level: TEMPLATE,
                                isNormal: NORMAL_TEMPLTAE
                            });
                        } else {
                            Sunset.tip('请选择一个模板分类', 'warning');
                        }
                    }
                }],
                formOptions: {
                    cols: 2,
                    store: TemplateStore,
                    fields: [{
                        group: '基本信息',
                        label: '模板标题',
                        name: 'title',
                        widget: 'input',
                        monopolize: true,
                        placeholder: "不能为空",
                        validate: {
                            required: true,
                            maxlength: 32
                        }
                    }, {
                        label: '类型',
                        name: 'isNormal',
                        widget: 'radio',
                        monopolize: true,
                        enum: 'TEMPLATE_IS_NORMAL'
                    }, {
                        label: '影像所见',
                        name: 'description',
                        widget: 'editor',
                        toolbar: "bold,italic,superscript,subscript,spechars",
                        monopolize: true,
                        placeholder: "不能为空",
                        validate: {
                            required: true
                        }
                    }, {
                        label: '诊断意见',
                        name: 'contents',
                        widget: 'editor',
                        toolbar: "bold,italic,superscript,subscript,spechars",
                        monopolize: true,
                        placeholder: "不能为空",
                        validate: {
                            required: true
                        }
                    }],
                    format: (model) => {
                        return model;
                    },
                    validate: (model) => {
                        return true;
                    },
                    tools: null
                }
            };
        },
        methods: {
            init() {
                TemplateStore.list({
                    id: '0'
                }).then(res => {
                    this.templateTypes = res || [];
                });
            },
            generateTreeOptions(type) {
                return {
                    autoExpand: false,
                    check: false,
                    setting: {
                        async: {
                            enable: true,
                            type: 'GET',
                            //dataType: "charset=UTF-8",
                            dataFilter: function (treeId, parentNode, responseData) {
                                if (responseData && responseData.code == 200 && responseData.data && responseData.data
                                    .length) {
                                    var nodes = responseData.data;
                                    for (var i = 0, n; n = nodes[i++];) {
                                        n.isParent = n.level != '2';
                                        n.name = n.title;
                                        n.data = $.extend({}, n);
                                        if (n.level == '2') {
                                            switch (n.isNormal) {
                                                case '0':
                                                    n.icon = TREE_ICONS.RIGHT;
                                                    break;
                                                case '1':
                                                    n.icon = TREE_ICONS.QUESTION;
                                                    break;
                                                default:
                                                    n.icon = TREE_ICONS.EDIT;
                                                    break;
                                            }
                                        }
                                    }
                                    return responseData.data;
                                } else {
                                    return [];
                                }
                            },
                            url: function (treeId, treeNode) {
                                return `${TemplateStore.URLS.LIST}?id=${treeNode ? treeNode.id : type.id}`;
                            }
                        },
                        data: {
                            simpleData: {
                                enable: true,
                                pIdKey: 'ownerId',
                                idKey: 'id',
                                name: 'name'
                            }
                        },
                        edit: {
                            enable: true,
                            showRenameBtn: function (treeId, treeNode) {
                                return treeNode.data.level == '1';
                            },
                            showRemoveBtn: function (treeId, treeNode) {
                                return true;
                            },
                            removeTitle: '删除'
                        },
                        callback: {
                            beforeRemove: (treeId, treeNode) => {
                                this.remove(treeNode.data).then((data) => {
                                    if (data) {
                                        this.getCurrentTree().removeNode(treeNode);
                                    }
                                });
                                return false;
                            },
                            beforeRename: function (treeId, treeNode, newName, isCancel) {
                                if (!isCancel) {
                                    var data = $.extend({}, treeNode.data);
                                    data.title = newName;
                                    TemplateStore.save(data).then(function (data) {
                                        treeNode.data.id = treeNode.id = data;
                                    });
                                }
                                return true;
                            }
                        }
                    }
                };
            },
            selected(model) {
                this.$refs.form.reset(Object.assign({}, this.currentTemplate = model));
            },
            clickTab(key) {
                if (this.currentTreeIndex != +key) {
                    this.currentTreeIndex = +key;
                    this.$refs.form.reset({});
                }
                this.currentTreeIndex = +key;
            },
            getCurrentTree() {
                return this.$refs.tree[this.currentTreeIndex].$children[1];
            },
            operateSignal(signal, res, model) {
                if (signal == 'SAVED') {
                    var currentTemplate = this.currentTemplate;
                    var tree = this.getCurrentTree();
                    if (model.id) {
                        switch (model.isNormal) {
                            case '0':
                                model.icon = TREE_ICONS.RIGHT;
                                break;
                            case '1':
                                model.icon = TREE_ICONS.QUESTION;
                                break;
                            default:
                                model.icon = TREE_ICONS.EDIT;
                                break;
                        }
                        model.name = model.title;
                        tree.updateNode(model);
                    } else {
                        tree.reAsyncChildNodes(currentTemplate);
                    }
                }
            },
            remove(template) {
                return new Promise((resolve, reject) => {
                    var clear = Sunset.confirm({
                        content: '确定删除此条目',
                        loading: true,
                        onOk: () => {
                            TemplateStore.removeById(template.id).then(res => {
                                clear();
                                Sunset.tip('删除成功', 'success');
                                resolve(res);
                            }).catch(reject);
                        },
                        onCancel: reject
                    });
                });
            }
        },
        ready() {
            this.init();
        }
    }
</script>