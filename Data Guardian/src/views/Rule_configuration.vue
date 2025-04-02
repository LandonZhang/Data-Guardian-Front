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
          <!-- 使用 v-model 实现双向绑定 -->
          <Project ref="projectRef" v-model:selected_project="selectProjectName" />
          <Table
            ref="tableRef"
            :selected_project="selectProjectName"
            @update:selected_table="handleTableNameUpdate"
          />
          <!-- Feature 组件要求传入 select_project、table_name，并监听 update:feature_name -->
          <Feature
            ref="featureRef"
            :selected_project="selectProjectName"
            :selected_table="selectTableName"
            @update:selected_feature="handleFeatureNameUpdate"
          />
        </div>
        <DatePickerComponent
          :start_time="startTime"
          :end_time="endTime"
          @update:start_time="(val) => (startTime = val)"
          @update:end_time="(val) => (endTime = val)"
          ref="datePickerRef"
        />

        <div class="filter-buttons">
          <!-- 为 Search 组件传递所有必填 props -->
          <Search
            :select_project="selectProjectName"
            :selected_table="selectTableName"
            :selected_feature="selectFeatureName"
            :start_time="startTime"
            :end_time="endTime"
            :page="currentPage"
            @search="handleSearch"
          />
          <Reset @reset="handleReset" />
        </div>
      </div>

      <div class="table-container">
        <el-button type="primary" class="import-button" @click="openUploadFileDialog">
          导入
        </el-button>
        <div class="page-container">
          <el-table :data="tableData">
            <!-- 修改序号列，使用索引+1作为序号 -->
            <el-table-column label="序号" width="80">
              <template #default="scope">
                {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="表格名称" prop="table_name" />
            <el-table-column label="特征名称" prop="feature_name" />
            <el-table-column label="所属项目" prop="project_name" />
            <el-table-column label="创建时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template #header>
                <span class="operation-header">操作</span>
              </template>
              <template #default="scope">
                <div class="operation-buttons">
                  <el-button
                    size="small"
                    type="success"
                    @click="checkDialogInParent(scope.row.id, scope.$index)"
                    >查看</el-button
                  >
                  <el-button
                    size="small"
                    type="warning"
                    @click="openEditDialogInParent(scope.row.id, scope.$index)"
                    >编辑</el-button
                  >
                  <el-button size="small" type="danger" @click="openDeleteDialog(scope.row.id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pagination-container" style="text-align: right; margin-top: 20px">
        <PaginationComponent
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @update:page="handlePageChange"
        />
      </div>
    </el-main>
  </el-container>

  <FormEditDialog ref="editDialogRef" />
  <FormDialog ref="viewDialogRef" />
  <DeleteDialog ref="deleteDialogRef" />
  <UploadFileDialog ref="uploadFileDialogRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// 引入子组件
import Project from '@/components/Rule_configuration/Projectpicker/Project_name.vue'
import Table from '@/components/Rule_configuration/TablePicker/Table_name.vue'
import Feature from '@/components/Rule_configuration/FeaturePicker/Feature_name.vue'
import DatePickerComponent from '@/components/Rule_configuration/DatePicker/DatePicker_Component.vue'
import Search from '@/components/Rule_configuration/Search_button/Search_button.vue'
import Reset from '@/components/Rule_configuration/Reset_button/Reset_button.vue'
import PaginationComponent from '@/components/Rule_configuration/Pagination/Pagination_component.vue'
import FormEditDialog from '@/components/Rule_configuration/edit_dialog/Edit_Dialog.vue'
import FormDialog from '@/components/Rule_configuration/view_dialog/View_Dialog.vue'
import DeleteDialog from '@/components/Rule_configuration/delete_dialog/Delete_Dialog.vue'
import UploadFileDialog from '@/components/Rule_configuration/upload_dialog/Upload_Dialog.vue'
import request from '@/utils/request'

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

// 响应式数据
const tableData = ref<RuleData[]>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = 12

// 子组件 ref 引用
const projectRef = ref<InstanceType<typeof Project> | null>(null)
const tableRef = ref<InstanceType<typeof Table> | null>(null)
const featureRef = ref<InstanceType<typeof Feature> | null>(null)
const datePickerRef = ref<InstanceType<typeof DatePickerComponent> | null>(null)
const editDialogRef = ref<InstanceType<typeof FormEditDialog> | null>(null)
const viewDialogRef = ref<InstanceType<typeof FormDialog> | null>(null)
const deleteDialogRef = ref<InstanceType<typeof DeleteDialog> | null>(null)
const uploadFileDialogRef = ref<InstanceType<typeof UploadFileDialog> | null>(null)

// 定义响应式变量
const selectProjectName = ref<string[]>([]) //
const selectTableName = ref<string[]>([]) // 选中的表名称
const selectFeatureName = ref<string[]>([]) // 选中的特征名称
const startTime = ref<string>('') // 搜索起始时间
const endTime = ref<string>('') // 搜索结束时间

const handleTableNameUpdate = (newTableName: string[]) => {
  selectTableName.value = newTableName
}
// 处理特征名称更新的方法

const handleFeatureNameUpdate = (newFeatureNames: string[]) => {
  selectFeatureName.value = newFeatureNames
}

// 获取规则数据
const fetchRules = async (page: number) => {
  try {
    const response = await request.get('/rule/search/reset', {
      params: { page, page_size: pageSize },
    })
    total.value = response.data.total
    tableData.value = response.data.data
  } catch (error) {
    console.error('获取规则数据失败：', error)
  }
}

onMounted(() => {
  fetchRules(currentPage.value)
})

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD')
}

