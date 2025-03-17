<template>
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
    
    <el-main></el-main>
  </el-container>
</template>

<style scoped>
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
    color: #2F435D;
  }

  .header-icon {
    font-size: 28px;
    color: #2F435D;
  }
</style>