<template>
  <el-dialog
    v-model="visible"
    width="600px"
    :show-close="true"
  >
    <!-- 自定义 header 插槽 -->
    <template #title>
      <div class="custom-header">
        <span class="header-text">规则删除</span>
        <hr class="header-divider" />
      </div>
    </template>

    <!-- 弹窗主体内容 -->
    <div class="dialog-body">
      <p>确定删除此行规则？</p>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const visible = ref(false);
const ruleId = ref<number | null>(null);
const onDeleteSuccess = ref<(() => void) | null>(null);

// 打开弹窗，并接收要删除的规则 ID 和回调函数
const openDialog = (id: number, callback: () => void) => {
  ruleId.value = id;
  onDeleteSuccess.value = callback;
  visible.value = true;
};

// 关闭弹窗
const closeDialog = () => {
  visible.value = false;
};

// 点击“删除”时的操作

const handleDelete = async () => {
  if (ruleId.value === null) return;


  try {
    const response = await axios.delete(`http://127.0.0.1:8080/rule/manage/${ruleId.value}`);
    if (response.data.status === "success") {
      ElMessage.success(response.data.message);
      onDeleteSuccess.value?.();
      closeDialog();
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        ElMessage.error("规则不存在");
      } else {
        ElMessage.error("服务器内部错误");
      }
    } else {
      ElMessage.error("请求失败，请检查网络");
    }
  }
};


defineExpose({ openDialog });
</script>

<style scoped>
/* 自定义标题部分 */
.custom-header {
  padding: 10px 10px 0 10px;
  text-align: left;
  border-radius: 5px 5px 0 0;
}

.header-text {
  color: black;
  font-weight: bold;
  font-size: 18px; /* 调整为18px */
}

/* 横线样式，颜色改为浅灰色 */
.header-divider {
  border: none;
  height: 1px;
  background-color: #ccc; /* 改为浅灰色 */
  margin: 10px 0 0 0;
  width: 100%;
}

/* 弹窗主体内容 */
.dialog-body {
  margin-bottom: 20px;
  line-height: 1.8;
  color: black;
  text-align: center;
  font-size: 16px; /* 调整为16px */
}

.dialog-body p {
  margin: 8px 0;
}

/* 底部按钮区域的样式 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px; /* 调整间距为20px */
}

.dialog-footer .el-button {
  width: 120px;
}

/* 添加hover效果 */
.dialog-footer .el-button:hover {
  opacity: 0.8; /* 轻微透明 */
}
</style>

<style>
/* 覆盖Element Plus的el-dialog样式，添加圆角 */
:deep(.el-dialog) {
  border-radius: 10px;
}
</style>
