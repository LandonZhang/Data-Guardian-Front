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
        <Select @project-selected="handleProjectSelected" :reset-project="resetProject" />
      </div>
      <div class="chat-container">
        <div v-if="!chatStarted" class="start-button-container">
          <el-button type="primary" @click="startChat">开始对话</el-button>
        </div>
        <Chat
          v-else
          :selected-project="currentProject"
          :conversation-id="conversationId"
          @new-chat-started="resetSelectedProject"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import Chat from '@/components/Quality_Audit/Chat_window.vue'
import Select from '@/components/Quality_Audit/Select_project.vue'
import request from '@/utils/request'

const currentProject = ref('')
const chatStarted = ref(false)
const conversationId = ref('')
const resetProject = ref(false)

// Handle project selection from the Select component
const handleProjectSelected = (project: string) => {
  currentProject.value = project
}

// Reset selected project when a new chat is started
const resetSelectedProject = () => {
  currentProject.value = ''
  resetProject.value = true

  // Reset the flag after a short delay to trigger the watcher in Select component
  setTimeout(() => {
    resetProject.value = false
  }, 100)
}

// Start chat
const startChat = async () => {
  try {
    // 尝试调用后端接口
    const newConversationResponse = await request.post('/llm/chat/new-conversation', {
      user: 'root',
    })

    if (newConversationResponse.data.status === 'success') {
      // 显示成功消息
      ElMessage({
        message: newConversationResponse.data.message,
        type: 'success',
        duration: 3000,
      })

      // 获取对话ID
      const getConversationIdResponse = await request.get('/llm/chat/conversation-id/root')

      // 保存对话ID
      conversationId.value = getConversationIdResponse.data.conversation_id

      // 开始对话
      chatStarted.value = true
    }
  } catch (error) {
    console.error('后端接口未开放，使用模拟数据:', error)

    // 使用模拟数据
    ElMessage({
      message: '使用模拟数据模式：已开始新对话',
      type: 'info',
      duration: 3000,
    })

    // 设置模拟的对话ID
    conversationId.value = 'mock_conversation_' + Date.now()

    // 开始对话
    chatStarted.value = true
  }
}
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
  position: relative;
  height: 50px;
  padding: 15px 15px 15px 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 10px;
}

/* 聊天窗口背景 */
.chat-container {
  height: 655px;
  padding: 20px 30px;
  background-color: #f2f6fc;
  border-radius: 10px;
  position: relative;
}

/* 开始对话按钮容器 */
.start-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
