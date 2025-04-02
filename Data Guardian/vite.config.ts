import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    open: true,
    allowedHosts: [
      '106du4794em71.vicp.fun',
      // 可以添加更多允许的域名
    ],
    // 配置 historyApiFallback 使刷新页面工作
    historyApiFallback: {
      rewrites: [
        // 确保任何未匹配的URL都被重定向到index.html
        { from: /.*/, to: '/index.html' },
      ],
    },
    proxy: {
      // 这是一个空代理配置，但可以启用其他服务器选项
    },
  },
  // 添加生产环境配置
  build: {
    // 生成 .htaccess 文件，对于某些托管环境很有用
    // 这会创建一个支持HTML5历史API的重写规则
    outDir: 'dist',
    emptyOutDir: true,
  },
})
