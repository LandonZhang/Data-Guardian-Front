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

    <el-main>
      <!-- 添加一些明显的内容，让你确认页面已加载 -->
      <div class="welcome-section">
        <h2>欢迎使用数据质量稽核工具</h2>
        <p>当前时间：{{ currentTime }}</p>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 添加一个简单的时间变量，用于确认组件已加载
const currentTime = ref(new Date().toLocaleString());

onMounted(() => {
  console.log('Home组件已成功挂载', currentTime.value);
});
</script>

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

/* 添加一些主内容区域的样式 */
.welcome-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 8px;
  text-align: center;
}

.welcome-section h2 {
  color: #2F435D;
  margin-bottom: 20px;
}
</style>
