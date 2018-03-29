const MenuCache = {};

class MenuStore {

    constructor() {}

    URLS = {
        USE_ALL: '/manage-service/relation/system/module',
        SAVE: '/manage-service/relation/system/module',
        DELETE: '/manage-service/relation/system/module/del',
        ORDER: '/manage-service/relation/system/module/order'
    }

    getMenuNodes(systemId, force) {
        return $http({
            url: this.URLS.USE_ALL,
            data: {
                systemId
            }
        }).then(res => {
            res && res.forEach(item => {
                if (item.parentId === null || item.parentId === (void 0)) {
                    item.parentId = '0';
                }
            });
            res && res.sort(function (o1, o2) {
                if ((o1.parentId == '0' || o2.parentId == '0') && o1.parentId != o2.parentId) {
                    return o1.parentId == '0' ? -1 : (o2.parentId == '0' ? 1 : 0);
                } else {
                    let f1 = +o1.orderField,
                        f2 = +o2.orderField;
                    return f1 < f2 ? -1 : (f1 > f2 ? 1 : 0);
                }
            });
            return res;
        }).then(res => {
            res = res.map(node => {
                return {
                    parentId: node.parentId,
                    id: node.id,
                    name: node.moduleName,
                    moduleNo: node.moduleNo,
                    icon: `/assets/tree-icons/${node.moduleNo?'attribute_item.png':'category.png'}`,
                    isParent: !!node.isParent,
                    data: node
                };
            });
            res = [{
                parentId: null,
                id: '0',
                name: '菜单根节点',
                icon: '/assets/tree-icons/home.png',
                isParent: true,
                data: {}
            }].concat(res);
            return res;
        });
    }

    save(data) {
        return $http({
            url: this.URLS.SAVE,
            type:  'POST',
            data: data,
            json : true
        });
    }

    remove(id) {
        return $http({
            url: this.URLS.DELETE,
            type: 'POST',
            data : {
                id
            }
        });
    }

    orderMenu(changes) {
        return $http({
            url: this.URLS.ORDER,
            type: 'POST',
            data: {
                order : changes
            }
        });
    }
}

export default new MenuStore();