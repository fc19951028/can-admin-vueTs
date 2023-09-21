<template>
    <header class="can-col-center can-row-between">
        <div class="left">
            <el-icon :class="{ active: collapse }" @click="toggle($event)" :size="26">
                <ChromeFilled />
            </el-icon>
        </div>
        <div class="right">
            <el-dropdown @command="handleCommand">
                <img :src="userInfo?.avatar" alt="头像" class="avatar">
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                        <el-dropdown-item command="Logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from 'vue'
import { ChromeFilled } from '@element-plus/icons-vue'
import { useStore } from '@/stores/user'

const emit = defineEmits(['toggle'])
const { collapse } = defineProps(['collapse']);
const store = useStore();
// 切换侧边导航收缩状态
const toggle = (event: Event) => {
    emit('toggle')
}
const { userInfo } = store
const handleCommand = (event: String) => {
    if (event == 'userCenter') { // 个人中心

    } else if (event == 'Logout') { // 退出登录
        store.REMOVE_ALL();
    }
}

</script>

<style lang="scss" scoped>
header {
    width: 100%;
    height: var(--header-height);
    background: #fff;
    padding: 0 10px;
    box-sizing: border-box;

    .el-icon {
        cursor: pointer;
        transition: .3s all linear;
        transform: rotate(0deg);

        &.active {
            transform: rotate(360deg);
        }
    }

    .right {
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #eee;
        }

        padding-right: 20px;
    }
}
</style>
