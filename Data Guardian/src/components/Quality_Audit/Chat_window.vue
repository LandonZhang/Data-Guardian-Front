<script setup lang="ts">
import { ref, defineProps, watch, nextTick, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import NewChat from "@/components/Quality_Audit/New_chat_button.vue"
import RequirementDialog from '@/components/Quality_Audit/Requirement_dialog.vue';

interface Message {
  text: string;
  isUser: boolean;
  isAudit?: boolean;
  auditProgress?: number;
  hasRequirementSaved?: boolean; // 标记是否显示"需求记录已保存"
  id?: string; // 消息ID，用于后端查询
}

// Define props to receive selected project from parent
const props = defineProps({
  selectedProject: {
    type: String,
    default: ''
  },
  conversationId: {
    type: String,
    default: ''
  }
});

// Define emits to send events to parent
const emit = defineEmits(['newChatStarted']);

const userInput = ref('');
const messages = ref<Message[]>([]);
const isInputDisabled = ref(true); // 默认禁用输入框，直到用户选择项目
const hasUserSentMessage = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const lastModelResponseIndex = ref(-1); // 记录最后一条模型回复的索引

// 需求记录弹窗相关
const requirementDialogVisible = ref(false);
const currentMessageId = ref('');
// 添加初始请求和最终请求的存储
const initialRequest = ref('');
const finalRequest = ref('');

// Function to scroll to the bottom of the messages container
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Watch for changes in the messages array
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// 监视selectedProject变化，决定是否启用输入框
watch(() => props.selectedProject, (newProject) => {
  isInputDisabled.value = !newProject;

  if (newProject) {
    ElMessage({
      message: `已选择项目: ${newProject}`,
      type: "success",
      duration: 3000
    });
  }
});

// Also scroll to bottom on mount
onMounted(() => {
  scrollToBottom();

  // 在组件渲染时提示用户选择项目
  ElMessage({
    message: "请先选择进行数据稽核的项目",
    type: "warning",
    duration: 3000
  });

  // 初始状态下禁用输入框，除非已经选择了项目
  isInputDisabled.value = !props.selectedProject;
});

// 添加处理中状态变量
const isProcessing = ref(false);

async function sendMessage() {
  if (userInput.value.trim() && !isProcessing.value) {
    const userMessage = userInput.value.trim();

    // 保存用户输入的内容
    messages.value.push({ text: userMessage, isUser: true });

    // 清空输入框
    userInput.value = '';

    // 设置处理中状态，禁用输入
    isProcessing.value = true;

    // 检查用户回复是否为"数据稽核开始"
    if (userMessage === "数据稽核开始") {
      if (!hasUserSentMessage.value) {
        // 用户第一次输入就是"数据稽核开始"
        ElMessage({
          message: "你还未提出任何要求，无法进行数据稽核",
          type: "warning",
          duration: 3000
        });
        isProcessing.value = false; // 重置处理状态
        return;
      }

      // 启动稽核模式（保留现有逻辑）
      startAuditMode();

      // 向后端发送固定请求
      try {
        const response = await axios.post('http://127.0.0.1:8080/llm/chat', {
          query: "数据稽核开始",
          user: "root"
        });

        // 解析响应数据
        if (response.data && response.data.answer) {
          const answer = response.data.answer;

          // 使用正则表达式提取初始请求和最终请求
          const initialRequestMatch = answer.match(/用户的初始请求是：([\s\S]*?)(?=\n最终确认请求是：|$)/);
          const finalRequestMatch = answer.match(/最终确认请求是：([\s\S]*?)$/);

          if (initialRequestMatch && initialRequestMatch[1]) {
            initialRequest.value = initialRequestMatch[1].trim();
          } else {
            console.warn('无法从响应中提取初始请求');
            initialRequest.value = '未能获取初始请求数据';
          }

          if (finalRequestMatch && finalRequestMatch[1]) {
            finalRequest.value = finalRequestMatch[1].trim();
          } else {
            console.warn('无法从响应中提取最终请求');
            finalRequest.value = '未能获取最终请求数据';
          }
        }
      } catch (error) {
        console.error('获取需求记录失败:', error);

        // 错误情况下使用模拟数据
        initialRequest.value = "我是奶龙";
        finalRequest.value = "你才是奶龙";

        ElMessage({
          message: "无法连接到服务器，使用模拟数据",
          type: "warning",
          duration: 3000
        });
      }

      return;
    }

    // 设置用户已发送消息的标志
    hasUserSentMessage.value = true;

    // 构建包含项目信息的查询
    const projectPrefix = props.selectedProject ? `我需要检查${props.selectedProject}的项目，` : '';
    const queryWithProject = projectPrefix + userMessage;

    try {
      // 向后端发送请求
      const response = await axios.post('http://127.0.0.1:8080/llm/chat', {
        query: queryWithProject,
        user: "root"
      });

      // 解析响应数据
      const answer = response.data.answer;
      const messageId = response.data.id || `msg_${Date.now()}`; // 使用后端返回的ID或生成临时ID

      // 显示响应消息（带逐字输出效果）
      await displayResponseWithTypingEffect(answer, messageId);

      // 更新最后一条模型回复的索引
      lastModelResponseIndex.value = messages.value.length - 1;

    } catch (error) {
      console.error('与后端通信失败:', error);

      // 使用模拟数据
      const mockResponse = {
        answer: "要优化MySQL查询性能，您可以：\n 1. 建立合适的索引 \n 2. 优化查询语句\n 3. 合理设计表结构 \n 4. 使用查询缓存\n 5. 适当分表分库",
        conversation_id: "conv_abc123",
        created_at: 1679123456,
        id: `msg_${Date.now()}`
      };

      // 根据错误类型显示不同的提示
      if (error.response && error.response.status === 500) {
        ElMessage({
          message: "处理请求时发生错误，使用模拟数据代替",
          type: "error",
          duration: 3000
        });
      } else if (error.response && error.response.status === 504) {
        ElMessage({
          message: "与Dify通信超时，使用模拟数据代替",
          type: "error",
          duration: 3000
        });
      } else {
        ElMessage({
          message: "使用模拟数据模式",
          type: "info",
          duration: 3000
        });
      }

      // 显示模拟响应（带逐字输出效果）
      await displayResponseWithTypingEffect(mockResponse.answer, mockResponse.id);

      // 更新最后一条模型回复的索引
      lastModelResponseIndex.value = messages.value.length - 1;
    } finally {
      // 无论成功还是失败，最终都重置处理状态
      isProcessing.value = false;
    }
  }
}

function displayResponseWithTypingEffect(text, messageId) {
  return new Promise((resolve) => {
    let currentText = '';
    let index = 0;

    // 添加空消息用于逐字填充
    messages.value.push({
      text: '',
      isUser: false,
      id: messageId
    });

    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        messages.value[messages.value.length - 1].text = currentText;
        // This will trigger the watcher to scroll to bottom
        index++;
      } else {
        clearInterval(interval);
        resolve(); // 完成打字效果后解析Promise
      }
    }, 30); // 调整速度，数值越小打字效果越快
  });
}

