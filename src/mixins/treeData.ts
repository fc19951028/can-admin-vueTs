
import { getListApi, editListApi, deleteListApi } from '../request/api'
import { usePermissionsStore } from '../stores/permissions'
import type { ApiUrl } from 'types/common'



const treeData = (apiUrl: ApiUrl, queryRef: any, tableRef: any, dialogRef: any, insert: any) => {
    // 获取各种点击操作
    const handle = (event: string, value: any) => {
        if (event == 'list') {
            initDataFn();
        } else if (event == 'add' || event == 'edit') {
            editFormFn(value);
        } else if (event == 'delete') {
            deleteFormFn(value);
        } else if (event == 'query') { // 点击条件查询
            queryFormFn(value);
        } else if (event == 'refresh') { // 点击刷新
            refreshFn(value);
        } else if (event == 'dialog') { // 显示弹窗
            dialogRef.value.setDialogValue(value);
        }
    }
    /**
     * 查询当前页面列表
     * @param isParam {boolean} 表示是否需要通过额外的参数去查询，需要就去queryRef.value?.form取
     */
    const initDataFn = (isParam: boolean = false) => {
        if (tableRef.value) {
            // 启用正在加载页面
            tableRef.value.loading = true
        }
        const params = isParam ? queryRef.value?.form : {};
        getListApi(apiUrl.list!, params).then((res) => {
            if (res.code == 200) {
                const data = res.data
                // 是否拦截数据到外部去处理
                if (insert.setData) {
                    insert.setData(data);
                } else {
                    tableRef.value.tableData = data;
                    console.log('获取列表:', res.data)
                }

            }
        }).finally(() => {
            // 关闭正在加载页面
            tableRef.value.loading = false;
        })
    }
    initDataFn();
    //点击新增或编辑
    const editFormFn = (value: any) => {
        const ref = dialogRef.value;
        ref.$refs.formRef.validate((valid: any, fields: any): void => {
            // 校验成功
            if (valid) {
                // 显示按钮的正在加载
                ref.loading = true;
                editListApi(apiUrl.list!, value).then((res) => {
                    if (res.code == 200) {
                        ElMessage({
                            showClose: true,
                            message: res.message as string,
                            type: 'success'
                        })
                    }
                    ref.dialogVisible = false;
                    initDataFn();
                }).finally(() => {
                    // 关闭按钮的正在加载
                    ref.loading = false;
                })
            } else {
                console.log('error submit!', fields)
            }
        })
    }

    // 点击删除选中项
    const deleteFormFn = (value: any) => {
        const id = value.id;
        console.log(value)
        ElMessageBox.confirm(
            '是否删除',
            '提示',
            {
                cancelButtonText: '取消',
                confirmButtonText: '删除',
                confirmButtonClass: 'confirmButtonClassDelete',
                type: 'warning',
            }
        ).then(() => {
            deleteListApi(apiUrl.delete!, { id }).then(res => {
                if (res.code == 200) {// 提示添加成功的消息
                    ElMessage({
                        showClose: true,
                        message: res.message as string,
                        type: 'success'
                    })
                    // 删除成功重新请求数据
                    initDataFn();
                }
            })
        }).catch(() => { })
    }

    // 点击查询——“条件查询”
    const queryFormFn = (value: any) => {
        initDataFn(true)
    }
    // 点击刷新——“重新查询”
    /**
     * 点击刷新页面数据
     * @param value {boolean} 因为有权限按钮来判断的缘故，刷新的时候，如果没有“查询”权限，
     *                        就只能单纯刷新（不能带参数），所以通过value返回false，表示
     *                        没有“查询”权限，true有权限
     */
    const refreshFn = (value: boolean) => {
        initDataFn(value !== false)
    }
    return handle;
}





export default treeData;