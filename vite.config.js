import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
    resolve: { alias:{ '@' : '/src' } },
    plugins: [ 
        vue(),
        AutoImport({ 
            imports: [ 'vue', '@vueuse/core' ] 
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://chatapi.ab25888.cc', // 后端接口基础地址（真实接口地址）
                changeOrigin: true, // 开启跨域：是否修改请求头中的 Origin 为 target 地址
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})