<style lang="sass">
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
    <sunset-layout title="菜单配置" type="left-right">
        <div slot="left">
            <div class="title">菜单树</div>
            <sunset-toolbar size="small" :options="treeToolBar"></sunset-toolbar>
            <div>
                <sunset-tree v-ref:menutree :options="options.treeOptions" :nodes="options.treeNodes" @inited="inited" @selected="selected"
                    @checked="checked"></sunset-tree>
            </div>
        </div>
        <div slot="right">
            <div class="title">模块</div>
            <div class="module-list noselect">
                <div v-for="group in moduleGroup">
                    <p class="module-group-title">{{group.title}}</p>
                    <span :class="['module-item','bg-'+(module.color||'info'),mountModules[module.name]?'disabled':'']" v-for="module in group.modules"
                        :data-module="module.name">
                    {{module.title}}
                </span>
                </div>
            </div>
        </div>
    </sunset-layout>
    <sunset-form-modal v-ref:formmodal :options="formModalOptions" @saved="refreshTree"></sunset-form-modal>
</template>
<script>
    import MenuStore from './MenuStore.js';

    export default {
        data() {
            return {
                selectedNode: null,
                selectedParentNode: null,
                dragModule: null,
                dragSrcDom: null,
                mountModules: {},
                mountRefreshFlag: false,
                modules: [],
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
                                content: `确定删除菜单：${this.selectedNode.name}`,
                                loading: true,
                                onOk: () => {
                                    MenuStore.remove(this.selectedNode.id).then(res => {
                                        clear();
                                        Sunset.tip('删除成功', 'success');
                                        this.$refs.menutree.removeNode(this.selectedNode);
                                        if (this.selectedNode.module) {
                                            delete this.mountModules[this.selectedNode.module];
                                            this.mountRefreshFlag = !this.mountRefreshFlag;
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
                                        if (tgt.parentId != '0' && !src.module) {
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
                                        if (tgt.parentId != '0' && !src.module) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    inner: function (treeId, treeNodes, targetNode) {
                                        var src = treeNodes[0].data,
                                            tgt = targetNode.data;
                                        if (tgt.module) {
                                            return false;
                                        }
                                        if (tgt.parentId == '0' && !src.module) {
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
                                    var src = treeNodes[0].data,
                                        tgt = targetNode.data;
                                    if (moveType == 'next' || moveType == 'prev') {
                                        if (src.parentId == tgt.parentId) {
                                            var children = targetNode.getParentNode().children;
                                            var changes = []
                                            if (children && children.length) {
                                                children.forEach((c, index) => {
                                                    if (c.data.orderField != index + 1) {
                                                        changes.push(`${c.data.id}-${index+1}`);
                                                        c.data.orderField = index + 1;
                                                    }
                                                })
                                            }
                                            if (changes.length) {
                                                MenuStore.orderMenu(changes.join(','));
                                            }
                                        } else {
                                            var newSrc = Object.assign({}, src);
                                            newSrc.parentId = tgt.parentId;
                                            MenuStore.save(newSrc).then(res => {
                                                this.refreshTree();
                                            });
                                        }
                                    } else if (moveType == 'inner') {
                                        var newSrc = Object.assign({}, src);
                                        newSrc.parentId = tgt.id || '0';
                                        MenuStore.save(newSrc).then(res => {
                                            this.refreshTree();
                                        });
                                    }
                                },
                                onMouseUp: (e, treeId, treeNode) => {
                                    var dragModule = this.dragModule,
                                        parent = treeNode && treeNode.data;
                                    if (dragModule && !parent.module) {
                                        MenuStore.save({
                                            parentId: parent.id || '0',
                                            name: dragModule.title,
                                            module: dragModule.name,
                                            icon: dragModule.treeIcon || 'attribute_item.png',
                                            orderField: 999
                                        }).then(res => {
                                            var nodes = this.$refs.menutree.addNodes(treeNode, {
                                                parentId: res.parentId,
                                                id: res.id,
                                                name: res.name,
                                                module: dragModule.name,
                                                icon: res.icon ? ('/assets/tree-icons/' + res.icon) :
                                                    '',
                                                isParent: false
                                            });
                                            this.mountModules[dragModule.name] = true;
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
                    treeNodes: MenuStore.getMenuNodes(true)
                },
                formModalOptions: {
                    title: '表单modal',
                    formOptions: {
                        cols: 2,
                        store: MenuStore,
                        fields: [{
                            label: '菜单名',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }, {
                            label: '图标',
                            name: 'icon',
                            widget: 'icon',
                            title : '选择菜单图标',
                            validate: {
                                required: true,
                                maxlength: 32
                            }
                        }],
                        format: (model) => {
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
                let moduleGroup = [],
                    moduleGroupMap = {},
                    mountModules = this.mountModules,
                    flag = this.mountRefreshFlag;
                this.modules.forEach(m => {
                    if (!moduleGroupMap[m.group]) {
                        var group = {
                            title: m.group,
                            modules: []
                        };
                        moduleGroupMap[m.group] = group;
                        moduleGroup.push(group);
                    }
                    moduleGroupMap[m.group].modules.push(m);
                });
                return moduleGroup;
            }
        },
        methods: {
            inited() {},
            refreshTree() {
                this.$refs.menutree.refresh(MenuStore.getMenuNodes(true));
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
            MenuStore.getMenuNodes().then(res => {
                let mountModules = this.mountModules;
                res && res.forEach(m => {
                    if (m && m.data.module) {
                        mountModules[m.data.module] = true;
                    }
                });
                setTimeout(() => {
                    var modules = require('../../../modules.js').modules;
                    this.modules = modules;
                }, 0);
            });
            this.initDragEvent();
        }
    }
</script>