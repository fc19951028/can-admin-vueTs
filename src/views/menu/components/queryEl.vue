<template>
    <div class="queryEl">
        <el-form ref="formRef" inline :model="form">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="菜单状态">
                    <el-option label="正常" value="1" />
                    <el-option label="停用" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-has:system:user:query="onSearch" type="primary" :prefix-icon="Search" @click="">搜索</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus';
const emit = defineEmits(['handle'])
const form = ref({
    name: null,
    status: '',
})
const formRef = ref<FormInstance>();

// 点击搜索
const onSearch = () => {
    emit('handle', 'query', form.value)
}
// 点击重置
const onReset = () => {
    // 表单重置
    formRef.value!.resetFields();
    emit('handle', 'query', form.value)
}

// 暴露表单数据
defineExpose({
    form
})
</script>

<style lang="scss" scoped></style>
