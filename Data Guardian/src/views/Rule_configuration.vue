<template>
  <el-container>
    <el-header class="header-container">
      <div class="header-left">
        <el-icon class="header-icon"><Location /></el-icon>
        <h5 class="header-text">主页</h5>
      </div>
      <div class="header-right">
        <el-icon class="header-icon"><User /></el-icon>
        <h5 class="header-text">你好，管理员</h5>
      </div>
    </el-header>

    <el-main>
      <div class="filter-container">
        <div class="filter-group">
          <div class="filter-item">
            <span class="filter-label">项目名称</span>
            <el-select
              v-model="projectValue"
              multiple
              collapse-tags
              clearable
              placeholder="请选择项目名称"
              class="filter-input"
            >
              <template #header>
                <el-checkbox
                  v-model="projectCheckAll"
                  :indeterminate="projectIndeterminate"
                  @change="handleProjectCheckAll"
                  >全选</el-checkbox
                >
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

          <div class="filter-item">
            <span class="filter-label">表格名称</span>
            <el-select
              v-model="tableValue"
              multiple
              collapse-tags
              clearable
              placeholder="请选择表格名称"
              class="filter-input"
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
                placeholder="搜索表格名称"
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

          <div class="filter-item">
            <span class="filter-label">特征名称</span>
            <el-select
              v-model="featureValue"
              multiple
              collapse-tags
              clearable
              placeholder="请选择特征名称"
              class="filter-input"
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
                placeholder="搜索特征名称"
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
        </div>

        <div class="filter-item">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            unlink-panels
            range-separator=" - "
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="filter-input"
          />
        </div>

        <div class="filter-buttons">
          <el-button type="primary" @click="searchRules">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>

      <div class="table-container">
        <el-button type="primary" class="import-button" @click="openUploadFileDialog"
          >导入</el-button
        >
        <div class="page-container">
          <el-table :data="tableData">
            <el-table-column label="序号" type="index" width="80" />
            <el-table-column label="表格名称" prop="name" />
            <el-table-column label="特征名称" prop="feature" />
            <el-table-column label="所属项目" prop="project" />
            <el-table-column label="创建时间" prop="date" width="180" />

            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" type="success" @click="checkDialogInParent(scope.row.id)"
                  >查看</el-button
                >
                <el-button size="small" type="warning" @click="openEditDialogInParent(scope.row.id)"
                  >编辑</el-button
                >
                <el-button size="small" type="danger" @click="openDeleteDialog(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-main>
  </el-container>

  <!-- 弹窗 -->
  <FormEditDialog ref="editDialogRef" />
  <FormDialog ref="viewDialogRef" />
  <DeleteDialog ref="deleteDialog" />
  <UploadFileDialog ref="uploadFileDialogRef" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ElMessage } from 'element-plus'

// 是否使用模拟数据（此处设为 true 以便后端接口不可用时测试交互）
const useMockData = false

