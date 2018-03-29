<style lang="sass">
    .dicom-study-item {
        position: relative;
        display: inline-block;
        border: 1px solid #d7dde4;
        box-sizing: border-box;
        vertical-align: top;
        margin-right: 10px;
        .dicom-title {
            position: absolute;
            background: #35B5E0;
            color: #fff;
            padding: 2px;
            border-radius: 0px 0px 10px 0px;
            top: 0px;
            left: 0px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
            line-height: 18px;
            &.woman {
                background: #fd6b84;
            }
        }
        .dicom-foot {
            position: absolute;
            background: #6F6F6F;
            color: #fff;
            padding: 2px 4px;
            border-radius: 10px 0px 0px 0px;
            bottom: 0px;
            right: 0px;
            line-height: 18px;
        }
        img {
            width: 100%;
            height: 100%;
        }
        .dicom-close {
            position: absolute;
            top: 2px;
            right: 2px;
            cursor: pointer;
            color: #FFF;
            &:hover {
                color: #d9534f;
            }
        }
    }
</style>
<template>
    <div class="dicom-study-item" :style="cardSize" @click="view">
        <span :class="['dicom-title',data.sex==2?'woman':'']">{{data.type}}-{{data.age}}岁</span>
        <img v-default-img="DICOM" :src="data.id | dicom-thumbnail" />
        <span class="dicom-foot">{{data.totalImage||data.count}}张</span>
        <Icon v-if="removeable" class="dicom-close" type="close-round" @click="remove"></Icon>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                default () {
                    return {}
                }
            },
            size: {
                default: 80
            }
        },
        computed: {
            cardSize() {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`
                }
            },
            removeable() {
                return this.$el.hasAttribute('removeable');
            }
        },
        methods: {
            view() {
                if (this.$el.hasAttribute('viewable')) {
                    Base.openCateyes(this.data.id);
                }
            },
            remove() {
                this.$emit('remove', this.data);
            }
        }
    }
</script>