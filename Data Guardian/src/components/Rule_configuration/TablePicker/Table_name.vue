<template>
  <div class="filter-item">
    <span class="filter-label">表格名称</span>
    <el-select
      v-model="tableValue"
      multiple
      collapse-tags
      clearable
      :placeholder="tablePlaceholder"
      class="filter-input"
      @focus="handleFocus"
      @change="handleChange"
      :disabled="isDisabled"
    >
      <template #header>
        <el-checkbox
          v-model="tableCheckAll"
          :indeterminate="tableIndeterminate"
          @change="handleTableCheckAll"
          >全选</el-checkbox
        >
      </template>
      <el-input
        v-model="tableSearch"
        :placeholder="tablePlaceholder"
        class="dropdown-search"
        @input="filterTableOptions"
      />
      <el-option
        v-for="item in filteredTableOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import request from '@/utils/request'

// 接收父组件传递的 selected_project 参数
const props = defineProps<{ selected_project: string[] }>()

// 判断下拉框是否禁用（当没有选择项目时禁用）
const isDisabled = computed(() => {
  return props.selected_project.length === 0
})

// 计算属性，将 selected_project 转换为合适的格式用于请求
// [注意：可以删除之前的 selectedProjectStr 计算属性，它不再需要了]

// 用于保存下拉框选中的表格名称（类型为 string 数组）
const tableValue = ref<string[]>([])

// 存放后端返回的所有表格名称（转换为 { label, value } 格式）
const tableOptions = ref<{ label: string; value: string }[]>([])

// 当前展示的下拉选项（支持搜索后过滤）
const filteredTableOptions = ref<{ label: string; value: string }[]>([])

// 搜索输入的关键字
const tableSearch = ref<string>('')

// 全选checkbox的状态控制
const tableCheckAll = ref(false)
const tableIndeterminate = ref(false)

// 根据 selected_project 动态计算 placeholder
const tablePlaceholder = computed(() => {
  return props.selected_project.length ? '请选择表格名称' : '请先选择项目名称'
})

// 通过 emit 将选中的表格名称（selected_table) 传递给父组件或页面中其他子组件
const emit = defineEmits<{
  (e: 'update:selected_table', value: string[]): void
}>()

// 当用户点击下拉框时调用，发起请求获取表格名称
const handleFocus = async () => {
  // 如果没有选择项目，则不发起请求
  if (props.selected_project.length === 0) {
    return
  }

  try {
    // 处理项目名称参数，生成正确的URL参数格式
    let params = {}

    if (props.selected_project.length > 0) {
      // 手动构建参数对象
      params = props.selected_project.reduce((acc, project) => {
        if (!acc.project_name) {
          acc.project_name = []
        }
        acc.project_name.push(project)
        return acc
      }, {})
    }

    const response = await request.get('/rule/search/table', {
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

    if (response.data && Array.isArray(response.data.options)) {
      tableOptions.value = response.data.options.map((opt: string) => ({
        label: opt,
        value: opt,
      }))
      // 默认展示所有选项
      filteredTableOptions.value = [...tableOptions.value]
    }
  } catch (error) {
    console.error('获取表格名称失败：', error)
  }
}

// 根据搜索关键字过滤下拉选项
const filterTableOptions = () => {
  const keyword = tableSearch.value.trim().toLowerCase()
  if (!keyword) {
    filteredTableOptions.value = [...tableOptions.value]
  } else {
    filteredTableOptions.value = tableOptions.value.filter((option) =>
      option.label.toLowerCase().includes(keyword),
    )
  }
}

// 全选/取消全选的逻辑
const handleTableCheckAll = (val: boolean) => {
  if (val) {
    tableValue.value = tableOptions.value.map((option) => option.value)
  } else {
    tableValue.value = []
  }
  tableIndeterminate.value = false
  updateCheckAllStatus()
  handleChange(tableValue.value)
}

// 更新全选checkbox的状态
const updateCheckAllStatus = () => {
  const selectedCount = tableValue.value.length
  const totalCount = tableOptions.value.length
  tableCheckAll.value = selectedCount === totalCount
  tableIndeterminate.value = selectedCount > 0 && selectedCount < totalCount
}

// 当用户选择表格名称时调用，同时上报给父组件
const handleChange = (val: string[]) => {
  updateCheckAllStatus()
  emit('update:selected_table', val)
}

// 监听 tableValue 的变化，确保更新全选状态及上报最新选中值
watch(tableValue, (newVal) => {
  updateCheckAllStatus()
  emit('update:selected_table', newVal)
})

// 添加 reset 方法
const reset = () => {
  tableValue.value = [] // 清空选中的表格名称
  tableOptions.value = []
  tableSearch.value = '' // 清空搜索框
  tableCheckAll.value = false
  tableIndeterminate.value = false
  filteredTableOptions.value = [...tableOptions.value] // 重置下拉选项
  emit('update:selected_table', []) // 通知父组件选项已清空
}

// 公开 reset 方法，供父组件调用
defineExpose({ reset })
</script>

<style scoped>
.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 30px;
}

.filter-label {
  font-size: 14px;
  color: #333;
}

.filter-input {
  width: 330px;
}

.dropdown-search {
  width: calc(100% - 20px);
  margin: 5px 10px;
}
</style>
