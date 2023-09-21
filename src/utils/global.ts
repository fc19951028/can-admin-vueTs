import { ref, type App, type DirectiveBinding } from 'vue'
// element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { usePermissionsStore } from '@/stores/permissions'
export default {
    install(app: App) {
        // 注册element图标所有图标
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }


        // 逻辑封装
        const interceptors = (bind: DirectiveBinding<any>) => {
            return () => {
                const arg = bind.arg as string;
                const role_permissions = ref(usePermissionsStore().role_permissions);
                // 判断是否有权限
                if (role_permissions.value.includes(arg)) {
                    // 正常触发点击事件
                    bind.value();
                } else {
                    // 判断.go存不存在，表示有go的情况下，只判断有没有权限,不做拦截，返回【false】给监听者就行
                    if (bind.modifiers?.go) {
                        bind.value(false);
                    } else {
                        // 没有权限便进行拦截
                        ElMessage.error('没有此权限,请联系相关人员开通')
                    }
                }
            }
        };
        // 全局自定义指令
        app.directive('has', {
            // 注册事件
            created(el, bind) {
                el.addEventListener('click', interceptors(bind))
            },
            // 卸载事件
            unmounted(el, bind) {
                el.removeEventListener('click', interceptors)
            }
        })
    }
}