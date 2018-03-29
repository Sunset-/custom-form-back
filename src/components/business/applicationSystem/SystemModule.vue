<style lang="sass">
    .application-module-config {
        font-size: 0px;
        .right {
            vertical-align: top;
            font-size: 12px;
            width: 60%;
            display: inline-block;
            padding-left: 20px;
        }
        .left {
            font-size: 12px;
            display: inline-block;
            vertical-align: top;
            width: 40%;
            box-sizing: border-box;
            border-right: 1px solid #e4e4e4;
        }
    }

    .drag-thumbnail {
        position: absolute;
        cursor: pointer;
    }

    .module-group-title {
        font-size: 14px;
        padding: 5px 0px;
    }

    .module-item {
        display: inline-block;
        min-width: 68px;
        text-align: center;
        padding: 10px;
        color: #FFF;
        border-radius: 3px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        &.disabled {
            background: #c3cbd6;
        }
    }
</style>
<template>
    <div class="application-module-config">
        <div class="left">
            <div class="title">菜单树</div>
            <sunset-toolbar size="small" :options="treeToolBar"></sunset-toolbar>
            <div>
                <sunset-tree v-ref:menutree :options="options.treeOptions" :nodes="options.treeNodes" @inited="inited" @selected="selected"
                    @checked="checked"></sunset-tree>
            </div>
        </div>
        <div class="right">
            <div class="title">模块</div>
            <div class="module-list noselect">
                <div v-for="group in moduleGroup">
                    <p class="module-group-title">{{group.title}}</p>
                    <span :class="['module-item','bg-'+(module.color||group.color||'info'),mountModules[module.name]?'disabled':'']" v-for="module in group.modules"
                        :data-module="module.name">
                    {{module.title}}
                </span>
                </div>
            </div>
        </div>
    </div>
    <sunset-form-modal v-ref:formmodal :options="formModalOptions" @saved="refreshTree"></sunset-form-modal>
