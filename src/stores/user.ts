import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { storage } from '@/utils/utils'
import { usePermissionsStore } from './permissions'
export const useStore = defineStore('user', () => {
    const token: Ref<null | string> = ref(storage('token'));
    const userInfo: Ref<null | userInfoInf> = ref(storage('userInfo'));
    const SET_TOKEN = (val: null | string) => {
        token.value = val;
        storage('token', val);
    }
    const SET_USERINFO = (val: null | userInfoInf) => {
        userInfo.value = val;
        storage('userInfo', val);
    }
    // 清除用户信息并跳转到登录页面
    const REMOVE_ALL = () => {
        token.value = null;
        userInfo.value = null;
        storage('token', null);
        storage('userInfo', null);
        usePermissionsStore().REMOVE_ALL();
        router.push({ name: 'login' })
    }


    return { token, userInfo, SET_TOKEN, SET_USERINFO, REMOVE_ALL }
})