function startAuditMode() {
  isInputDisabled.value = true; // 禁用输入框
  isProcessing.value = true; // 设置处理中状态

  const auditMessage = {
    text: '',
    isUser: false,
    isAudit: true,
    auditProgress: 0
  };

  messages.value.push(auditMessage);

  // 记录当前消息列表长度，以便在稽核完成后标记正确的消息
  const auditStartIndex = messages.value.length - 1;

  const progressInterval = setInterval(() => {
    const lastAuditMessage = messages.value[auditStartIndex];

    if (lastAuditMessage && lastAuditMessage.auditProgress !== undefined) {
      if (lastAuditMessage.auditProgress < 100) {
        lastAuditMessage.auditProgress += 10;
      } else {
        clearInterval(progressInterval);
        isProcessing.value = false; // 稽核完成后重置处理状态

        // 在稽核完成时，为最后一条模型回复添加"需求记录已保存"标记
        if (lastModelResponseIndex.value >= 0) {
          // 获取最后一条模型回复
          const lastModelResponse = messages.value[lastModelResponseIndex.value];
          // 添加需求记录已保存标记
          if (lastModelResponse && !lastModelResponse.isUser) {
            lastModelResponse.hasRequirementSaved = true;
          }
        }
      }
    }
  }, 500);
}

// 显示需求记录弹窗
function showRequirementDialog(message) {
  // 设置当前消息ID，以便弹窗组件从后端获取详细信息
  currentMessageId.value = message.id || '';

  // 显示弹窗
  requirementDialogVisible.value = true;
}

// 处理换行操作
function handleKeydown(event) {
  if (!event.shiftKey && !isProcessing.value) {
    event.preventDefault();
    sendMessage();
  }
}

// 处理换行样式
function formatMessage(message) {
  return message.replace(/\n/g, '<br>');
}

