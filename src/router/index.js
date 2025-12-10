import { createRouter, createWebHistory } from 'vue-router'
import tabPath from './tabPath.js'
import { token } from '@/store'

const routes = [
    //多页面配置 children 第一个路径要是 '/'
    { path: '/', component: ()=>import('../views/index.vue'), children:[{ path: '/', components: tabPath }] },
    { path: '/login', component: ()=>import('../views/login.vue') }
]

const router = createRouter({ history: createWebHistory(), routes})

router.beforeEach((to, from, next) => { 
    if (to.path != '/login' && !token.value ) router.replace('/login');
    else next()
})


export default router