// 如果启用模拟数据，则配置 axios-mock-adapter 拦截接口请求
if (useMockData) {
  const mock = new MockAdapter(axios)

  // 模拟获取项目选项接口
  mock.onGet('http://127.0.0.1:8080/rule/search/project').reply(200, {
    options: ['大连路隧道', '南京西路工程', '外滩修复项目'],
  })

  // 模拟获取表格选项接口（支持根据 project_name 筛选，这里简单返回固定数据）
  mock.onGet('http://127.0.0.1:8080/rule/search/table').reply((config) => {
    return [200, { options: ['养护任务计划表', '施工进度表', '设备检修记录'] }]
  })

  // 模拟获取特征选项接口（支持根据 project_name 和 table_name 筛选）
  mock.onGet('http://127.0.0.1:8080/rule/search/feature').reply((config) => {
    return [200, { options: ['任务编码', '项目负责人', '验收状态'] }]
  })

  // 模拟搜索规则数据接口（支持分页查询），这里依然保留原有模拟数据
  mock.onGet('http://127.0.0.1:8080/rule/search/').reply((config) => {
    return [
      200,
      {
        total: 7,
        data: [
          {
            id: 1,
            project_name: '大连路隧道',
            table_name: '养护任务计划表',
            feature_name: '任务编码',
            rule_content: '任务编码必须唯一且符合项目编码规范。',
            error_type: '唯一性错误',
            issue_details: null,
            created_at: '2025-01-16T16:29:00',
          },
          {
            id: 2,
            project_name: '南京西路工程',
            table_name: '施工进度表',
            feature_name: '项目负责人',
            rule_content: '项目负责人不能为空，并需在公司员工数据库中存在。',
            error_type: '数据完整性错误',
            issue_details: null,
            created_at: '2025-02-10T10:15:00',
          },
          {
            id: 3,
            project_name: '外滩修复项目',
            table_name: '设备检修记录',
            feature_name: '验收状态',
            rule_content: '验收状态必须为通过或不通过。',
            error_type: '逻辑错误',
            issue_details: null,
            created_at: '2025-03-05T14:22:00',
          },
          {
            id: 4,
            project_name: '大连路隧道',
            table_name: '施工任务单',
            feature_name: '项目负责人',
            rule_content: '项目负责人不能为空，并需在公司员工数据库中存在。',
            error_type: '数据完整性错误',
            issue_details: null,
            created_at: '2025-01-22T09:30:00',
          },
          {
            id: 5,
            project_name: '南京西路工程',
            table_name: '安全检查表',
            feature_name: '任务编码',
            rule_content: '任务编码必须唯一且符合项目编码规范。',
            error_type: '唯一性错误',
            issue_details: null,
            created_at: '2025-03-01T08:45:00',
          },
          {
            id: 6,
            project_name: '外滩修复项目',
            table_name: '设备维护表',
            feature_name: '验收状态',
            rule_content: '验收状态必须为通过或不通过。',
            error_type: '逻辑错误',
            issue_details: null,
            created_at: '2025-02-15T11:10:00',
          },
          {
            id: 7,
            project_name: '大连路隧道',
            table_name: '施工质量报告',
            feature_name: '任务编码',
            rule_content: '任务编码必须唯一且符合项目编码规范。',
            error_type: '唯一性错误',
            issue_details: null,
            created_at: '2025-01-12T13:55:00',
          },
        ],
      },
    ]
  })

  // 模拟重置接口（返回所有规则数据），数据格式与后端接口约定一致，使用你提供的数据
  mock.onGet('http://127.0.0.1:8080/rule/search/reset').reply((config) => {
    return [
      200,
      {
        total: 12,
        data: [
          {
            id: 1,
            project_name: '大连路隧道',
            table_name: '养护任务计划表',
            feature_name: '任务编码',
            rule_content: '任务编码必须唯一且符合项目编码规范。',
            error_type: '唯一性错误',
            issue_details: null,
            created_at: '2025-01-16T16:29:00',
          },
          {
            id: 2,
            project_name: '南京西路工程',
            table_name: '施工进度表',
            feature_name: '项目负责人',
            rule_content: '项目负责人不能为空，并需在公司员工数据库中存在。',
            error_type: '数据完整性错误',
            issue_details: null,
            created_at: '2025-02-10T10:15:00',
          },
          {
            id: 3,
            project_name: '外滩修复项目',
            table_name: '设备检修记录',
            feature_name: '验收状态',
            rule_content: '验收状态必须为通过或不通过。',
            error_type: '逻辑错误',
            issue_details: null,
            created_at: '2025-03-05T14:22:00',
          },
          {
            id: 4,
            project_name: '大连路隧道',
            table_name: '施工任务单',
            feature_name: '项目负责人',
            rule_content: '项目负责人不能为空，并需在公司员工数据库中存在。',
            error_type: '数据完整性错误',
            issue_details: null,
            created_at: '2025-01-22T09:30:00',
          },
          {
            id: 5,
            project_name: '南京西路工程',
            table_name: '安全检查表',
            feature_name: '任务编码',
            rule_content: '任务编码必须唯一且符合项目编码规范。',
            error_type: '唯一性错误',
            issue_details: null,
            created_at: '2025-03-01T08:45:00',
          },
          {
            id: 6,
            project_name: '外滩修复项目',
            table_name: '设备维护表',
            feature_name: '验收状态',
            rule_content: '验收状态必须为通过或不通过。',
            error_type: '逻辑错误',
            issue_details: null,
            created_at: '2025-02-15T11:10:00',
          },
          {
            id: 7,
            project_name: '大连路隧道',
            table_name: '施工质量报告',
            feature_name: '任务编码',
            rule_content: '任务编码必须唯一且符合项目编码规范。',
            error_type: '唯一性错误',
            issue_details: null,
            created_at: '2025-01-12T13:55:00',
          },
          {
            id: 8,
            project_name: '浦东机场扩建',
            table_name: '物资采购表',
            feature_name: '供应商名称',
            rule_content: '供应商名称不能为空，并需在合格供应商列表中。',
            error_type: '数据完整性错误',
            issue_details: null,
            created_at: '2025-04-20T09:00:00',
          },
          {
            id: 9,
            project_name: '上海地铁13号线',
            table_name: '成本预算表',
            feature_name: '预算金额',
            rule_content: '预算金额必须大于零。',
            error_type: '数值范围错误',
            issue_details: null,
            created_at: '2025-05-10T14:30:00',
          },
          {
            id: 10,
            project_name: '苏州河整治工程',
            table_name: '环境监测表',
            feature_name: '水质指标',
            rule_content: '水质指标必须符合国家环保标准。',
            error_type: '合规性错误',
            issue_details: null,
            created_at: '2025-06-05T10:45:00',
          },
          {
            id: 11,
            project_name: '徐汇滨江开发',
            table_name: '土地使用表',
            feature_name: '用地面积',
            rule_content: '用地面积必须大于零。',
            error_type: '数值范围错误',
            issue_details: null,
            created_at: '2025-07-15T09:20:00',
          },
          {
            id: 12,
            project_name: '世纪大道改造',
            table_name: '交通流量表',
            feature_name: '车辆数量',
            rule_content: '车辆数量必须大于等于零。',
            error_type: '数值范围错误',
            issue_details: null,
            created_at: '2025-08-22T13:00:00',
          },
        ],
      },
    ]
  })
}