// 新建对话
async function startNewConversation() {
  try {
    // 发送请求创建新对话
    const response = await axios.post('http://127.0.0.1:8080/llm/chat/new-conversation', {
      user: "root"
    });

    if (response.data.status === "success") {
      // 显示成功消息
      ElMessage({
        message: response.data.message,
        type: "success",
        duration: 3000
      });

      // 清空聊天记录和状态
      clearChat();

      // 发出事件通知父组件需要清空已选择的项目
      emit('newChatStarted');
    }
  } catch (error) {
    console.error('创建新对话失败:', error);

    // 使用模拟数据
    ElMessage({
      message: "已开始新对话",
      type: "success",
      duration: 3000
    });

    // 清空聊天记录和状态
    clearChat();

    // 发出事件通知父组件需要清空已选择的项目
    emit('newChatStarted');
  }
}

// 清空聊天记录
function clearChat() {
  messages.value = [];
  isInputDisabled.value = !props.selectedProject; // 根据是否选择了项目决定输入框状态
  isProcessing.value = false; // 确保处理状态被重置
  hasUserSentMessage.value = false;
  userInput.value = '';
  lastModelResponseIndex.value = -1; // 重置最后一条模型回复的索引
  // 重置需求记录
  initialRequest.value = '';
  finalRequest.value = '';
}
</script>

<template>
  <div class="chat-window">
    <div class="messages" ref="messagesContainer">
      <!-- 添加需求记录已保存标记 - 放在消息框的外部上方 -->
      <div v-for="(message, index) in messages" :key="index">
        <div
          class="requirement-saved"
          v-if="message.hasRequirementSaved && !message.isUser"
          @click="showRequirementDialog(message)"
        >
          <el-icon><CircleCheckFilled /></el-icon>
          需求记录已保存
        </div>
        <div
          :class="{'user-message': message.isUser, 'bot-message': !message.isUser, 'audit-message': message.isAudit}"
          class="message-item"
        >
          <template v-if="message.isUser">
            <el-icon class="message-icon"><UserFilled /></el-icon>
            <div v-html="formatMessage(message.text)" />
          </template>
          <template v-else-if="message.isAudit">
            <div class="audit-container">
              <div class="audit-content">
                <div class="audit-icon">
                  <el-icon><MessageBox /></el-icon>
                </div>
                <div class="audit-text">稽核中，请稍后</div>
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: message.auditProgress + '%' }"></div>
                  </div>
                  <div class="progress-text">
                    <span class="percentage">{{ message.auditProgress }}%</span>
                  </div>
                </div>
              </div>
              <div class="audit-result" v-if="message.auditProgress >= 100">
                感谢您的等待，本次稽核已完成，<a href="#" class="audit-link">点击查看稽核报告</a>。如需再次开启稽核，请点击右下角新建对话。
              </div>
            </div>
          </template>
          <template v-else>
            <div v-html="formatMessage(message.text)" />
          </template>
        </div>
      </div>
    </div>

    <!-- 发消息消息框 -->
    <div class="input">
      <div class="input-container">
        <el-input
          v-model="userInput"
          placeholder="发消息"
          @keydown.enter="handleKeydown"
          class="input-field"
          type="textarea"
          :rows="5"
          :disabled="isInputDisabled || isProcessing"
        />
        <NewChat @click="startNewConversation"/>
        <el-button @click="sendMessage" class="send-button" circle :disabled="isProcessing || isInputDisabled">
          <el-icon v-if="!isProcessing"><Position /></el-icon>
          <el-icon v-else class="is-loading"><Loading /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 需求记录弹窗 -->
    <RequirementDialog
      v-model:visible="requirementDialogVisible"
      :conversation-id="props.conversationId"
      :message-id="currentMessageId"
      :initial-request="initialRequest"
      :final-request="finalRequest"
    />
  </div>
</template>

<style scoped>
.chat-window {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  flex-grow: 1;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #2f435d;
}

.message-icon {
  font-size: 25px;
  align-self: flex-start;
}

.bot-message {
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  width: 1240px;
}

.audit-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.audit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.audit-icon {
  font-size: 60px;
  color: #409EFF;
}

.audit-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2f435d;
}

.progress-container {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  flex-grow: 1;
}

.progress-fill {
  height: 100%;
  background-color: #409EFF;
  transition: width 0.5s ease;
}

.progress-text {
  text-align: right;
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.audit-result {
  width: 100%;
  text-align: left;
  margin-top: 10px;
  padding: 0 20px;
  margin-bottom: 15px;
}

.audit-link {
  color: #409EFF;
  text-decoration: none;
}

.audit-link:hover {
  text-decoration: underline;
}

.input {
  position: absolute;
  right: 20px;
  left: 20px;
  bottom: 20px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.input-field {
  flex-grow: 1;
}

.send-button {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.input-field :deep(textarea) {
  resize: none;
}

.requirement-saved {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: 500;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
</style>
