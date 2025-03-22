// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Pinia
import { createPinia } from 'pinia'

// Vue Router（若启用了路由）
import router from '@/router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

// 注册 Pinia
app.use(createPinia())

// 注册 Vue Router
app.use(router)

// 注册 Element Plus
app.use(ElementPlus, {
  locale: zhCn
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 使用路由器
app.use(router)

app.mount('#app')
