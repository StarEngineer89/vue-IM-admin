import './assets/script/index.js'
import router from './router'  //页面路由
import global from './assets/utils/global.js'         //全局属性
import elementPlus from 'element-plus'                //Element Plus 组件 默认使用英文
import zhCn from 'element-plus/es/locale/lang/zh-cn'  //转中文（国际化）
import 'element-plus/theme-chalk/dark/css-vars.css'   //暗黑模式 使用<html class="dark">
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import directive from './assets/utils/directive'      //自定义指令
import './assets/style/index.css'

document.title = 'IM管理系统';

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp( App )
app.use( router ) 
app.use( global ) 
app.use( elementPlus, {locale: zhCn} )  //UI组件设置中文
for (const [key, component] of Object.entries(ElementPlusIconsVue)) { app.component(key, component) }
app.use( directive )
app.mount( '#app' )