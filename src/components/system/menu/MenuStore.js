const MenuCache = {};

class MenuStore {

    constructor() {}

    URLS = {
        USE_ALL: '/service/system/menu/use/all',
        SAVE: '/service/system/menu',
        DELETE: '/service/system/menu/{id}',
        ORDER: '/service/system/menu/order/change'
    }

    getMenuNodes(force) {
        return this.getAllMenus(force).then(res => {
            res = res.map(node => {
                return {
                    parentId: node.parentId,
                    id: node.id,
                    name: node.name,
                    icon: `/assets/tree-icons/${node.module?'attribute_item.png':'category.png'}`,
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

    getAllMenus = Sunset.wait((force) => {
        return Promise.resolve().then(() => {
            return $http({
                url: this.URLS.USE_ALL
            }).then(res => {
                res && res.sort(function (o1, o2) {
                    if ((o1.parentId == '0' || o2.parentId == '0') && o1.parentId != o2.parentId) {
                        return o1.parentId == '0' ? -1 : (o2.parentId == '0' ? 1 : 0);
                    } else {
                        let f1 = +o1.orderField,
                            f2 = +o2.orderField;
                        return f1 < f2 ? -1 : (f1 > f2 ? 1 : 0);
                    }
                });
                return MenuCache.cache = res;
            });
        })
    }, MenuCache)

    save(data) {
        return $http({
            url: this.URLS.SAVE,
            type: data.id ? 'PUT' : 'POST',
            data: data
        });
    }

    remove(id) {
        return $http({
            url: this.URLS.DELETE.replace(/\{id\}/, id),
            type: 'DELETE'
        });
    }

    orderMenu(changes) {
        return $http({
            url: this.URLS.ORDER,
            type: 'PUT',
            data: {
                changes
            }
        });
    }
}

export default new MenuStore();