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

      // 删除成功后执行回调，更新前端数据
      onDeleteSuccess.value?.();
      closeDialog();
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      ElMessage.error("规则不存在");
    } else {
      ElMessage.error("服务器内部错误");
    }
  }
};

// 让父组件能够调用 openDialog() 来打开弹窗
defineExpose({ openDialog });
</script>

<style scoped>
/* 自定义标题部分，不设置背景色，保持白色；增加左侧内边距确保文字对齐 */
.custom-header {
  padding: 10px 10px 0 10px;
  text-align: left; /* 左对齐标题内容 */
  border-radius: 5px 5px 0 0;
}

.header-text {
  color: black;
  font-weight: bold;
  font-size: 20px; /* 调整字体大小，放大标题 */
}

/* 横线样式，颜色设置为黑色，撑满整个弹窗 */
.header-divider {
  border: none;
  height: 1px;
  background-color: black;
  margin: 10px 0 0 0;
  width: 100%;
}

/* 弹窗主体内容，添加左侧内边距保持文字与标题对齐，并使文字居中 */
.dialog-body {
  margin-bottom: 20px;
  line-height: 1.8;
  color: black;
  text-align: center; /* 使内容居中 */
}

.dialog-body p {
  margin: 8px 0;
}

/* 底部按钮区域的样式 */
.dialog-footer {
  display: flex; /* 使用Flexbox布局 */
  justify-content: center; /* 中心对齐 */
  gap: 113px; /* 设置按钮之间的间距 */
}

.dialog-footer .el-button {
  width: 120px; /* 设定按钮宽度 */
}
</style>
