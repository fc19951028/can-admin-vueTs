import axios from "axios";
import { useStore } from '@/stores/user'
import router from "@/router";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.token = useStore().token;
    config.params = config.params || {};
    config.params.token = useStore().token;
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    if (response.data.code == 200) {
        return response.data;
    } else if (response.data.code == 401) {
        // 登录验证失败，跳转到login页面。
        ElMessage.error('请重试登录！')
        router.push({ name: "login" })
        return Promise.reject(response.data);
    } else if (response.data.code == 500 || response.data.code == 501) {
        ElMessage({
            showClose: true,
            message: response.data.message,
            type: 'error',
        })
        return Promise.reject(response.data);
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default instance;










// import router from '@/router';
// import { useStore } from '@/store';


// // console.log(import.meta.env)
// // console.log(import.meta.env.VITE_BASE_API)
// const instance = axios.create({
//     baseURL: import.meta.env.VITE_BASE_API,
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
// })

// instance.interceptors.request.use(config => {
//     const store = useStore();
//     config.headers!.token = store.token;
//     return config;
// }, err => {
//     return Promise.reject(err);
// })


// instance.interceptors.response.use(result => {
//     if(result.data.code==200){
//         return result.data;
//     }else if(result.data.code==401){
//         // 登录验证失败，跳转到login页面。
//         ElMessage({
//             showClose: true,
//             message: "请重试登录！",
//             type: 'error',
//         })
//         router.push({name:"login"})
//         // return Promise.reject(result.data);
//     }else if(result.data.code==501){
//         // 501报错时直接提示报错原因
//         ElMessage({
//             showClose: true,
//             message: result.data.message,
//             type: 'error',
//         })
//         // return Promise.reject(result.data);
//     }else{
//         // return Promise.reject(result.data);
//     }
//     return Promise.reject(result.data);
// }, err => {
//     if(err.response.status==500){
//         // 500报错时直接提示报错原因
//         ElMessage({
//             showClose: true,
//             message: '内部服务器错误',
//             type: 'error',
//         })
//     }
//     return Promise.reject(err);
// })

// export default instance;