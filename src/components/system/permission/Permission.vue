<style lang="sass">
    @import '../../style/index.scss';
    .permission-tree-container {
        position: absolute;
        left: 15px;
        right: 15px;
        top: 50px;
        bottom: 65px;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid #efefef;
    }

    .permission-toolbar {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding: 15px;
        .sunset-toolbar {
            text-align: center;
        }
    }

    .roles-wrap {
        margin-top: 10px;
        .role-item {
            position: relative;
            background: $background;
            padding: 10px;
            border: 1px solid $border;
            cursor: pointer;
            margin-bottom: 8px;
            border-radius: 2px;
            &.active {
                border: 1px solid $success;
            }
            label {
                display: block;
                font-size: 16px;
                cursor: pointer;
            }
            span {
                position: absolute;
                right: 5px;
                top: 5px;
                font-size: 12px;
                cursor: pointer;
            }
            p {
                color: $light;
                cursor: pointer;
            }
        }
    }
</style>
<template>
    <sunset-layout title="权限管理" type="leftside-content">
        <div slot="leftside">
            <div class="title">角色列表</div>
            <sunset-toolbar size="small" :options="options.roleToolBarOptions"></sunset-toolbar>
            <div class="roles-wrap">
                <div v-for="role in roles" :class="['role-item',selectedRole==role?'active':'']" @click="selectRole(role)">
                    <label>
                    <span>{{role.type | enum 'ROLE_TYPE'}}</span>
                    {{role.name}}
                </label>
                    <p>{{role.remark}}</p>
                </div>
            </div>
        </div>
        <div slot="content">
            <div class="title">模块功能权限</div>
            <div class="permission-tree-container">
                <sunset-tree v-ref:tree :options="options.treeOptions" :nodes="options.treeNodes" @checked="checked"></sunset-tree>
            </div>
            <div class="permission-toolbar">
                <sunset-toolbar size="large" :options="options.permissionToolBarOptions"></sunset-toolbar>
            </div>
        </div>
    </sunset-layout>
    <sunset-form-modal v-ref:formmodal :options="options.formModalOptions" @saved="refreshRoles"></sunset-form-modal>
</template>
<script>
    import PermissionStore from './PermissionStore.js';

    export default {
        data() {
            return {
                roles: [],
                selectedRole: null,
                checkeds: [],
                options: {
                    //角色工具栏
                    roleToolBarOptions: [{
                        label: '新增',
                        color: 'info',
                        icon: 'plus-round',
                        operate: () => {
                            this.$refs.formmodal.open({
                                orderField: 1
                            });
                        },
                        permission: 'Permission_MODIFY'
                    }, {
                        label: '修改',
                        color: 'warning',
                        icon: 'edit',
                        operate: () => {
                            if (this.selectedRole) {
                                this.$refs.formmodal.open(Object.assign({}, this.selectedRole));
                            }
                        },
                        permission: 'Permission_MODIFY'
                    }, {
                        label: '删除',
                        color: 'error',
                        icon: 'close-round',
                        operate: () => {
                            if (this.selectedRole) {
                                var clear = Sunset.confirm({
                                    content: `确定删除角色：${this.selectedRole.name}`,
                                    loading: true,
                                    onOk: () => {
                                        PermissionStore.removeRole(this.selectedRole.id).then(
                                            res => {
                                                clear();
                                                Sunset.tip('删除成功', 'success');
                                                this.roles.splice(this.roles.indexOf(this.selectedRole),
                                                    1);
                                                this.selectedRole = null;
                                            });
                                    }
                                });
                            }
                        },
                        permission: 'Permission_MODIFY'
                    }],
                    formModalOptions: {
                        title: '表单modal',
                        formOptions: {
                            cols: 2,
                            store: PermissionStore,
                            method: 'saveRole',
                            fields: [{
                                label: '角色名称',
                                name: 'name',
                                widget: 'input',
                                validate: {
                                    required: true,
                                    maxlength: 32
                                }
                            }, {
                                label: '角色分类',
                                name: 'type',
                                widget: 'select',
                                enum: 'ROLE_TYPE',
                                validate: {
                                    required: true,
                                    maxlength: 32
                                }
                            }, {
                                label: '排序',
                                name: 'orderField',
                                widget: 'number',
                                validate: {
                                    min: 0
                                }
                            }, {
                                label: '说明',
                                name: 'remark',
                                widget: 'textarea',
                                monopolize: true,
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
                    },
                    //树
                    treeOptions: {
                        autoExpand: true,
                        check: 'multi',
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
                            }
                        }
                    },
                    treeNodes: [],
                    permissionToolBarOptions: [{
                        label: '授权',
                        color: 'success',
                        icon: 'checkmark-round',
                        operate: () => {
                            let checkeds = this.checkeds.map(item => item.id).join(','),
                                role = this.selectedRole;
                            if (checkeds != role.permissions) {
                                var roleC = Object.assign({}, role);
                                roleC.permissions = checkeds;
                                PermissionStore.saveRole(roleC).then(res => {
                                    role.permissions = checkeds;
                                    Sunset.tip('授权成功', 'success');
                                });
                            } else {
                                Sunset.tip('权限未变更');
                            }
                        },
                        permission: 'Permission_AUTHORIZATION'
                    }, {
                        label: '重置',
                        color: 'ghost',
                        icon: 'refresh',
                        operate: () => {
                            if (this.selectedRole) {
                                this.$refs.tree.refreshChecked(this.selectedRole.permissions || '');
                            }
                        }
                    }]
                }
            }
        },
        methods: {
            init() {
                var {
                    modules,
                    permissions
                } = require('../../../modules.js');
                let ms = [{
                    parentId: null,
                    id: '0',
                    name: '模块根节点',
                    icon: 'home.png',
                    isParent: true
                }];
                modules && modules.forEach(m => {
                    ms.push({
                        parentId: '0',
                        id: m.name,
                        name: m.title,
                        icon: 'category.png',
                        isParent: true
                    });
                    m.permission && m.permission.forEach(p => {
                        ms.push({
                            parentId: m.name,
                            id: `${m.name}_${p}`,
                            name: permissions[p],
                            icon: 'attribute_item.png',
                            isParent: false
                        });
                    });
                });
                ms = ms.map(node => {
                    return {
                        parentId: node.parentId,
                        id: node.id,
                        name: node.name,
                        iconSkin: 'ivu-icon ivu-icon-arrow-up-a',
                        icon: node.icon ? ('/assets/tree-icons/' + node.icon) : '',
                        isParent: !!node.isParent,
                        data: node
                    };
                });
                this.$refs.tree.refresh(ms);
                this.refreshRoles();
            },
            checked(checkeds) {
                this.checkeds = checkeds;
            },
            refreshRoles() {
                PermissionStore.all().then(res => {
                    this.roles = res;
                })
            },
            selectRole(role) {
                this.selectedRole = role;
                this.$refs.tree.refreshChecked(role.permissions || '');
            }
        },
        ready() {
            setTimeout(() => {
                this.init();
            }, 0);
        }
    };
</script>