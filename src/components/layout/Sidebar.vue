<template>
    <div>
        <Menu :theme="theme3" :active-key="$route.path" width="130px">
            <Menu-item v-for="m in menus" :key="m.path" @click="go(m)">
                <Icon type="document-text"></Icon>
                {{m.title}}
            </Menu-item>
        </Menu>
    </div>
</template>

<script>
    export default {
        props: {},
        computed: {
            menus() {
                var path = this.$route.path;
                path = path.substr(path.indexOf('/') + 1);
                path = path.substr(0, path.indexOf('/'));
                return Modules.navMap[path].menus;
            }
        },
        methods: {
            go(menu) {
                alert(menu)
                Router.go(menu.path);
            }
        },
        ready(){
        }
    }
</script>