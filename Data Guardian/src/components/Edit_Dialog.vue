<template>
  <el-dialog
    v-model="visible"
    width="600px"
    :show-close="true"
  >
    <!-- 自定义 header 插槽 -->
    <template #title>
      <div class="custom-header">
        <span class="header-text">规则编辑</span>
        <hr class="header-divider" />
      </div>
    </template>

    <!-- 弹窗主体内容 -->
    <div class="dialog-body">
      <p>表名称：{{ tableName }}</p>
      <p>特征名：{{ featureName }}</p>
      <p>规则内容</p>
      <!-- 多行文本输入框 -->
      <el-input
        type="textarea"
        class="rule-input"
        v-model="ruleContent"
        :rows="5"
        placeholder="请输入规则内容"
      />
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";

const visible = ref(false);

// 默认data传入
const tableName = ref("养护任务计计划表");
const featureName = ref("任务编码");
const ruleContent = ref("数据库未进行要求，但养护任务编码要求不能为空");

// 打开弹窗
const openDialog = () => {
  visible.value = true;
};

// 关闭弹窗
const closeDialog = () => {
  visible.value = false;
};

// 点击“保存”时的操作
const handleSave = () => {
  console.log("已保存的规则内容：", ruleContent.value);
  visible.value = false;
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

.rule-input {
  width: 515px;
  box-sizing: border-box;
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
