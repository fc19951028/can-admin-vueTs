import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import router, { routes } from '@/router'
import { storage, deepClone, formatMenu, permissionsMenu } from '@/utils/utils'
import { getInfo, getRoutes } from '@/request/api'
import { useStore as useUserStore } from './user'
const view = (param: String) => {
    return () => import(`@/views/${param}/${param}.vue`)
}
export const usePermissionsStore = defineStore('permissions', () => {

    // 用户权限列表——路由和按钮权限
    const permissions: Ref<permissions[]> = ref([]);
    // 用户路由列表
    const menus: Ref<permissions[]> = ref([]);

    // 当前角色
    const roles = ref([]);
    // 当前角色权限
    const role_permissions = ref<string[]>([]);

    let addRoutes: permissions[] = [
        {
            path: '/:pathMatch(.*)',
            name: '404',
            component: view('login'),
            meta: {
                label: '404',
                isMenu: 0,
                type: '2',
            }
        },
    ]

    // 清空数据
    const REMOVE_ALL = () => {
        permissions.value = [];
        menus.value = [];
        roles.value = [];
        role_permissions.value = [];
    }
    // 获取权限列表
    const GET_PERMISSIONS = () => {
        return new Promise((resolve, reject) => {
            getInfo().then(res => {
                if (res.code == 200) {
                    console.log(11111, res.data)
                    role_permissions.value = res.data.permissions;
                    roles.value = res.data.roles;
                    useUserStore().SET_USERINFO(res.data.userInfo)
                    console.log(role_permissions.value)
                    resolve(res.data)
                }
                reject(res.message)
            }).catch(err => {
                reject(err)
            })
        })

    }
    // 获取路由列表
    const GET_ROUTES = () => {
        return new Promise((resolve, reject) => {
            getRoutes().then(res => {
                if (res.code == 200) {
                    // 这里假设接口返回的数据没有经过格式化，是个一维数组（所有父子菜单、按钮都在同一级返回）
                    const data = res.data;
                    let permissionsList = permissionsMenu(data); //格式化权限列表
                    let list = formatMenu(deepClone(permissionsList)); // 格式化路由菜单
                    permissions.value = permissionsList;
                    menus.value = routes[1].children!.concat(list);;
                    addRoutes = list.concat(addRoutes);
                    // 遍历添加动态路由
                    addRoutes.forEach((item: any) => {
                        router.addRoute('Layout', item)
                    });
                    resolve(res.data)
                }
                reject(res.message)
            }).catch(err => {
                reject(err)
            })
        })

    }






    return { permissions, role_permissions, roles, menus, GET_PERMISSIONS, GET_ROUTES, REMOVE_ALL }
})