</template>
<script>
    import SystemModuleStore from './SystemModuleStore.js';
    import AllModules from './AllModules.js';

    export default {
        props: {
            application: {}
        },
        data() {
            return {
                selectedNode: null,
                selectedParentNode: null,
                dragModule: null,
                dragSrcDom: null,
                mountModules: {},
                mountRefreshFlag: false,
                treeToolBar: [{
                    label: '添加一级菜单',
                    color: 'info',
                    icon: 'plus-round',
                    operate: () => {
                        this.$refs.formmodal.open({
                            parentId: '0'
                        });
                    },
                    permission: 'Menu_ADD'
                }, {
                    label: '修改',
                    color: 'warning',
                    icon: 'edit',
                    operate: () => {
                        if (this.selectedNode && this.selectedNode.parentId != null) {
                            this.$refs.formmodal.open(Object.assign({}, this.selectedNode));
                        }
                    },
                    permission: 'Menu_MODIFY'
                }, {
                    label: '删除',
                    color: 'error',
                    icon: 'close-round',
                    operate: () => {
                        if (this.selectedNode && this.selectedNode.parentId != null) {
                            var clear = Sunset.confirm({
                                content: `确定删除菜单：${this.selectedNode.moduleName}`,
                                loading: true,
                                onOk: () => {
                                    SystemModuleStore.remove(this.selectedNode.id).then(res => {
                                        clear();
                                        Sunset.tip('删除成功', 'success');
                                        this.$refs.menutree.removeNode(this.selectedNode);
                                        var moduleNo = this.selectedNode.moduleNo;
                                        console.log(`${moduleNo}`)
                                        if (moduleNo) {
                                            this.$nextTick(() => {
                                                console.log(
                                                    `mountModules.${moduleNo}`
                                                )
                                                this.$set(
                                                    `mountModules.${moduleNo}`,
                                                    false);
                                            })
                                        }
                                        this.selectedNode = null;
                                    });
                                }
                            });
                        }
                    },
                    permission: 'Menu_DELETE'
                }],
                options: {
                    title: '管理账户',
                    //树
                    treeOptions: {
                        autoExpand: true,
                        check: false,
                        setting: {
                            data: {
                                key: {
                                    name: 'name',
                                    title: 'name'
                                },
                                simpleData: {
                                    enable: true,
                                    idKey: 'id',
                                    pIdKey: 'parentId',
                                    rootPId: null
                                }
                            },
                            check: {
                                radioType: 'all'
                            },
                            format: {
                                nodeToValue(treeNode) {
                                    return treeNode && treeNode.data;
                                }
                            },
                            edit: {
                                enable: true,
                                drag: {
                                    autoExpandTrigger: true,
                                    isMove: true,
                                    prev: function (treeId, treeNodes, targetNode) {
                                        var src = treeNodes[0].data,
                                            tgt = targetNode.data;
                                        if (tgt.parentId == null) {
                                            return false;
                                        }
                                        if (tgt.parentId != '0' && !src.moduleNo) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    next: function (treeId, treeNodes, targetNode) {
                                        var src = treeNodes[0].data,
                                            tgt = targetNode.data;
                                        if (tgt.parentId == null) {
                                            return false;
                                        }
                                        if (tgt.parentId != '0' && !src.moduleNo) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    inner: function (treeId, treeNodes, targetNode) {
                                        if (!targetNode) {
                                            return false;
                                        }
                                        var src = treeNodes[0].data,
                                            tgt = targetNode.data;
                                        if (tgt.moduleNo) {
                                            return false;
                                        }
                                        if (tgt.parentId == '0' && !src.moduleNo) {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                showRemoveBtn: false,
                                showRenameBtn: false
                            },
                            callback: {
                                beforeDrag: function (treeId, treeNodes) {
                                    return treeNodes[0].data.parentId != null;
                                },
                                onDrop: (event, treeId, treeNodes, targetNode, moveType, isCopy) => {
                                    if (targetNode) {
                                        var src = treeNodes[0].data,
                                            tgt = targetNode.data;
                                        if (moveType == 'next' || moveType == 'prev') {
                                            if (src.parentId == tgt.parentId) {
                                                var children = targetNode.getParentNode().children;
                                                var changes = []
                                                if (children && children.length) {
                                                    children.forEach((c, index) => {
                                                        if (c.data.orderField != index + 1) {
                                                            changes.push(`${c.data.id}:${index+1}`);
                                                            c.data.orderField = index + 1;
                                                        }
                                                    })
                                                }
                                                if (changes.length) {
                                                    SystemModuleStore.orderMenu(changes.join(','));
                                                }
                                            } else {
                                                var newSrc = Object.assign({}, src);
                                                newSrc.parentId = tgt.parentId;
                                                SystemModuleStore.save(newSrc).then(res => {
                                                    this.refreshTree();
                                                });
                                            }
                                        } else if (moveType == 'inner') {
                                            var newSrc = Object.assign({}, src);
                                            newSrc.parentId = tgt.id || '0';
                                            SystemModuleStore.save(newSrc).then(res => {
                                                this.refreshTree();
                                            });
                                        }
                                    }
                                },
                                onMouseUp: (e, treeId, treeNode) => {
                                    var dragModule = this.dragModule,
                                        parent = treeNode && treeNode.data;
                                    if (dragModule && !parent.moduleNo) {
                                        SystemModuleStore.save({
                                            systemId: this.application.id,
                                            parentId: parent.id || '0',
                                            moduleName: dragModule.title,
                                            moduleNo: dragModule.name,
                                            icon: dragModule.treeIcon || 'attribute_item.png',
                                            orderField: 999
                                        }).then(res => {
                                            var nodes = this.$refs.menutree.addNodes(treeNode, {
                                                systemId: res.systemId,
                                                parentId: res.parentId,
                                                id: res.id,
                                                name: res.moduleName,
                                                moduleName: res.moduleName,
                                                moduleNo: dragModule.name,
                                                module: dragModule.name,
                                                icon: res.icon ? ('/assets/tree-icons/' + res.icon) :
                                                    '',
                                                isParent: false
                                            });
                                            this.$set(`mountModules.${dragModule.name}`, true);
                                            this.mountRefreshFlag = !this.mountRefreshFlag;
                                        });
                                    } else {
                                        this.dragSrcDom && this.dragSrcDom.removeClass('disabled');
                                    }
                                    this.dragModule = null;
                                    this.dragSrcDom = null;
                                }
                            }
                        }
                    },
                    treeNodes: SystemModuleStore.getMenuNodes(this.application && this.application.id, true)
                },
                formModalOptions: {
                    title: '表单modal',
                    formOptions: {
                        cols: 2,
                        store: SystemModuleStore,
                        fields: [{
                            label: '菜单名',
                            name: 'moduleName',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '图标',
                            name: 'icon',
                            widget: 'icon',
                            title: '选择菜单图标',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }],
                        format: (model) => {
                            model.systemId = this.application.id;
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: false
                    }
                }
            };
        },
        computed: {
            moduleGroup() {
                var flag = this.mountRefreshFlag;
                return AllModules;
            },
            modules() {
                var modules = [];
                AllModules.forEach(item => {
                    item.modules.forEach(m => {
                        modules.push(m);
                    });
                });
                return modules;
            }
        },
        methods: {
            inited() {},
            refreshTree() {
                this.$refs.menutree && this.$refs.menutree.refresh(SystemModuleStore.getMenuNodes(this.application &&
                    this.application.id,
                    true));
            },
            selected(node, parentNode) {
                this.selectedNode = node;
                this.selectedParentNode = parentNode;
            },
            checked(checkeds) {
                this.checkeds = checkeds;
            },
            initDragEvent() {
                //拖拽事件
                var self = this,
                    $body = $('body'),
                    $dragThumbnail = $('<span class="drag-thumbnail"></span>').hide().appendTo($body),
                    dragging = false;

                function dragCallback(ev) {
                    $dragThumbnail.css({
                        display: 'block',
                        left: ev.pageX + 2,
                        top: ev.pageY + 2
                    });
                    self.dragSrcDom && self.dragSrcDom.addClass('disabled');
                }

                function dropCallback(ev) {
                    var $tgt = $(ev.target);
                    dragging = false;
                    $dragThumbnail.hide();
                    self.dragModule = null;
                    $body.unbind('mousemove', dragCallback);
                    $body.unbind('mouseup', dropCallback);
                    $body.unbind('selectstart', docSelect);
                    self.dragSrcDom && self.dragSrcDom.removeClass('disabled');
                }

                function docSelect() {
                    return false;
                }
                $('.module-list').on('mousedown', '.module-item', function () {
                    var $this = $(this),
                        moduleName = $this.attr('data-module');
                    if ($this.hasClass('disabled')) {
                        return;
                    }
                    dragging = true;
                    $dragThumbnail.html($this.clone()).data('module', moduleName);
                    self.modules.forEach(m => {
                        if (m.name == moduleName) {
                            self.dragModule = m;
                        }
                    });
                    self.dragSrcDom = $this;
                    $body.on('mousemove', dragCallback);
                    $body.on('mouseup', dropCallback);
                    $body.bind("selectstart", docSelect);
                });
            }
        },
        ready() {
            this.initDragEvent();
        },
        watch: {
            application(v) {
                if (v) {
                    this.mountModules = {};
                    SystemModuleStore.getMenuNodes(this.application && this.application.id, true).then(res => {
                        res && res.forEach(m => {
                            if (m && m.moduleNo) {
                                this.$set(`mountModules.${m.moduleNo}`, true);
                            }
                        });
                        this.mountRefreshFlag = !this.mountRefreshFlag;
                    });
                    this.refreshTree();
                }
            }
        }
    }
</script>