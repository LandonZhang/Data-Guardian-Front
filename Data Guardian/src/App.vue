<template>
  <el-container style="height: 100vh;">
    <el-aside width="293px" class="aside-container">
      <div class="menu-container">
        <div class="menu-header">
          <el-icon class="menu-icon"><Grid /></el-icon>
          <h5>数据质量稽核工具</h5>
        </div>

        <el-menu background-color="#E1ECF9" :default-active="activeIndex" class="el-menu-vertical-demo">
          <el-menu-item index="/首页" @click="goToHome">
            <el-icon><House /></el-icon>
            <span>主页</span>
          </el-menu-item>

          <el-menu-item index="/规则配置" @click="navigateTo('/规则配置')">
            <el-icon><Setting /></el-icon>
            <span>规则配置</span>
          </el-menu-item>

          <el-sub-menu index="/数据稽核">
            <template #title>
              <el-icon><DocumentChecked /></el-icon>
              <span>数据稽核</span>
            </template>
            <el-menu-item index="/质量稽核" @click="navigateTo('/质量稽核')">质量稽核</el-menu-item>
            <el-menu-item index="/稽核结果" @click="navigateTo('/稽核结果')">稽核结果</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/数据修正" @click="navigateTo('/数据修正')">
            <el-icon><Edit /></el-icon>
            <span>数据修正</span>
          </el-menu-item>

          <el-sub-menu index="/模型管理">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>模型管理</span>
            </template>
            <el-menu-item index="/模型微调" @click="navigateTo('/模型微调')">模型微调</el-menu-item>
            <el-menu-item index="/协助情况概览" @click="navigateTo('/协助情况概览')">协助情况概览</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/项目管理" @click="navigateTo('/项目管理')">
            <el-icon><Notebook /></el-icon>
            <span>项目管理</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="menu-footer">
        <img src="@/assets/images/menu-footer.png" alt="菜单底部图片" class="menu-image" />
      </div>
    </el-aside>

    <el-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
      </router-view>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeIndex = ref(route.path);

// 专门处理首页导航的函数
const goToHome = () => {
  console.log('导航到首页');
  // 添加时间戳确保每次都是新的导航
  router.push({
    path: '/首页',
    query: { t: Date.now().toString() }
  });
};

// 处理其他页面的导航
const navigateTo = (path) => {
  console.log('导航到:', path);
  if (route.path === path) {
    // 如果是相同路径，添加时间戳查询参数强制重新渲染
    router.push({
      path: path,
      query: { t: Date.now().toString() }
    });
  } else {
    // 不同路径正常导航
    router.push(path);
  }
};

// 监听路由变化更新菜单高亮
watch(() => route.path, (newPath) => {
  console.log('路由变化到:', newPath);
  activeIndex.value = newPath;
});

// 页面加载时处理菜单高亮和路径恢复
onMounted(() => {
  console.log('App组件挂载，当前路由路径:', route.path);

  // 设置当前高亮菜单项
  if (route.path && route.path !== '/') {
    activeIndex.value = route.path;
    // 统一使用localStorage存储路径
    localStorage.setItem('currentPath', route.path);
  }
  // 如果是根路径，则尝试从localStorage恢复
  else {
    const savedPath = localStorage.getItem('currentPath');
    if (savedPath && savedPath !== '/' && savedPath !== '/首页') {
      // 如果是刷新情况，应该导航到保存的路径
      activeIndex.value = savedPath;
      // 简单延迟确保路由已完全初始化
      setTimeout(() => {
        router.replace(savedPath);
      }, 0);
    } else {
      activeIndex.value = '/首页';
    }
  }
});
</script>

<style scoped>
/* 整个菜单 */
.menu-container {
  width: 293px;
  height: 100vh;
  background-color: #E1ECF9;
}

/* 菜单标题 */
.menu-header {
  width: 293px;
  height: 108px;
  background-color: #2F435D;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* 标题图标 */
.menu-icon {
  color: white;
  font-size: 30px;
}

/* 标题文本 */
.menu-header h5 {
  color: white;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

/* 所有菜单项文字 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #2F435D !important;
}

/* 一级菜单默认 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  font-size: 18px !important;
  font-weight: bold !important;
}

/* 二级菜单默认 */
:deep(.el-sub-menu .el-menu-item) {
  font-size: 16px !important;
  font-weight: normal !important;
  background-color: #F7F7F7 !important;
}

/* 选中一级菜单时 */
:deep(.el-menu-item.is-active) {
  font-size: 16px !important;
  background-color: #E6F7FF !important;
  color: #2F435D !important;
  font-weight: normal !important;
}

/* 选中二级菜单时 */
:deep(.el-sub-menu .el-menu-item.is-active) {
  font-size: 14px !important;
  background-color: #E6F7FF !important;
  color: #2F435D !important;
  font-weight: normal !important;
}

/* 菜单底部图片 */
.aside-container {
  position: relative;
  overflow: hidden;
}

.menu-footer {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 293px;
  height: 295px;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* 仅针对菜单内的 router-link 重置默认样式 */
.menu-container a {
  text-decoration: none;
  color: inherit;
}

/* router-link 激活状态重置 */
.router-link-active,
.router-link-exact-active {
  text-decoration: none;
  color: inherit;
}
</style>
