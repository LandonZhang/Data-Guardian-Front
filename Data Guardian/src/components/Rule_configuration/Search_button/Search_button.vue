<template>
  <el-button type="primary" @click="searchRules">搜索</el-button>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import request from '@/utils/request'

// 定义响应数据中每条规则的结构
interface RuleData {
  id: number
  project_name: string
  table_name: string
  feature_name: string
  rule_content: string
  error_type: string
  issue_details: string | null
  created_at: string
}

// 定义父组件传入的参数，所有参数均以对应变量名继承
const props = defineProps<{
  select_project: string[]
  selected_table: string[]
  selected_feature: string[]
  start_time: string
  end_time: string
  page: number
}>()

//只有分页参数（即 props.page）的变化时才自动调用 searchRules
watch(
  () => props.page,
  (newPage, oldPage) => {
    if (newPage !== oldPage) {
      searchRules()
    }
  },
)

// 固定每页数据量
const PAGE_SIZE = 12
// 通过 emit 将搜索结果返回给父组件（其他子组件可共享该数据）
const emit = defineEmits<{
  (e: 'search', data: { tableData: RuleData[]; total: number }): void
}>()

async function searchRules() {
  // 构造请求参数
  let params: any = {
    page: props.page,
    page_size: PAGE_SIZE,
  }

  // 添加项目名称参数
  if (props.select_project.length > 0) {
    params = props.select_project.reduce((acc, project) => {
      if (!acc.project_name) {
        acc.project_name = []
      }
      acc.project_name.push(project)
      return acc
    }, params)
  }

  // 添加表格名称参数
  if (props.selected_table.length > 0) {
    params = props.selected_table.reduce((acc, table) => {
      if (!acc.table_name) {
        acc.table_name = []
      }
      acc.table_name.push(table)
      return acc
    }, params)
  }

  // 添加特征名称参数
  if (props.selected_feature.length > 0) {
    params = props.selected_feature.reduce((acc, feature) => {
      if (!acc.feature_name) {
        acc.feature_name = []
      }
      acc.feature_name.push(feature)
      return acc
    }, params)
  }

  // 添加时间参数
  if (props.start_time) {
    params.start_time = props.start_time
  }

  if (props.end_time) {
    params.end_time = props.end_time
  }

  try {
    const response = await request.get('/rule/search/', {
      params,
      paramsSerializer: (params) => {
        // 自定义参数序列化逻辑
        return Object.entries(params)
          .flatMap(([key, values]) => {
            if (Array.isArray(values)) {
              return values.map(
                (value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
              )
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(values)}`
          })
          .join('&')
      },
    })

    const responseData = response.data
    emit('search', { tableData: responseData.data, total: responseData.total })
  } catch (error: any) {
    console.error('搜索规则失败', error)
    ElMessage.error('搜索规则失败')
  }
}
</script>
