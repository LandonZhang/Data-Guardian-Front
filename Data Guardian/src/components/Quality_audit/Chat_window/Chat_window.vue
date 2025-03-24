<template>
  <div>
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{'user-message': message.isUser, 'bot-message': !message.isUser}"
          class="message-item"
        >
        <template v-if="message.isUser">
          <el-icon class="message-icon"><UserFilled /></el-icon>
          <div v-html="formatMessage(message.text)" />
        </template>
        <template v-else>
          <div v-html="formatMessage(message.text)" />
        </template>
        </div>
      </div>
      <div class="input">
        <div class="input-container">
          <el-input
            v-model="userInput"
            placeholder="发消息"
            @keydown.enter="handleKeydown"
            class="input-field"
            type="textarea"
            :rows="5"
          />
          <el-button @click="sendMessage" type="primary" plain class="send-button" circle>
              <el-icon><Position /></el-icon>
            </el-button>
        </div>
      </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const userInput = ref('');
const messages = ref<{ text: string; isUser: boolean }[]>([]);

function sendMessage() {
  if (userInput.value.trim()) {
    messages.value.push({ text: userInput.value, isUser: true });
    userInput.value = '';

    const fullReply = '这是大模型的回复';
    let currentText = '';
    let index = 0;

    messages.value.push({ text: '', isUser: false });
    const interval = setInterval(() => {
      if (index < fullReply.length) {
        currentText += fullReply[index];
        messages.value[messages.value.length - 1].text = currentText;
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function formatMessage(message: string) {
  return message.replace(/\n/g, '<br>');
}
</script>


<style scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 520px;
  overflow-y: auto;
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
}

.input {
  position: absolute;
  right: 30px;
  left: 30px;
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
  right: 10px;
  bottom: 10px;
}
</style>