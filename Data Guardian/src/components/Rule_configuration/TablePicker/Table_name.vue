<template>
  <div class="filter-item">
    <span class="filter-label">表格名称</span>
    <el-select
      v-model="tableValue"
      multiple
      collapse-tags
      clearable
      placeholder="请选择表格名称"
      class="filter-input"
      @focus="handleFocus"
      @change="handleChange"
    >
      <template #header>
        <el-checkbox
          v-model="tableCheckAll"
          :indeterminate="tableIndeterminate"
          @change="handleTableCheckAll"
        >全选</el-checkbox>
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
import axios from 'axios'

// 接收父组件传递的 project_name 参数
const props = defineProps<{ project_name: string }>()

// 用于保存下拉框选中的表格名称（类型为 string 数组）
const tableValue = ref<string[]>([])

// 存放后端返回的所有表格名称（转换为 { label, value } 格式）
const tableOptions = ref<{ label: string, value: string }[]>([])

// 当前展示的下拉选项（支持搜索后过滤）
const filteredTableOptions = ref<{ label: string, value: string }[]>([])

// 搜索输入的关键字
const tableSearch = ref<string>('')

// 全选checkbox的状态控制
const tableCheckAll = ref(false)
const tableIndeterminate = ref(false)

// 根据 project_name 动态计算 placeholder
const tablePlaceholder = computed(() => {
  return props.project_name ? "请选择表格名称" : "请先选择项目名称"
})

// 通过 emit 将选中的表格名称（table_name）传递给父组件或页面中其他子组件
const emit = defineEmits<{
  (e: 'update:table_name', value: string[]): void
}>()

// 当用户点击下拉框时调用，发起请求获取表格名称（包含传递的 project_name 参数）
const handleFocus = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/rule/search/table', {
      params: { project_name: props.project_name }
    })
    if (response.data && Array.isArray(response.data.options)) {
      tableOptions.value = response.data.options.map((opt: string) => ({
        label: opt,
        value: opt
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
    filteredTableOptions.value = tableOptions.value.filter(option =>
      option.label.toLowerCase().includes(keyword)
    )
  }
}

// 全选/取消全选的逻辑
const handleTableCheckAll = (val: boolean) => {
  if (val) {
    tableValue.value = tableOptions.value.map(option => option.value)
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
  emit('update:table_name', val)
}

// 监听 tableValue 的变化，确保更新全选状态及上报最新选中值
watch(tableValue, (newVal) => {
  updateCheckAllStatus()
  emit('update:table_name', newVal)
})

// 添加 reset 方法
const reset = () => {
  tableValue.value = []  // 清空选中的表格名称
  tableSearch.value = ''  // 清空搜索框
  tableCheckAll.value = false
  tableIndeterminate.value = false
  filteredTableOptions.value = [...tableOptions.value]  // 重置下拉选项
  emit('update:table_name', [])  // 通知父组件选项已清空
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
