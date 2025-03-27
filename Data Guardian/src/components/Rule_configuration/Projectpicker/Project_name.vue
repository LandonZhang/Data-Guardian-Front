<template>
  <div class="filter-item">
    <span class="filter-label">项目名称</span>
    <el-select
      v-model="projectValue"
      multiple
      collapse-tags
      clearable
      placeholder="请选择项目名称"
      class="filter-input"
      @focus="handleFocus"
      @change="handleChange"
    >
      <template #header>
        <el-checkbox
          v-model="projectCheckAll"
          :indeterminate="projectIndeterminate"
          @change="handleProjectCheckAll"
        >全选</el-checkbox>
      </template>
      <el-input
        v-model="projectSearch"
        placeholder="搜索项目名称"
        class="dropdown-search"
        @input="filterProjectOptions"
      />
      <el-option
        v-for="item in filteredProjectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import axios from 'axios'

// 用于保存下拉框选中的项目（类型为 string 数组）
const projectValue = ref<string[]>([])

// 存放后端返回的所有项目名称（转换为 { label, value } 格式）
const projectOptions = ref<{ label: string, value: string }[]>([])

// 当前展示的下拉选项（支持搜索后过滤）
const filteredProjectOptions = ref<{ label: string, value: string }[]>([])

// 搜索输入的关键字
const projectSearch = ref<string>('')

// 全选checkbox的状态控制
const projectCheckAll = ref(false)
const projectIndeterminate = ref(false)

// 通过 emit 将选中的项目（project_name）传递给父组件或页面中其他子组件
const emit = defineEmits<{
  (e: 'update:selected_project', value: string[]): void
}>()


// 当用户点击下拉框时调用，若尚未加载选项则发起请求获取项目名称
const handleFocus = async () => {
  if (projectOptions.value.length === 0) {
    try {
      const response = await axios.get('http://127.0.0.1:8080/rule/search/project')
      if (response.data && Array.isArray(response.data.options)) {
        projectOptions.value = response.data.options.map((opt: string) => ({
          label: opt,
          value: opt
        }))
        // 默认展示所有选项
        filteredProjectOptions.value = [...projectOptions.value]
      }
    } catch (error) {
      console.error('获取项目名称失败：', error)
    }
  }
}

// 根据搜索关键字过滤下拉选项
const filterProjectOptions = () => {
  const keyword = projectSearch.value.trim().toLowerCase()
  if (!keyword) {
    filteredProjectOptions.value = [...projectOptions.value]
  } else {
    filteredProjectOptions.value = projectOptions.value.filter(option =>
      option.label.toLowerCase().includes(keyword)
    )
  }
}

// 全选/取消全选的逻辑
const handleProjectCheckAll = (val: boolean) => {
  if (val) {
    projectValue.value = projectOptions.value.map(option => option.value)
  } else {
    projectValue.value = []
  }
  projectIndeterminate.value = false
  updateCheckAllStatus()
  handleChange(projectValue.value)
}

// 更新全选checkbox的状态
const updateCheckAllStatus = () => {
  const selectedCount = projectValue.value.length
  const totalCount = projectOptions.value.length
  projectCheckAll.value = selectedCount === totalCount
  projectIndeterminate.value = selectedCount > 0 && selectedCount < totalCount
}

// 当用户选择项目时调用，同时上报给父组件
const handleChange = (val: string[]) => {
  updateCheckAllStatus()
  emit('update:selected_project', val)
}

// 监听 projectValue 的变化，确保更新全选状态及上报最新选中值
watch(projectValue, (newVal) => {
  updateCheckAllStatus()
  emit('update:selected_project', newVal)
})

// 添加 reset 方法
const reset = () => {
  projectValue.value = []  // 清空选中的项目
  projectSearch.value = ''  // 清空搜索框
  projectCheckAll.value = false
  projectIndeterminate.value = false
  projectOptions.value = []  // 清空后端获取的所有选项
  filteredProjectOptions.value = []  // 清空当前展示的选项
  emit('update:selected_project', [])  // 通知父组件选项已清空
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
