<template>
  <div class="filter-item">
    <span class="filter-label">特征名称</span>
    <el-select
      v-model="featureValue"
      multiple
      collapse-tags
      clearable
      :placeholder="featurePlaceholder"
      class="filter-input"
      @focus="handleFocus"
      @change="handleChange"
      :disabled="isDisabled"
    >
      <template #header>
        <el-checkbox
          v-model="featureCheckAll"
          :indeterminate="featureIndeterminate"
          @change="handleFeatureCheckAll"
          >全选</el-checkbox
        >
      </template>
      <el-input
        v-model="featureSearch"
        :placeholder="featurePlaceholder"
        class="dropdown-search"
        @input="filterFeatureOptions"
      />
      <el-option
        v-for="item in filteredFeatureOptions"
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
import request from '@/utils/request'

// 接收父组件传入的 selected_project 与 selected_table 参数
const props = defineProps<{ selected_project: string[]; selected_table: string[] }>()

// 判断下拉框是否禁用（当没有选择项目或表格时禁用）
const isDisabled = computed(() => {
  return props.selected_project.length === 0 || props.selected_table.length === 0
})

// 用于保存下拉框选中的特征名称（类型为 string 数组）
const featureValue = ref<string[]>([])

// 存放后端返回的所有特征名称（转换为 { label, value } 格式）
const featureOptions = ref<{ label: string; value: string }[]>([])

// 当前展示的下拉选项（支持搜索后过滤）
const filteredFeatureOptions = ref<{ label: string; value: string }[]>([])

// 搜索输入的关键字
const featureSearch = ref<string>('')

// 全选 checkbox 状态控制
const featureCheckAll = ref(false)
const featureIndeterminate = ref(false)

// 根据 selected_project 与selected_table动态计算 placeholder
const featurePlaceholder = computed(() => {
  if (!props.selected_project.length) {
    return '请先选择项目名称'
  } else if (!props.selected_table.length) {
    return '请先选择表格名称'
  } else {
    return '请选择特征名称'
  }
})

// 通过 emit 将选中的特征名称（feature_name）传递给父组件或页面中其他子组件
const emit = defineEmits<{
  (e: 'update:selected_feature', value: string[]): void
}>()

// 当用户点击下拉框时调用，发起请求获取特征名称
const handleFocus = async () => {
  // 若未选择项目或表格，则不发送请求
  if (!props.selected_project.length || !props.selected_table.length) {
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

    // 处理表格名称参数
    if (props.selected_table.length > 0) {
      params = props.selected_table.reduce((acc, table) => {
        if (!acc.table_name) {
          acc.table_name = []
        }
        acc.table_name.push(table)
        return acc
      }, params)
    }

    const response = await request.get('/rule/search/feature', {
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
      featureOptions.value = response.data.options.map((opt: string) => ({
        label: opt,
        value: opt,
      }))
      // 默认展示所有选项
      filteredFeatureOptions.value = [...featureOptions.value]
    }
  } catch (error) {
    console.error('获取特征名称失败：', error)
  }
}

// 根据搜索关键字过滤下拉选项
const filterFeatureOptions = () => {
  const keyword = featureSearch.value.trim().toLowerCase()
  if (!keyword) {
    filteredFeatureOptions.value = [...featureOptions.value]
  } else {
    filteredFeatureOptions.value = featureOptions.value.filter((option) =>
      option.label.toLowerCase().includes(keyword),
    )
  }
}

// 全选/取消全选的逻辑
const handleFeatureCheckAll = (val: boolean) => {
  if (val) {
    featureValue.value = featureOptions.value.map((option) => option.value)
  } else {
    featureValue.value = []
  }
  featureIndeterminate.value = false
  updateCheckAllStatus()
  handleChange(featureValue.value)
}

// 更新全选 checkbox 状态
const updateCheckAllStatus = () => {
  const selectedCount = featureValue.value.length
  const totalCount = featureOptions.value.length
  featureCheckAll.value = selectedCount === totalCount
  featureIndeterminate.value = selectedCount > 0 && selectedCount < totalCount
}

// 当用户选择特征名称时调用，同时上报给父组件
const handleChange = (val: string[]) => {
  updateCheckAllStatus()
  emit('update:selected_feature', val)
}

// 监听 featureValue 的变化，确保更新全选状态及上报最新选中值
watch(featureValue, (newVal) => {
  updateCheckAllStatus()
  emit('update:selected_feature', newVal)
})

// 监听表格名称变化，当表格名称变化时，清空特征名称选择
watch(
  () => props.selected_table,
  (newVal) => {
    if (newVal.length === 0) {
      // 表格名称被清空，清空特征名称选择
      featureValue.value = []
      featureOptions.value = []
      filteredFeatureOptions.value = []
      emit('update:selected_feature', [])
    }
  },
  { deep: true },
)

// 添加 reset 方法
const reset = () => {
  featureValue.value = [] // 清空选中的特征名称
  featureSearch.value = '' // 清空搜索框
  featureOptions.value = []
  featureCheckAll.value = false
  featureIndeterminate.value = false
  filteredFeatureOptions.value = [] // 重置下拉选项
  emit('update:selected_feature', []) // 通知父组件选项已清空
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
