<template>
  <el-container style="height: 100vh;">
    <el-aside width="293px" class="aside-container">
      <div class="menu-container">
        <div class="menu-header">
          <el-icon class="menu-icon"><Grid /></el-icon>
          <h5>数据质量稽核工具</h5>
        </div>

        <el-menu background-color="#E1ECF9" default-active="/首页" router class="el-menu-vertical-demo">
          <el-menu-item index="/首页">
            <el-icon><House /></el-icon>
            <span>主页</span>
          </el-menu-item>

          <el-menu-item index="/规则配置">
            <el-icon><Setting /></el-icon>
            <span>规则配置</span>
          </el-menu-item>

          <el-sub-menu index="/数据稽核">
            <template #title>
              <el-icon><DocumentChecked /></el-icon>
              <span>数据稽核</span>
            </template>
            <el-menu-item index="/质量稽核">质量稽核</el-menu-item>
            <el-menu-item index="/稽核结果">稽核结果</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/数据修正">
            <el-icon><Edit /></el-icon>
            <span>数据修正</span>
          </el-menu-item>

          <el-sub-menu index="/模型管理">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>模型管理</span>
            </template>
            <el-menu-item index="/模型微调">模型微调</el-menu-item>
            <el-menu-item index="/协助情况概览">协助情况概览</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/项目管理">
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
      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { RouterView } from 'vue-router';
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
