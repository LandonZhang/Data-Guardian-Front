<template>
  <el-button type="primary" @click="searchRules">搜索</el-button>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 定义响应数据中每条规则的结构
interface RuleData {
  id: number;
  project_name: string;
  table_name: string;
  feature_name: string;
  rule_content: string;
  error_type: string;
  issue_details: string | null;
  created_at: string;
}

// 定义父组件传入的参数，所有参数均以对应变量名继承
const props = defineProps<{
  project_name: string,
  table_name: string,
  feature_name: string,
  start_time: string,
  end_time: string,
  page: number
}>()

// 固定每页数据量
const PAGE_SIZE = 12

// 通过 emit 将搜索结果返回给父组件（其他子组件可共享该数据）
const emit = defineEmits<{
  (e: 'update:tableData', data: RuleData[]): void,
  (e: 'update:total', total: number): void
}>()

async function searchRules() {
  // 构造请求参数（可选参数只有在父组件传入有效数据时才会添加）
  const params: any = {}
  if (props.project_name) {
    params.project_name = props.project_name
  }
  if (props.table_name) {
    params.table_name = props.table_name
  }
  if (props.feature_name) {
    params.feature_name = props.feature_name
  }
  if (props.start_time) {
    params.start_time = props.start_time
  }
  if (props.end_time) {
    params.end_time = props.end_time
  }
  params.page = props.page
  params.page_size = PAGE_SIZE

  try {
    const response = await axios.get('http://127.0.0.1:8080/rule/search/', { params })
    const responseData = response.data
    // 返回的数据格式为 { total: number, data: RuleData[] }
    emit('update:tableData', responseData.data)
    emit('update:total', responseData.total)
  } catch (error: any) {
    console.error('搜索规则失败', error)
    ElMessage.error('搜索规则失败')
  }
}
</script>
