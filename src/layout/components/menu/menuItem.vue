<template>
    <!-- 有子菜单 -->
    <el-sub-menu :index="props.menu.name" v-if="props.menu.children && props.menu.children.length > 0">
        <template #title>
            <el-icon>
                <component :is="props.icons[props.menu.meta.icon]"></component>
            </el-icon>
            <span>{{ props.menu.meta.label }}</span>
        </template>
        <menuItem v-for="item in props.menu.children" :key="item.name" :menu="item" :icons="props.icons" />
    </el-sub-menu>
    <!-- 没有子菜单 -->
    <el-menu-item v-else :index="props.menu.name" @click="goTap()">
        <el-icon>
            <el-icon>
                <component :is="props.icons[props.menu.meta.icon]"></component>
            </el-icon>
        </el-icon>
        <span>{{ props.menu.meta.label }}</span>
    </el-menu-item>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(['menu', 'icons'])
const { push } = useRouter();
const goTap = () => {
    push({ name: props.menu.name })
}
</script>

<style lang="scss" scoped></style>
