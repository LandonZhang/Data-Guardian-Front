// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Pinia
import { createPinia } from 'pinia'

// Vue Router
import router from '@/router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 注意：移除了这段代码，因为它与其他恢复逻辑冲突
// if (window.location.pathname === '/' || window.location.pathname === '') {
//   const savedPath = localStorage.getItem('currentPath');
//   if (savedPath && savedPath !== '/' && savedPath !== '/首页') {
//     console.log('[main.ts] 检测到页面刷新，恢复路径:', savedPath);
//     window.history.replaceState({}, '', savedPath);
//   }
// }

const app = createApp(App)

// 注册 Pinia
app.use(createPinia())

// 注册 Vue Router (只注册一次)
app.use(router)

// 注册 Element Plus
app.use(ElementPlus, {
  locale: zhCn
})

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加浏览器刷新事件监听
window.addEventListener('beforeunload', () => {
  // 统一使用localStorage，确保无论何时刷新都能恢复路径
  if (router.currentRoute.value.path !== '/' && router.currentRoute.value.path !== '') {
    console.log('[beforeunload] 保存当前路径:', router.currentRoute.value.path);
    localStorage.setItem('currentPath', router.currentRoute.value.path);
  }
});

app.mount('#app')
