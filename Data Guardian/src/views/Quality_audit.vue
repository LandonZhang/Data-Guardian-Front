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
      <div class="select-container">
        <Select/>
      </div>
      <div class="chat-container">
        <Chat/>
      </div>
    </el-main>
  </el-container>
</template>



<script setup lang="ts">
import Chat from '@/components/Quality_audit/Chat_window/Chat_window.vue'
import Select from '@/components/Quality_audit/Select_project/Select_project.vue'
</script>



<style scoped>
/* 顶部样式 */
.header-container {
  background-color: #e1ecf9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px;
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
  color: #2f435d;
}

.header-icon {
  font-size: 28px;
  color: #2f435d;
}

/* 下拉框背景 */
.select-container {
  height: 50px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 15px;
}

/* 聊天窗口背景 */
.chat-container {
  height: 655px;
  padding: 20px 30px;
  background-color: #f2f6fc;
  border-radius: 10px;
  position: relative;
}

</style>