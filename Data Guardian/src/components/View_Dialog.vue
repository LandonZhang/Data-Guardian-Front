<template>
  <el-dialog
    v-model="visible"
    width="600px"
    :show-close="true"
  >
    <!-- 自定义 header 插槽 -->
    <template #title>
      <div class="custom-header">
        <span class="header-text">规则查看</span>
        <hr class="header-divider" />
      </div>
    </template>

    <!-- 弹窗主体内容 -->
    <div class="dialog-body">
      <p>表名称：{{ tableName }}</p>
      <p>特征名：{{ featureName }}</p>
      <p>规则内容：{{ ruleContent }}</p>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";

const visible = ref(false);
const tableName = ref("");
const featureName = ref("");
const ruleContent = ref("");

// 打开弹窗并设置数据
const openDialog = (data: { tableName: string; featureName: string; ruleContent: string }) => {
  tableName.value = data.tableName;
  featureName.value = data.featureName;
  ruleContent.value = data.ruleContent;
  visible.value = true;
};

// 关闭弹窗
const closeDialog = () => {
  visible.value = false;
};

// 让父组件能够调用 openDialog() 传入数据
defineExpose({ openDialog });
</script>

<style scoped>
/* 自定义标题部分，不设置背景色，保持白色；增加左右内边距确保文字对齐 */
.custom-header {
  padding: 0 10px 0 10px; /* 上边距设置为 0 */
  text-align: left;
  border-radius: 5px 5px 0 0;
}

.header-text {
  color: black;
  font-weight: bold;
  font-size: 18px;
}

/* 横线样式，颜色设置为黑色，撑满整个弹窗 */
.header-divider {
  border: none;
  height: 1px;
  background-color: black;
  margin: 10px 0 0 0;
  width: 100%;
}

/* 弹窗主体内容，添加左侧内边距保持文字与标题对齐 */
.dialog-body {
  margin-bottom: 20px;
  line-height: 1.8;
  color: black;
  padding-left: 10px;
}

.dialog-body p {
  margin: 8px 0;
}

/* 底部按钮区域样式 */
.dialog-footer {
  display: flex; /* 使用Flexbox布局 */
  justify-content: center; /* 将按钮居中对齐 */
}

.dialog-footer .el-button {
  margin: 0; /* 移除按钮的左右间距 */
}
</style>