// Search 组件触发搜索事件，传入的 payload 包含 tableData 与 total
const handleSearch = (payload: { tableData: RuleData[]; total: number }) => {
  tableData.value = payload.tableData
  total.value = payload.total
}

const handleReset = async () => {
  projectRef.value?.reset?.()
  tableRef.value?.reset?.()
  featureRef.value?.reset?.()
  datePickerRef.value?.reset?.()

  currentPage.value = 1
  await fetchRules(currentPage.value)
  ElMessage.success('重置成功，并已加载全部数据')
}

const handlePageChange = (page: number) => {
  currentPage.value = page

  // 判断 selectProjectName, selectTableName, selectFeatureName, startTime, endTime 是否都为空
  const isEmpty =
    selectProjectName.value.length === 0 &&
    selectTableName.value.length === 0 &&
    selectFeatureName.value.length === 0 &&
    startTime.value === '' &&
    endTime.value === ''

  // 只有当它们都为空时，才进行重新请求数据
  if (isEmpty) {
    fetchRules(page)
  }
}

const openUploadFileDialog = () => {
  uploadFileDialogRef.value?.openDialog() // 修改为调用 openDialog 方法
}

// Rule_configuration.vue 中需要修改的部分
const checkDialogInParent = (id: number, index: number) => {
  // 计算并传递前端序号
  const frontendIndex = (currentPage.value - 1) * pageSize + index + 1
  viewDialogRef.value?.openDialog(id, frontendIndex)
}

const openEditDialogInParent = (id: number, index: number) => {
  // 计算并传递前端序号
  const frontendIndex = (currentPage.value - 1) * pageSize + index + 1
  editDialogRef.value?.openDialog(id, frontendIndex)
}

const openDeleteDialog = (id: number) => {
  deleteDialogRef.value?.openDialog(id, () => {
    fetchRules(currentPage.value) // 删除成功后，刷新当前页数据
  })
}
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

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

/* 表格背景区域 */
.table-container {
  background-color: #f2f6fc;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
  height: 575px;
}

/* 导入按钮 */
.import-button {
  margin-bottom: 10px;
}

/* 操作按钮相关样式 */
.operation-header {
  display: inline-block;
  width: 100%;
  text-align: center;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}

/* 确保表格内的按钮居中显示 */
:deep(.el-table .cell) {
  text-align: center;
}
</style>
