<template>
  <el-dialog v-model="visible" width="600px" :show-close="true">
    <template #title>
      <div class="custom-header">
        <span class="header-text download-link" @click="downloadTemplate">
          点击下载规则文件模板
        </span>
      </div>
    </template>

    <el-upload
      class="upload-demo"
      drag
      :auto-upload="true"
      :action="testMode ? '' : uploadUrl"
      :headers="uploadHeaders"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :multiple="false"
      accept=".csv, .xls, .xlsx"
      list-type="text"
      :show-file-list="true"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">点击上传文档，<em>或将文件拖拽至此</em></div>
    </el-upload>

    <!-- 错误详情表格 -->
    <el-table
      v-if="errorDetails.length > 0"
      :data="errorDetails"
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="row" label="错误行号" width="100"></el-table-column>
      <el-table-column prop="error" label="错误信息"></el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

interface UploadResponse {
  status: string
  message: string
  total_records: number
  success_count: number
  error_count: number
  error_details?: { row: number; error: string }[]
}

const visible = ref(false)
const uploadUrl = 'http://127.0.0.1:8080/rule/upload/'
// 传递给上传组件的请求头
const uploadHeaders = { Authorization: 'Bearer your_token' }
const errorDetails = ref<{ row: number; error: string }[]>([])

// 测试模式：开发测试时开启，生产时请关闭
const testMode = false

const openDialog = () => (visible.value = true)
const closeDialog = () => (visible.value = false)
defineExpose({ openDialog })

const downloadTemplate = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/rule/upload', {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '规则文件模板.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    ElMessage.error('模板下载失败，请稍后再试！')
  }
}

/**
 * 文件上传前的校验
 * 如果校验不通过，返回 false 即可阻止上传；
 * 如果处于测试模式下，模拟返回结果后也返回 false，取消自动上传。
 */
const beforeUpload = (file: File): boolean => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ]
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('仅支持 CSV 和 Excel (.xls, .xlsx) 文件上传！')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 5MB！')
    return false
  }

  if (testMode) {
    // 模拟上传，延时后返回成功信息
    setTimeout(() => {
      const simulatedResponse: UploadResponse = {
        status: 'success',
        message: '成功导入 5 条规则',
        total_records: 6,
        success_count: 5,
        error_count: 1,
        error_details: [{ row: 3, error: '必填字段不能为空' }],
      }
      handleSuccess(simulatedResponse)
    }, 500)
    return false // 取消自动上传请求
  }
  return true
}

/**
 * 上传成功的处理逻辑
 */
const handleSuccess = (data: UploadResponse) => {
  if (data.status === 'success') {
    ElNotification.success({
      title: '上传成功',
      message: `总记录数: ${data.total_records}, 成功: ${data.success_count}, 失败: ${data.error_count}`,
      duration: 5000,
    })
    errorDetails.value = data.error_details || []
  } else {
    ElMessage.error(`上传失败: ${data.message}`)
  }
}

/**
 * 上传失败的处理逻辑
 */
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 400) {
      ElMessage.error('上传失败: 文件格式错误或缺少必要列，请检查文件内容！')
    } else if (status === 500) {
      ElMessage.error('服务器内部错误，请稍后重试或联系管理员！')
    } else {
      ElMessage.error(`上传失败: ${error.response?.data?.message || '未知错误'}`)
    }
  } else {
    ElMessage.error('上传失败，请检查网络或联系管理员！')
  }
}
</script>

<style scoped>
.custom-header {
  padding: 0 5px;
  text-align: left;
  border-radius: 5px 5px 0 0;
}
.header-text {
  color: black;
  font-size: 16px;
}
.download-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
