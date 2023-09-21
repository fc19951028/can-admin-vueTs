import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../layout/layout.vue'
import { usePermissionsStore } from '@/stores/permissions'
import { useStore as useUserStore } from '@/stores/user'
import { getRoutes } from '@/request/api'
import { deepClone, formatMenu, permissionsMenu } from '@/utils/utils'
const view = (param: String) => {
  return () => import(`@/views/${param}/${param}.vue`)
}

// 静态路由
export const routes: permissions[] = [
  {
    path: '/login',
    name: 'login',
    component: view('login'),
    meta: {
      label: '登录',
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'index',
        component: view('index'),
        meta: {
          label: '首页',
          isMenu: 1,
          type: '2',
          icon: 'Odometer'
        }
      }
    ]
  }
]

// 动态路由
export let addRoutes: permissions[] = [
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






const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[]
})




router.beforeEach((to, from, next) => {
  if (useUserStore().token) {
    console.log(usePermissionsStore().roles)
    // 还没有获取用户权限
    if (usePermissionsStore().roles.length === 0) {
      // 获取 权限列表 and 权限路由
      Promise.all([usePermissionsStore().GET_PERMISSIONS(), usePermissionsStore().GET_ROUTES()])
        .then(res => {
          // 获取成功
          next({ ...to, replace: true })
        }).catch(err => {
          // 如果获取失败就跳转到登录页面重新登录
          next({ name: 'login' })
        })
    } else {
      next()
    }
  } else {
    if (to.name == 'login') {
      next();
    } else {
      next({ name: 'login' })
    }
  }
})




export default router
