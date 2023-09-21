<template>
    <div id="Layout">
        <div class="left">
            <Menu :collapse="collapse" @toggle="toggle"></Menu>
        </div>
        <div class="right">
            <Header :collapse="collapse" @toggle="toggle"></Header>
            <div class="main scrollbar">
                <router-view v-slot="{ Component }" class="router">
                    <transition name="container" mode="out-in">
                        <!-- <keep-alive> -->
                        <component :is="Component" :key="$route.name" />
                        <!-- </keep-alive> -->
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from 'vue'
import { Header, Menu } from './components'
const collapse = ref(false)
const toggle = (val: boolean) => {
    collapse.value = val === undefined ? !collapse.value : val;
}

</script>

<style lang="scss" scoped>
.container-enter-active,
.container-leave-active {
    transition: all .4s ease;
}

.container-enter-from,
.container-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.container-enter-to,
.container-leave-from {
    opacity: 1;
    transform: translateX(0px);
}

#Layout {
    height: 100vh;
    overflow: hidden;
    display: flex;

    .left {
        flex-shrink: 0;
    }

    .right {
        flex: 1;
        overflow: hidden;
    }

    .main {
        padding: 20px;
        width: 100%;
        height: calc(100% - var(--header-height));
        box-sizing: border-box;
        overflow: scroll;

        .container {
            width: 100%;
            min-height: 100%;
            background: #fff;
            border-radius: 6px;
            padding: 20px;
            box-sizing: border-box;
        }
    }
}
</style>