// 选中值
const projectValue = ref<string[]>([])
const tableValue = ref<string[]>([])
const featureValue = ref<string[]>([])
const dateValue = ref<[Date, Date] | null>(null)

// 全选状态
const projectCheckAll = ref(false)
const tableCheckAll = ref(false)
const featureCheckAll = ref(false)

// 部分选中状态
const projectIndeterminate = ref(false)
const tableIndeterminate = ref(false)
const featureIndeterminate = ref(false)

// 搜索输入框
const projectSearch = ref('')
const tableSearch = ref('')
const featureSearch = ref('')

// 选项数据（初始为空，由 onMounted 或异步接口赋值）
const projectOptions = ref<{ value: string; label: string }[]>([])
const tableOptions = ref<{ value: string; label: string }[]>([])
const featureOptions = ref<{ value: string; label: string }[]>([])

// 过滤后的选项（用于下拉搜索过滤）
const filteredProjectOptions = ref([...projectOptions.value])
const filteredTableOptions = ref([...tableOptions.value])
const filteredFeatureOptions = ref([...featureOptions.value])

// 搜索过滤逻辑
const filterProjectOptions = () => {
  filteredProjectOptions.value = projectOptions.value.filter((item) =>
    item.label.includes(projectSearch.value),
  )
}

const filterTableOptions = () => {
  filteredTableOptions.value = tableOptions.value.filter((item) =>
    item.label.includes(tableSearch.value),
  )
}

const filterFeatureOptions = () => {
  filteredFeatureOptions.value = featureOptions.value.filter((item) =>
    item.label.includes(featureSearch.value),
  )
}

// 处理全选
const handleProjectCheckAll = (val: boolean) => {
  projectValue.value = val ? projectOptions.value.map((item) => item.value) : []
}

const handleTableCheckAll = (val: boolean) => {
  tableValue.value = val ? tableOptions.value.map((item) => item.value) : []
}

const handleFeatureCheckAll = (val: boolean) => {
  featureValue.value = val ? featureOptions.value.map((item) => item.value) : []
}

// 监听选项变化，更新全选状态及联动下级选项
watch(projectValue, (val) => {
  projectCheckAll.value = val.length === projectOptions.value.length
  projectIndeterminate.value = val.length > 0 && val.length < projectOptions.value.length
  // 当项目变化时，清空已选的表格和特征，同时重置特征选项
  tableValue.value = []
  featureValue.value = []
  featureOptions.value = []
  filteredFeatureOptions.value = []
  // 根据项目获取新的表格选项
  fetchTableOptions()
})

watch(tableValue, (val) => {
  tableCheckAll.value = val.length === tableOptions.value.length
  tableIndeterminate.value = val.length > 0 && val.length < tableOptions.value.length
  // 当表格变化时，清空已选特征并重置特征选项
  featureValue.value = []
  featureOptions.value = []
  filteredFeatureOptions.value = []
  // 根据项目和表格获取新的特征选项
  fetchFeatureOptions()
})

