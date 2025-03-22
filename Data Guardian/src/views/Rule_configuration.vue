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
          <!-- 为 Project 传递项目名称 -->
          <Project ref="projectRef" :project_name="projectName" />
          <!-- 为 Table 传递 project_name 与 table_name -->
          <Table
            ref="tableRef"
            :project_name="projectName"
            :table_name="tableName"
            @update:table_name="handleTableNameUpdate"
          />
          <!-- Feature 组件要求传入 project_name、table_name，并监听 update:feature_name -->
          <Feature
            ref="featureRef"
            :project_name="projectName"
            :table_name="tableName"
            @update:feature_name="handleFeatureNameUpdate"
          />
        </div>
        <DatePickerComponent ref="datePickerRef" />
        <div class="filter-buttons">
          <!-- 为 Search 组件传递所有必填 props -->
          <Search
            :project_name="projectName"
            :table_name="tableName"
            :feature_name="featureName"
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
            <el-table-column label="序号" prop="id" width="80" />
            <el-table-column label="表格名称" prop="table_name" />
            <el-table-column label="特征名称" prop="feature_name" />
            <el-table-column label="所属项目" prop="project_name" />
            <el-table-column label="创建时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" type="success" @click="checkDialogInParent(scope.row.id)">查看</el-button>
                <el-button size="small" type="warning" @click="openEditDialogInParent(scope.row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="openDeleteDialog(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-container" style="text-align: right; margin-top: 20px;">
          <PaginationComponent
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @pageChange="handlePageChange"
          />
        </div>
      </div>
    </el-main>
  </el-container>

  <FormEditDialog ref="editDialogRef" />
  <FormDialog ref="viewDialogRef" />
  <DeleteDialog ref="deleteDialog" />
  <UploadFileDialog ref="uploadFileDialogRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

// 引入子组件
import Project from '@/components/Rule_configuration/Projectpicker/Project_name.vue';
import Table from '@/components/Rule_configuration/TablePicker/Table_name.vue';
import Feature from '@/components/Rule_configuration/FeaturePicker/Feature_name.vue';
import DatePickerComponent from '@/components/Rule_configuration/DatePicker/DatePicker_Component.vue';
import Search from '@/components/Rule_configuration/Search_button/Search_button.vue';
import Reset from '@/components/Rule_configuration/Reset_button/Reset_button.vue';
import PaginationComponent from '@/components/Rule_configuration/Pagination/Pagination_component.vue';
import FormEditDialog from "@/components/Rule_configuration/edit_dialog/Edit_Dialog.vue";
import FormDialog from "@/components/Rule_configuration/view_dialog/View_Dialog.vue";
import DeleteDialog from "@/components/Rule_configuration/delete_dialog/Delete_Dialog.vue";
import UploadFileDialog from "@/components/Rule_configuration/upload_dialog/Upload_Dialog.vue";

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

// 响应式数据
const tableData = ref<RuleData[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = 12;

// 子组件 ref 引用
const projectRef = ref<InstanceType<typeof Project> | null>(null);
const tableRef = ref<InstanceType<typeof Table> | null>(null);
const featureRef = ref<InstanceType<typeof Feature> | null>(null);
const datePickerRef = ref<InstanceType<typeof DatePickerComponent> | null>(null);
const editDialogRef = ref<InstanceType<typeof FormEditDialog> | null>(null);
const viewDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const deleteDialogRef = ref<InstanceType<typeof DeleteDialog> | null>(null);
const uploadFileDialogRef = ref<InstanceType<typeof UploadFileDialog> | null>(null);

// 定义响应式变量
const projectName = ref<string>('');    // 选中的项目名称
const tableName = ref<string>('');      // 选中的表名称
const featureName = ref<string>('');    // 选中的特征名称
const startTime = ref<string>('');      // 搜索起始时间
const endTime = ref<string>('');        // 搜索结束时间

// Table 组件通过 update:table_name 回传新值（假设返回的是 string[]，这里转换为字符串保存）
const handleTableNameUpdate = (newTableNames: string[]) => {
  tableName.value = newTableNames.join(',');
  console.log('Updated table names:', tableName.value);
};

// Feature 组件通过 update:feature_name 回传新值（假设返回的是 string[]，这里转换为字符串保存）
const handleFeatureNameUpdate = (newFeatureNames: string[]) => {
  featureName.value = newFeatureNames.join(',');
  console.log('Updated feature names:', featureName.value);
};

// 获取规则数据
const fetchRules = async (page: number) => {
  try {
    const response = await axios.get("http://127.0.0.1:8080/rule/search/reset", {
      params: { page, page_size: pageSize },
    });
    total.value = response.data.total;
    tableData.value = response.data.data;
  } catch (error) {
    console.error("获取规则数据失败：", error);
  }
};

onMounted(() => {
  fetchRules(currentPage.value);
});

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD');
};

// Search 组件触发搜索事件，传入的 payload 包含 tableData 与 total
const handleSearch = (payload: { tableData: RuleData[]; total: number }) => {
  tableData.value = payload.tableData;
  total.value = payload.total;
};

const handleReset = async () => {
  projectRef.value?.reset?.();
  tableRef.value?.reset?.();
  featureRef.value?.reset?.();
  datePickerRef.value?.reset?.();

  currentPage.value = 1;
  await fetchRules(currentPage.value);
  ElMessage.success('重置成功，并已加载全部数据');
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchRules(page);
};

const openUploadFileDialog = () => {
  uploadFileDialogRef.value?.openDialog(); // 修改为调用 openDialog 方法
};


const checkDialogInParent = (id: number) => {
  viewDialogRef.value?.openDialog(id);
};


const openEditDialogInParent = (id: number) => {
  editDialogRef.value?.openDialog(id);
};

const openDeleteDialog = (id: number) => {
  deleteDialogRef.value?.openDialog(id, () => {
    fetchRules(currentPage.value); // 删除成功后，刷新当前页数据
  });
};


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
  margin-top: 15px;
  height: 580px;
}

/* 导入按钮 */
.import-button {
  margin-bottom: 10px;
}


</style>
