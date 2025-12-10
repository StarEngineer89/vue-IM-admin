import axios from './axios.js'
import tips from './message.js'

//全局属性
export default {
    install: app => {
        app.config.globalProperties.axios = axios;
        app.config.globalProperties.tips = tips;
    }
}

// 使用
// import global from './assets/utils/global'         //全局属性
// app.use( global )
// import { getCurrentInstance } from 'vue'
// const { proxy: { axios, tips } } = getCurrentInstance();