import { createRouter, createWebHistory } from 'vue-router'
import Rule_configuration from '@/views/Rule_configuration.vue'
import HomePage from '@/views/Home_page.vue'
import Assistance_Overview from '@/views/Assistance_Overview.vue'
import Audit_result from '@/views/Audit_result.vue'
import Data_audit from '@/views/Data_audit.vue'
import Model_FineTuning from '@/views/Model_Fine-Tuning.vue'
import Model_management from '@/views/Model_management.vue'
import Quality_audit from '@/views/Quality_audit.vue'
import Data_correction from '@/views/Data_correction.vue'
import Project_Management from '@/views/Project_Management.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/首页'
    },
    {
      path: '/首页',
      component: HomePage,
      name: 'home',
      // 可选：添加别名，提供另一种匹配方式
      alias: '/home'
    },
    {
      path: '/规则配置',
      component: Rule_configuration,
      name: 'rule-config'
    },
    {
      path: '/协助情况概览',
      component: Assistance_Overview,
      name: 'assistance-overview'
    },
    {
      path: '/稽核结果',
      component: Audit_result,
      name: 'audit-result'
    },
    {
      path: '/模型微调',
      component: Model_FineTuning,
      name: 'model-fine-tuning'
    },
    {
      path: '/模型管理',
      component: Model_management,
      name: 'model-management'
    },
    {
      path: '/质量稽核',
      component: Quality_audit,
      name: 'quality-audit'
    },
    {
      path: '/数据修正',
      component: Data_correction,
      name: 'data-correction'
    },
    {
      path: '/项目管理',
      component: Project_Management,
      name: 'project-management'
    },
    {
      path: '/数据稽核',
      component: Data_audit,
      name: 'data-audit'
    },
    {
      // 通配路由放在最后，确保它不会捕获有效路由
      path: '/:pathMatch(.*)*',
      redirect: '/首页'  // 改为重定向到首页而不是根路径
    }
  ],
})

// 使用DOMContentLoaded事件来处理刷新情况
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // 注意：这里我们处理了path为空的情况
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const savedPath = localStorage.getItem('currentPath');
      if (savedPath && savedPath !== '/' && savedPath !== '/首页') {
        console.log('[router/index.ts] DOMContentLoaded: 恢复路径:', savedPath);
        // 使用router.replace避免创建新的历史记录
        router.replace(savedPath).catch(err =>
          console.error('路径恢复失败:', err)
        );
      }
    }
  });
}

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  console.log(`路由导航: 从 ${from.path} 到 ${to.path}`);

  // 统一使用localStorage保存路径
  // 仅当不是重定向到首页的情况下保存
  if (to.path !== '/' && to.path !== '/首页') {
    localStorage.setItem('currentPath', to.path);
    console.log('[router.beforeEach] 保存路径到本地存储:', to.path);
  }

  // 正常导航，删除了可能导致循环的条件判断
  next();
});

// 添加导航后钩子，确认导航完成
router.afterEach((to, from) => {
  console.log(`导航完成: 从 ${from.path} 到 ${to.path}`);
});

export default router
