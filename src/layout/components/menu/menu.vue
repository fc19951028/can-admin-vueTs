<template>
    <div class="menu-container">
        <!-- 小屏幕时会有背景 -->
        <div v-if="isSmallScreen" v-show="!props.collapse" @click="emit('toggle', true)" class="drawer-bg"></div>
        <div class="menu" :class="{ active: props.collapse }">
            <h3 class="can-center">
                <el-icon>
                    <PartlyCloudy />
                </el-icon>
            </h3>
            <el-scrollbar>
                <!-- 小屏幕是显示 -->
                <el-menu v-if="isSmallScreen" :default-active="routeName" class="el-menu-vertical"
                    active-text-color="#ffd04b" background-color="#545c64" text-color="#fff">
                    <template v-for="item in menuList">
                        <menuItem v-if="item.meta?.isMenu" :key="item.name" :menu="item" :icons="ElementPlusIconsVue" />
                    </template>
                </el-menu>
                <!-- 大屏幕时显示 -->
                <el-menu v-else :collapse-transition="false" :collapse="props.collapse" :default-active="routeName"
                    class="el-menu-vertical" active-text-color="#ffd04b" background-color="#545c64" text-color="#fff">
                    <template v-for="item in menuList">
                        <menuItem v-if="item.meta?.isMenu" :key="item.name" :menu="item" :icons="ElementPlusIconsVue" />
                    </template>
                </el-menu>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import menuItem from './menuItem.vue'
import { usePermissionsStore } from '@/stores/permissions'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 侧边导航收缩状态
const props = defineProps(['collapse']);
// 切换侧边导航收缩状态
const emit = defineEmits(['toggle'])
// 获取并判断屏幕大小，目的：根据屏幕大小设置侧边导航显示位置
const isSmallScreen = ref(false);
let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
window.onresize = () => {
    screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    isSmallScreenFn();
}
const isSmallScreenFn = () => {
    if (screenWidth > 992) {
        isSmallScreen.value = false;
    } else {
        emit('toggle', true)
        isSmallScreen.value = true;
    }
}
isSmallScreenFn();




// 路由列表
const menuList = usePermissionsStore().menus;
// 监听当前路由
const router = useRouter()
const routeName = ref('index');
watch(
    () => router.currentRoute.value,
    (newValue: any) => {
        routeName.value = newValue.name
    },
    { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "@/assets/common.scss";

.menu-container {
    .drawer-bg {
        display: block;
        content: '';
        background: red;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        opacity: .3;
        z-index: 997;
    }

    .menu {
        height: 100vh;
        overflow: hidden;
        background: #545c64;
        width: 200px;
        transition: all .15s linear;

        @media screen and (min-width: 992px) {
            &.active {
                width: 64px;
            }
        }

        @media screen and (max-width: 991px) {
            & {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 998;
            }

            &.active {
                transform: translateX(-100%);
            }
        }

        .el-menu-vertical {
            border: none;
        }

        .el-menu-vertical:not(.el-menu--collapse) {
            width: 200px;
        }


        h3 {
            color: #fff;
            text-align: center;
            height: var(--header-height);
        }

        .el-scrollbar {
            height: calc(100vh - var(--header-height));
        }
    }
}
</style>