watch(featureValue, (val) => {
  featureCheckAll.value = val.length === featureOptions.value.length
  featureIndeterminate.value = val.length > 0 && val.length < featureOptions.value.length
})

// 表格数据和分页
const tableData = ref([])
const total = ref(50)
const currentPage = ref(1)
const pageSize = ref(12)

/* 弹窗 */
import FormEditDialog from '@/components/Edit_Dialog.vue'
import FormDialog from '@/components/View_Dialog.vue'
import DeleteDialog from '@/components/Delete_Dialog.vue'
import UploadFileDialog from '@/components/Upload_Dialog.vue'

//引用子组件实例
const editDialogRef = ref<InstanceType<typeof FormEditDialog> | null>(null)
const viewDialogRef = ref<InstanceType<typeof FormDialog> | null>(null)
const deleteDialog = ref<InstanceType<typeof DeleteDialog> | null>(null)
const uploadFileDialogRef = ref<InstanceType<typeof UploadFileDialog> | null>(null)

// 打开编辑弹窗
function openEditDialogInParent(ruleId: number) {
  editDialogRef.value?.openEditDialog(ruleId)
}

const isTestMode = ref(true)
// 打开查看弹窗（尝试接入后端数据）
async function checkDialogInParent(ruleId: number) {
  if (isTestMode.value) {
    // 测试模式：使用假数据
    const testData = {
      tableName: '测试表格',
      featureName: '测试特征',
      ruleContent: '这是测试规则内容',
    }

    viewDialogRef.value?.openDialog(testData)
    return
  }

  try {
    const response = await axios.get(`http://127.0.0.1:8080/rule/manage/${ruleId}`)
    const data = response.data

    if (viewDialogRef.value) {
      viewDialogRef.value.openDialog({
        tableName: data.table_name,
        featureName: data.feature_name,
        ruleContent: data.rule_content,
      })
    }
  } catch (error) {
    console.error('获取规则数据失败:', error)
  }
}

// 打开删除弹窗
function openDeleteDialog(ruleId: number) {
  deleteDialog.value?.openDialog(ruleId, () => {
    // 删除成功后，从 tableData 里移除对应项
    tableData.value = tableData.value.filter((item) => item.id !== ruleId)
  })
}

// 打开上传文件弹窗
function openUploadFileDialog() {
  uploadFileDialogRef.value?.openDialog()
}

// API 调用函数

// 获取项目选项
async function fetchProjectOptions() {
  if (useMockData) {
    projectOptions.value = [
      { value: '1', label: '大连路隧道' },
      { value: '2', label: '南京西路工程' },
      { value: '3', label: '外滩修复项目' },
    ]
    filteredProjectOptions.value = [...projectOptions.value]
    return
  }
  try {
    const { data } = await axios.get('http://127.0.0.1:8080/rule/search/project')
    if (data.options && Array.isArray(data.options)) {
      projectOptions.value = data.options.map((item: string) => ({ value: item, label: item }))
      filteredProjectOptions.value = [...projectOptions.value]
    }
  } catch (error) {
    console.error('获取项目选项失败', error)
    ElMessage.error('获取项目选项失败')
  }
}

// 获取表格选项，根据项目名称筛选
async function fetchTableOptions() {
  const selectedProject = projectValue.value.length ? projectValue.value[0] : ''
  if (!selectedProject) return
  if (useMockData) {
    tableOptions.value = [
      { value: '101', label: '养护任务计划表' },
      { value: '102', label: '施工进度表' },
      { value: '103', label: '设备检修记录' },
    ]
    filteredTableOptions.value = [...tableOptions.value]
    return
  }
  try {
    const { data } = await axios.get('http://127.0.0.1:8080/rule/search/table', {
      params: { project_name: selectedProject },
    })
    if (data.options && Array.isArray(data.options)) {
      tableOptions.value = data.options.map((item: string) => ({ value: item, label: item }))
      filteredTableOptions.value = [...tableOptions.value]
    }
  } catch (error) {
    console.error('获取表格选项失败', error)
    ElMessage.error('获取表格选项失败')
  }
}

