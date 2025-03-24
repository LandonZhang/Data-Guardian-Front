<template>
  <el-dialog v-model="visible" width="1200px" :show-close="true" class="custom-dialog">
    <!-- 自定义 header 插槽 -->
    <template #title>
      <div class="dialog-header">
        <span class="header-text">规则编辑</span>
      </div>
    </template>

    <!-- 弹窗主体内容 -->
    <div class="dialog-body">
      <!-- 第一行：序号、项目名称、表名、特征名 -->
      <el-row class="field-row" :gutter="16">
        <el-col :span="6">
          <div class="field-label">序号：</div>
          <el-input v-model="editedData.id" disabled />
        </el-col>
        <el-col :span="6">
          <div class="field-label">项目名称：</div>
          <el-input v-model="editedData.project_name" />
        </el-col>
        <el-col :span="6">
          <div class="field-label">表名：</div>
          <el-input v-model="editedData.table_name" />
        </el-col>
        <el-col :span="6">
          <div class="field-label">特征名：</div>
          <el-input v-model="editedData.feature_name" />
        </el-col>
      </el-row>

      <!-- 第二行：错误类型、问题详情 -->
      <el-row class="field-row" :gutter="16">
        <el-col :span="12">
          <div class="field-label">错误类型：</div>
          <el-input v-model="editedData.error_type" />
        </el-col>
        <el-col :span="12">
          <div class="field-label">问题详情：</div>
          <el-input v-model="editedData.issue_details" />
        </el-col>
      </el-row>

      <!-- 规则内容独占一行 -->
      <el-row class="field-row">
        <el-col :span="24">
          <div class="field-label">规则内容：</div>
          <el-input type="textarea" v-model="editedData.rule_content" rows="5"></el-input>
        </el-col>
      </el-row>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="button-group">
          <el-button type="primary" @click="saveAndUpload" class="save-upload-btn"
            >保存并上传</el-button
          >
          <el-button @click="closeDialog" class="close-btn">关闭</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const ruleId = ref<number | null>(null)
const editedData = reactive({
  id: '', // 将显示前端序号
  dbId: '', // 新增，存储数据库ID
  project_name: '',
  table_name: '',
  feature_name: '',
  error_type: '',
  rule_content: '',
  issue_details: '',
})

// 修改openDialog方法接收前端序号
const openDialog = async (id: number, frontendIndex: number) => {
  ruleId.value = id
  visible.value = true
  editedData.id = frontendIndex.toString() // 设置前端序号显示

  try {
    const response = await axios.get(`http://127.0.0.1:8080/rule/manage/${id}`)
    if (response.data) {
      const data = response.data
      editedData.dbId = data.id // 保存数据库ID
      editedData.project_name = data.project_name
      editedData.table_name = data.table_name
      editedData.feature_name = data.feature_name
      editedData.error_type = data.error_type
      editedData.rule_content = data.rule_content
      editedData.issue_details = data.issue_details
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      ElMessage.error('规则不存在')
    } else if (error.response?.status === 500) {
      ElMessage.error('服务器错误，请稍后再试')
    } else {
      ElMessage.error('网络错误，请检查连接')
    }
  }
}

const closeDialog = () => {
  visible.value = false
}

// 合并保存和上传功能
const saveAndUpload = async () => {
  if (ruleId.value === null) return

  try {
    const response = await axios.put(`http://127.0.0.1:8080/rule/manage/${ruleId.value}`, {
      project_name: editedData.project_name,
      table_name: editedData.table_name,
      feature_name: editedData.feature_name,
      rule_content: editedData.rule_content,
      error_type: editedData.error_type,
      issue_details: editedData.issue_details,
    })

    if (response.data.status === 'success') {
      ElMessage.success('保存并上传成功：' + response.data.message)
      closeDialog() // 成功后关闭对话框
    } else {
      ElMessage.error('更新失败')
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response
      if (status === 400) {
        ElMessage.error(data.detail || '未提供任何需要更新的字段')
      } else if (status === 404) {
        ElMessage.error(data.detail || '规则不存在')
      } else if (status === 500) {
        ElMessage.error(data.detail || '服务器内部错误')
      } else {
        ElMessage.error('更新失败')
      }
    } else {
      ElMessage.error('网络错误，请检查连接')
    }
  }
}

defineExpose({ openDialog })
</script>

<style scoped>
.dialog-header {
  background-color: #e8f0f9;
  padding: 10px 16px;
  text-align: center;
}
.header-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.dialog-body {
  padding: 20px 30px;
  font-size: 14px;
  color: #333;
}

.field-row {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

.field-label {
  font-weight: bold; /* 字段标签加粗 */
  color: #333;
  line-height: 22px;
  margin-bottom: 5px;
}

.el-input {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: center; /* 将按钮组放在中间 */
  padding: 10px 20px;
}

.button-group {
  display: flex;
  gap: 20px; /* 按钮之间的间距缩小 */
}

.save-upload-btn {
  background-color: #409eff;
  border: none;
}

.close-btn {
  background-color: #f5f5f5;
  color: #606266;
  border: 1px solid #dcdfe6;
}
</style>
