<template>
    <div class="container">
        <QueryEl ref="queryRef" @handle="handle" />
        <TableEl ref="tableRef" @handle="handle" />
        <DialogEl ref="dialogRef" @handle="handle" />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, type Ref } from 'vue'
import QueryEl from './components/queryEl.vue'
import TableEl from './components/tableEl.vue'
import DialogEl from './components/dialogEl.vue'
import treeData from '@/mixins/treeData'
import { usePermissionsStore } from '@/stores/permissions'
import { permissionsMenu } from '@/utils/utils'
import type { ApiUrl } from 'types/common'
const apiUrl: ApiUrl = {
    list: '/getRoutes',
    add: '/getRoutes',
    edit: '/getRoutes',
    delete: '/getRoutes',
}


const queryRef: any = ref(null)
const dialogRef: any = ref(null)
const tableRef: any = ref(null)


const handle = treeData(apiUrl, queryRef, tableRef, dialogRef, {
    setData(res: any) {
        let permissionsList = permissionsMenu(res); //格式化权限
        usePermissionsStore().permissions = permissionsList;
        tableRef.value.tableData = permissionsList;
        console.log('获取列表:', permissionsList)
    }
})


</script>

<style lang="scss" scoped></style>
