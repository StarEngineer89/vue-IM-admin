import axios from 'axios';
import { ElMessage } from 'element-plus'
import { token } from '@/store'
import router from '@/router'
//console.log(window['apiurl'])

//1. 创建对象
const service = axios.create({
    //baseURL: window['apiurl'],
    baseURL: '/api',
    timeout: 10000
})

//2. 请求拦截器
service.interceptors.request.use(config => {
    if(token.value) config.headers.Authorization = 'Bearer ' + token.value;
    config.headers['Form-type'] = 'PC';
    return config;

}, error => {
    Promise.reject(error);
});

//3. 响应拦截器
service.interceptors.response.use(response => {
    //console.log(response);
    if( response.data.status == 410000 ) {
        ElMessage.closeAll();
        ElMessage({ message: response.data.msg, type: 'error', showClose: true, duration: 3000 })
        router.push({path:'/login'});
    }
    return response.data;
},error => {
    ElMessage.closeAll();
    ElMessage({ message: '网络错误，联系管理员！', type: 'error', showClose: true, duration: 3000 })
    // router.push({path:'/404'});
    console.log('网络错误：', error.config.url);
    return Promise.reject('');
});

export default service;

//https://chatapi.ab25888.cc/admin/captcha