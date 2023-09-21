<template>
    <div class="dialogEl">
        <el-dialog v-model="dialogVisible" :title="type + '菜单'" width="60%">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="上级菜单" prop="parentId">
                    <el-tree-select v-model="form.parentId" value-key="id" :data="selectData" clearable check-strictly
                        :render-after-expand="false" placeholder="请选择上级菜单" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="菜单类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">目录</el-radio>
                        <el-radio :label="2">菜单</el-radio>
                        <el-radio :label="3">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="form.type != 3">
                    <el-popover placement="bottom-start" :teleported="false" trigger="click" effect="light" width="60%">
                        <template #reference>
                            <el-input v-model="form.icon" readonly placeholder="点击选中图标">
                                <template #prepend v-if="form.icon">
                                    <el-button disabled :icon="form.icon" />
                                </template>
                            </el-input>
                        </template>
                        <template #default>
                            <el-scrollbar height="300px">
                                <el-icon v-for="item in iconNames" :key="item" @click="form.icon = item" size="24"
                                    style="padding: 10px;cursor: pointer;">
                                    <component :is="item" />
                                </el-icon>
                            </el-scrollbar>
                        </template>
                    </el-popover>
                </el-form-item>
                <el-row>
                    <el-col :md="12" :sm="24">
                        <el-form-item label="菜单名称" prop="label">
                            <el-input v-model="form.label" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :sm="24">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="form.sort" :min="1" controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-if="form.type != 3">
                    <el-form-item label="路由地址" prop="path">
                        <el-input v-model="form.path" placeholder="请输入路由地址" />
                    </el-form-item>
                    <template v-if="form.type == 2">
                        <el-form-item label="组件名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入组件名称" />
                        </el-form-item>
                    </template>
                    <el-row>
                        <el-col :md="12" :sm="24">
                            <el-form-item label="显示状态" prop="isMenu">
                                <el-switch v-model="form.isMenu" :active-value="1" active-text="显示" inactive-text="隐藏" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :sm="24">
                            <el-form-item label="菜单状态" prop="status">
                                <el-switch v-model="form.status" :active-value="1" active-text="正常" inactive-text="停用" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <template v-else>
                    <el-form-item label="权限标识" prop="auth">
                        <el-input v-model="form.auth" placeholder="请输入权限标识" />
                    </el-form-item>
                </template>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button :loading="loading" type="primary" @click="confirm">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { usePermissionsStore } from '@/stores/permissions'
import type { FormInstance, } from 'element-plus'
import { deepClone } from '@/utils/utils';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


let iconNames: string[] = []
for (const name in ElementPlusIconsVue) {
    iconNames.push(name)
}


// 确认按钮是否显示“正在加载”
const loading = ref(false);
const emit = defineEmits(['handle'])
const formRef = ref<FormInstance>();
// 显示弹窗
const dialogVisible = ref(false)
const type = ref('添加');
// 更改弹窗显示状态
const setDialogValue = (value: any) => {
    if (!value) { // 新增
        // 重置表单
        reset();
        selectData.value = selectDataMap(selectData.value);
        type.value = '添加'
    } else { // 编辑
        // 重置表单
        reset();
        form.value = deepClone(value);
        form.value.parentId = value.parentId || ''
        type.value = '编辑'
        selectData.value = selectDataMap(selectData.value);
    }
    dialogVisible.value = !dialogVisible.value
}

const formBase = {
    id: '',
    parentId: '',
    type: 1,
    name: '',
    label: '',
    sort: 0,
    path: '',
    isMenu: 1,
    status: 1,
    auth: '',
    icon: ''
}
// 重置表单
const reset = () => {
    form.value = formBase;
    formRef.value?.resetFields();
}
const form = ref(formBase)

const rules = reactive({
    label: [
        { required: true, message: '菜单名称不能为空', trigger: 'blur' },
    ],
    path: [
        { required: true, message: '路由地址不能为空', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '组件名称不能为空', trigger: 'blur' },
    ],
    auth: [
        { required: true, message: '权限标识不能为空', trigger: 'blur' },
    ],
})

// 作用：在选择上级菜单的时候，不能选中自己和它的子菜单
const selectDataMap = (arr: any, flag: boolean = false) => {
    arr.forEach((item: any) => {
        if (form.value.id == item.id) {
            item.disabled = true;
        } else {
            item.disabled = flag;
        }
        if (item.children?.length > 0) {
            item.children = selectDataMap(item.children, item.disabled)
        }
    });
    return arr;
}
let selectData = ref(usePermissionsStore().permissions);

// 点击确认去添加或修改
const confirm = () => {
    emit('handle', 'edit', form.value)
}
defineExpose(
    {
        setDialogValue,
        form,
        formRef,
        dialogVisible,
        loading
    }
)
</script>

<style lang="scss" scoped></style>
