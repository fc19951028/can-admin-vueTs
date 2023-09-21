<template>
    <div class="tableEl">
        <div class="btn can-row-between">
            <div class="left">
                <el-button v-has:system:user:add="() => handleAdd('')" type="primary" :icon="Plus" plain>新增</el-button>
            </div>
            <div class="right">
                <el-tooltip content="刷新" placement="top">
                    <el-button v-has:system:user:query.go="refresh" :icon="Refresh" circle></el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="table">
            <el-table v-loading="loading" :data="(tableData as any)" row-key="id" table-layout="auto" style="width: 100%">
                <el-table-column prop="label" label="菜单名称" width="160" />
                <el-table-column prop="icon" label="图标" width="100" align="center">
                    <template #default="scope">
                        <el-icon>
                            <component :is="scope.row.icon"></component>
                        </el-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="60" align="center" />
                <el-table-column prop="auth" label="权限标识" min-width="200" />
                <el-table-column prop="name" label="组件" width="120" align="center" />
                <el-table-column prop="status" label="状态" width="80" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status">正常</el-tag>
                        <el-tag type="danger" v-else>停用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" min-width="200" align="center" />
                <el-table-column label="操作" align="center" min-width="200">
                    <template #default="scope">
                        <el-button size="small"
                            v-has:system:user:edit="() => handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger"
                            v-has:system:user:remove="() => handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus, Refresh } from '@element-plus/icons-vue'
const emit = defineEmits(['handle'])
// 是否“正在加载”
const loading = ref(true);
// 点击“新增”显示弹窗
const handleAdd = (value: string) => {
    emit('handle', 'dialog', value)
}
// 点击“编辑”显示弹窗
const handleEdit = (index: number, row: any) => {
    emit('handle', 'dialog', row)
}
// 点击“删除”
const handleDelete = (index: number, row: any) => {
    emit('handle', 'delete', row)
}
// 点击“刷新”
const refresh = (value: boolean) => {
    emit('handle', 'refresh', value)
}
// 表格列表数据
const tableData = ref([]);


defineExpose({
    loading,
    tableData
})
</script>

<style lang="scss" scoped>
.tableEl {
    margin-top: 10px;
}
</style>
