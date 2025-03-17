<template>
    <el-container>
      <el-aside width="293px" class="aside-container">
        <div class="menu-container">
          <div class="menu-header">
            <el-icon class="menu-icon"><Grid /></el-icon>
            <h5>数据质量稽核工具</h5>
          </div>

          <el-menu background-color="#E1ECF9" default-active="2" class="el-menu-vertical-demo">
            <el-menu-item index="0">
              <el-icon><House /></el-icon>
              <span>主页</span>
            </el-menu-item>

            <el-menu-item index="1">
              <el-icon><Setting /></el-icon>
              <span>规则配置</span>
            </el-menu-item>
            
            <el-sub-menu index="2">
              <template #title>
                <el-icon><DocumentChecked /></el-icon>
                <span>数据稽核</span>
              </template>
                <el-menu-item index="2-1">质量稽核</el-menu-item>
                <el-menu-item index="2-2">稽核结果</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="3">
              <el-icon><Edit /></el-icon>
              <span>数据修正</span>
            </el-menu-item>

            <el-sub-menu index="4">
              <template #title>
                <el-icon><Monitor /></el-icon>
                <span>模型管理</span>
              </template>
                <el-menu-item index="4-1">模型微调</el-menu-item>
                <el-menu-item index="4-2">协助情况概览</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="5">
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
        <el-header class="header-container">
          <div class="header-left">
            <el-icon class="header-icon"><Location /></el-icon>
            <h5 class="header-text">主页</h5>
          </div>
          <div class="header-right">
            <el-icon class="header-icon"><User /></el-icon>
            <h5 class="header-text">你好，管理员</h5>
          </div>
        </el-header>

        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>

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

/* 顶部样式 */
.header-container {
  background-color: #E1ECF9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 107px;
}

/* 顶部左右两个组件 */
.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-text {
  font-size: 18px;
}

.header-icon {
  font-size: 28px;
}
</style>