// 获取特征选项，根据项目名称和表格名称筛选
async function fetchFeatureOptions() {
  const selectedProject = projectValue.value.length ? projectValue.value[0] : ''
  const selectedTable = tableValue.value.length ? tableValue.value[0] : ''
  if (!selectedProject || !selectedTable) return
  if (useMockData) {
    featureOptions.value = [
      { value: '201', label: '任务编码' },
      { value: '202', label: '项目负责人' },
      { value: '203', label: '验收状态' },
    ]
    filteredFeatureOptions.value = [...featureOptions.value]
    return
  }
  try {
    const { data } = await axios.get('http://127.0.0.1:8080/rule/search/feature', {
      params: { project_name: selectedProject, table_name: selectedTable },
    })
    if (data.options && Array.isArray(data.options)) {
      featureOptions.value = data.options.map((item: string) => ({ value: item, label: item }))
      filteredFeatureOptions.value = [...featureOptions.value]
    }
  } catch (error) {
    console.error('获取特征选项失败', error)
    ElMessage.error('获取特征选项失败')
  }
}

// 搜索规则数据，支持分页查询（调用搜索接口）
async function searchRules() {
  const params: any = {}
  if (projectValue.value.length) {
    params.project_name = projectValue.value[0]
  }
  if (tableValue.value.length) {
    params.table_name = tableValue.value[0]
  }
  if (featureValue.value.length) {
    params.feature_name = featureValue.value[0]
  }
  if (dateValue.value) {
    const start = dateValue.value[0].toISOString().slice(0, 10)
    const end = dateValue.value[1].toISOString().slice(0, 10)
    params.start_time = start
    params.end_time = end
  }
  params.page = currentPage.value
  params.page_size = pageSize.value

  try {
    const { data } = await axios.get('http://127.0.0.1:8080/rule/search/', { params })
    tableData.value = data.data.map((item: any) => ({
      name: item.table_name,
      feature: item.feature_name,
      project: item.project_name,
      date: item.created_at,
    }))
    total.value = Math.ceil(data.total / pageSize.value)
  } catch (error) {
    console.error('搜索规则失败', error)
    ElMessage.error('搜索规则失败')
  }
}

// 新增函数：调用重置接口，获取所有规则数据
async function resetRules() {
  const params = {
    page: currentPage.value,
    page_size: pageSize.value, // 固定为12
  }
  try {
    const { data } = await axios.get('http://127.0.0.1:8080/rule/search/reset', { params })
    tableData.value = data.data.map((item: any) => ({
      name: item.table_name,
      feature: item.feature_name,
      project: item.project_name,
      date: item.created_at,
    }))
    total.value = Math.ceil(data.total / pageSize.value)
  } catch (error) {
    console.error('重置规则数据失败', error)
    ElMessage.error('重置规则数据失败')
  }
}

// 分页变化处理
function handlePageChange(page: number) {
  currentPage.value = page
  // 若无筛选条件，则调用重置接口；否则调用搜索接口
  if (
    !projectValue.value.length &&
    !tableValue.value.length &&
    !featureValue.value.length &&
    !dateValue.value
  ) {
    resetRules()
  } else {
    searchRules()
  }
}

// 重置过滤条件，并调用重置接口获取所有规则数据
function resetFilters() {
  projectValue.value = []
  tableValue.value = []
  featureValue.value = []
  dateValue.value = null
  currentPage.value = 1

  // 重置下拉框全选状态
  projectCheckAll.value = false
  tableCheckAll.value = false
  featureCheckAll.value = false

  // 调用重置接口获取最新规则数据
  resetRules()
}

// 页面加载时获取项目选项及初始规则数据
onMounted(() => {
  fetchProjectOptions()
  resetRules()
})
</script>

<style scoped>
/* 顶部样式 */
.header-container {
  background-color: #e1ecf9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px;
  height: 107px;
}

/* 顶部左右两个组件 */
.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-text {
  font-size: 18px;
  color: #2f435d;
}

.header-icon {
  font-size: 28px;
  color: #2f435d;
}

/* 筛选区域 */
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.filter-group {
  display: flex;
  gap: 15px;
  width: 100%;
}

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

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

/* 搜索框样式 */
.dropdown-search {
  width: calc(100% - 20px);
  margin: 5px 10px;
}

/* 表格背景区域 */
.table-container {
  background-color: #f2f6fc;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  height: 580px;
}

/* 导入按钮 */
.import-button {
  margin-bottom: 10px;
}

/* 分页器容器 */
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>
