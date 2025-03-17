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
                >全选</el-checkbox>
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
                >全选</el-checkbox>
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
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </div>
      </div>

      <div class="table-container">
        <el-button type="primary" class="import-button">导入</el-button>
        <div class="page-container">
        <el-table :data="tableData">
            <el-table-column label="序号" type="index" width="80" />
            <el-table-column label="表格名称" prop="name" />
            <el-table-column label="特征名称" prop="feature" />
            <el-table-column label="所属项目" prop="project" />
            <el-table-column label="创建时间" prop="date" width="180" />

            <el-table-column label="操作" width="200">
            <template #default="scope">
                <el-button size="small" type="success">查看</el-button>
                <el-button size="small" type="warning">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        </div>
      </div>

      <el-pagination background layout="prev, pager, next" :total="50" class="pagination" />
    </el-main>
    </el-container>
  </template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

// 选中值
const projectValue = ref<string[]>([]);
const tableValue = ref<string[]>([]);
const featureValue = ref<string[]>([]);
    const dateValue = ref<[Date, Date] | null>(null);

// 全选状态
const projectCheckAll = ref(false);
const tableCheckAll = ref(false);
const featureCheckAll = ref(false);

// 部分选中状态
const projectIndeterminate = ref(false);
const tableIndeterminate = ref(false);
const featureIndeterminate = ref(false);

// 搜索输入框
const projectSearch = ref('');
const tableSearch = ref('');
const featureSearch = ref('');

// 选项数据
const projectOptions = ref([
  { value: '1', label: '大连路隧道' },
  { value: '2', label: '南京西路工程' },
  { value: '3', label: '外滩修复项目' }
]);

const tableOptions = ref([
  { value: '101', label: '养护任务计划表' },
  { value: '102', label: '施工进度表' },
  { value: '103', label: '设备检修记录' }
]);

const featureOptions = ref([
  { value: '201', label: '任务编码' },
  { value: '202', label: '项目负责人' },
  { value: '203', label: '验收状态' }
]);

// 过滤后的选项
const filteredProjectOptions = ref([...projectOptions.value]);
const filteredTableOptions = ref([...tableOptions.value]);
const filteredFeatureOptions = ref([...featureOptions.value]);

// 搜索过滤逻辑
const filterProjectOptions = () => {
  filteredProjectOptions.value = projectOptions.value.filter(item =>
    item.label.includes(projectSearch.value)
  );
};

const filterTableOptions = () => {
  filteredTableOptions.value = tableOptions.value.filter(item =>
    item.label.includes(tableSearch.value)
  );
};

const filterFeatureOptions = () => {
  filteredFeatureOptions.value = featureOptions.value.filter(item =>
    item.label.includes(featureSearch.value)
  );
};

// 处理全选
const handleProjectCheckAll = (val: boolean) => {
  projectValue.value = val ? projectOptions.value.map(item => item.value) : [];
};

const handleTableCheckAll = (val: boolean) => {
  tableValue.value = val ? tableOptions.value.map(item => item.value) : [];
};

const handleFeatureCheckAll = (val: boolean) => {
  featureValue.value = val ? featureOptions.value.map(item => item.value) : [];
};

// 监听选项变化，更新全选状态
watch(projectValue, (val) => {
  projectCheckAll.value = val.length === projectOptions.value.length;
  projectIndeterminate.value = val.length > 0 && val.length < projectOptions.value.length;
});

watch(tableValue, (val) => {
  tableCheckAll.value = val.length === tableOptions.value.length;
  tableIndeterminate.value = val.length > 0 && val.length < tableOptions.value.length;
});

watch(featureValue, (val) => {
  featureCheckAll.value = val.length === featureOptions.value.length;
  featureIndeterminate.value = val.length > 0 && val.length < featureOptions.value.length;
});

const tableData = [
  {
    name: '养护任务计划表',
    feature: '任务编码',
    project: '大连路隧道',
    date: '2025-01-16 16:29'
  }
];
</script>

<style scoped>
  /* 顶部样式 */
  .header-container {
    background-color: #E1ECF9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
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
    color: #2F435D;
  }

  .header-icon {
    font-size: 28px;
    color: #2F435D;
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
  width: 100%
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
  background-color: #F2F6FC;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
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