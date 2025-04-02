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
      :action="uploadUrl"
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
import request from '@/utils/request'

// 定义后端响应数据结构
interface UploadResponse {
  status: string
  message: string
  total_records: number
  success_count: number
  error_count: number
  error_details?: { 行号: number; 错误: string }[]
}

const visible = ref(false)
const uploadUrl = '/rule/upload/'
const uploadHeaders = { Authorization: 'Bearer your_token' }
const errorDetails = ref<{ row: number; error: string }[]>([])

// 打开和关闭对话框的方法
const openDialog = () => (visible.value = true)
const closeDialog = () => (visible.value = false)
defineExpose({ openDialog })

// 下载模板文件
const downloadTemplate = async () => {
  try {
    const response = await request.get('/rule/upload', {
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

// 上传前校验
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
  return true
}

// 上传成功处理
const handleSuccess = (data: any) => {
  if (data.status === 'success') {
    ElNotification.success({
      title: '上传成功',
      message: `${data.message}\n总记录数: ${data.total_records}, 成功: ${data.success_count}, 失败: ${data.error_count}`,
      duration: 5000,
    })
    // 转换后端返回的 error_details 字段名
    errorDetails.value = (data.error_details || []).map((detail: any) => ({
      row: detail['行号'],
      error: detail['错误'],
    }))
  } else {
    ElMessage.error(`上传失败: ${data.message || '未知错误'}`)
  }
}

// 上传失败处理
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response
    const message = data?.message || '未知错误'
    if (status === 400) {
      ElMessage.error(`上传失败: ${message || '文件格式错误或缺少必要列'}`)
    } else if (status === 500) {
      ElMessage.error(`服务器内部错误: ${message || '请稍后重试或联系管理员'}`)
    } else {
      ElMessage.error(`上传失败: ${message}`)
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
