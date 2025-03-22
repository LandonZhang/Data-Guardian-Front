<template>
  <el-dialog
    v-model="visible"
    width="600px"
    :show-close="true"
    class="custom-dialog"
  >
    <!-- 自定义 header 插槽 -->
    <template #title>
      <div class="dialog-header">
        <span class="header-text">规则查看</span>
      </div>
    </template>

    <!-- 弹窗主体内容 -->
    <div class="dialog-body">

      <!-- 序号和项目名称放在同一行 -->
      <el-row class="field-row" :gutter="16">
        <el-col :span="12">
          <div class="field-label">序号：</div>
          <div class="field-content">{{ idnumber }}</div>
        </el-col>
        <el-col :span="12">
          <div class="field-label">项目名称：</div>
          <div class="field-content">{{ projectname }}</div>
        </el-col>
      </el-row>


      <!-- 错误类型和问题详情放在同一行 -->
      <el-row class="field-row" :gutter="16">
        <el-col :span="12">
          <div class="field-label">错误类型：</div>
          <div class="field-content">{{ errorType }}</div>
        </el-col>
        <el-col :span="12">
          <div class="field-label">问题详情：</div>
          <div class="field-content">{{ issue_details }}</div>
        </el-col>
      </el-row>

      <!-- 创建时间和更新时间放在同一行 -->
      <el-row class="field-row" :gutter="16">
        <el-col :span="12">
          <div class="time-label">创建时间：</div>
          <div class="field-content">{{ createdAt }}</div>
        </el-col>
        <el-col :span="12">
          <div class="time-label">更新时间：</div>
          <div class="field-content">{{ updatedAt }}</div>
        </el-col>
      </el-row>

      <!-- 规则内容部分，标签在上，内容在下 -->
      <el-row class="field-row">
        <el-col :span="24">
          <div class="field-label">规则内容：</div>
          <div class="field-content rule-content">{{ ruleContent }}</div>
        </el-col>
      </el-row>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
import axios from "axios";

// 弹窗的可见性控制
const visible = ref(false);

// 存储规则的详细信息
const idnumber = ref("");
const projectname = ref("");
const tableName = ref("");
const featureName = ref("");
const errorType = ref("");
const ruleContent = ref("");
const createdAt = ref("");
const updatedAt = ref("");
const issue_details = ref(""); // 确保定义问题详情变量

// 存储规则 ID（从父组件传递过来）
const ruleId = ref<number | null>(null);

// 打开弹窗并获取数据
const openDialog = async (id: number) => {
  ruleId.value = id; // 保存传递过来的 rule_id
  visible.value = true; // 打开弹窗

  try {
    const response = await axios.get(`http://127.0.0.1:8080/rule/manage/${id}`);
    if (response.data) {
      const data = response.data;
      tableName.value = data.table_name;
      idnumber.value = data.id;
      projectname.value = data.project_name;
      featureName.value = data.feature_name;
      errorType.value = data.error_type;
      ruleContent.value = data.rule_content;
      createdAt.value = data.created_at;
      updatedAt.value = data.updated_at;
      issue_details.value = data.issue_details; // 从后端获取问题详情
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      alert("规则不存在");
    } else if (error.response?.status === 500) {
      alert("服务器错误，请稍后再试");
    } else {
      alert("网络错误，请检查连接");
    }
  }
};

// 关闭弹窗
const closeDialog = () => {
  visible.value = false;
};

// 让父组件能够调用 openDialog() 传入数据
defineExpose({ openDialog });
</script>

<style scoped>
/* Header 样式 */
.dialog-header {
  background-color: #E1ECF9; /* 标题背景色 */
  border-radius: 4px;
  padding: 10px 16px;
  text-align: center;
}
.header-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 主体样式 */
.dialog-body {
  padding: 30px; /* 增加内边距，提供更多空间 */
  font-size: 14px;
  color: #555;
}

/* 字段行样式 */
.field-row {
  margin-bottom: 24px; /* 增大行间距为 24px */
  display: flex;
  align-items: flex-start;
}
.field-label {
  font-weight: bold;
  color: #333;
  line-height: 22px; /* 增加行高 */
  min-width: 100px; /* 增加标签最小宽度 */
}
.field-content {
  line-height: 22px; /* 增加行高 */
  word-break: break-all;
  font-size: 14px;
  color: #555;
}

/* 时间标签样式 */
.time-label {
  font-weight: bold;
  margin-bottom: 8px; /* 增加时间标签的间距 */
  color: #333;
}

/* 规则内容展示区 */
.rule-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 8px;
}

/* 底部样式 */
.dialog-footer {
  text-align: center;
  padding: 10px 0;
}
</style>
