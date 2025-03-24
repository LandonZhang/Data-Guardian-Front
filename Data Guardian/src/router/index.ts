import { createRouter, createWebHistory } from 'vue-router'
import Rule_configuration from '@/views/Rule_configuration.vue'
import Home from '@/views/Home.vue'
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
    {path: '/首页', 
    component: Home},
    {path:'/规则配置',
    component:Rule_configuration
    },
    {path:'/协助情况概览',
    component:Assistance_Overview
    },
    {path:'/稽核结果',
      component:Audit_result
    },
    {path:'/模型微调',
      component:Model_FineTuning
    },
    {path:'/模型管理',
      component:Model_management
    },
    {path:'/质量稽核',
      component:Quality_audit
    },
    {path:'/数据修正',
      component:Data_correction
    },
    {path:'/项目管理',
      component:Project_Management
    },
    {path:'/数据稽核',
      component:Data_audit
    },
  ],
})

export default router
