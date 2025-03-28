<template>
  <el-dialog
    v-model="dialogVisible"
    title="需求记录详情"
    width="50%"
    :before-close="handleClose"
  >
    <div class="requirement-dialog-content">
      <div class="requirement-section">
        <h3>用户的初始请求：</h3>
        <div class="requirement-text">{{ initialRequestText }}</div>
      </div>

      <div class="requirement-section">
        <h3>最终确认请求：</h3>
        <div class="requirement-text">{{ finalRequestText }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: String,
    default: ''
  },
  messageId: {
    type: String,
    default: ''
  },
  initialRequest: {
    type: String,
    default: ''
  },
  finalRequest: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:visible', 'close']);

const dialogVisible = ref(props.visible);
const initialRequestText = ref(props.initialRequest || '无初始请求数据');
const finalRequestText = ref(props.finalRequest || '无最终请求数据');

// 监听props.visible的变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

// 监听props.initialRequest和props.finalRequest的变化
watch(() => props.initialRequest, (newVal) => {
  initialRequestText.value = newVal || '无初始请求数据';
});

watch(() => props.finalRequest, (newVal) => {
  finalRequestText.value = newVal || '无最终请求数据';
});

// 监听dialogVisible的变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
  if (!newVal) {
    emit('close');
  }
});

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style scoped>
.requirement-dialog-content {
  max-height: 50vh;
  overflow-y: auto;
  padding: 10px;
}

.requirement-section {
  margin-bottom: 20px;
}

.requirement-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.requirement-text {
  background-color: #f2f6fc;
  border-radius: 4px;
  padding: 12px;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
