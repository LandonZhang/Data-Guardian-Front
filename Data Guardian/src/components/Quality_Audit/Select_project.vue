<template>
  <div class="select-item">
    <span class="select-label">选择项目</span>
    <el-select-v2
      v-model="selectedProject"
      :options="projectOptions"
      placeholder="请选择项目"
      class="select-input"
      @change="handleProjectChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// Define props and emits for parent-child communication
const props = defineProps({
  resetProject: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['projectSelected']);

// Define interface for project options
interface ProjectOption {
  value: string;
  label: string;
}

// Define state variables
const selectedProject = ref('');
const projectOptions = ref<ProjectOption[]>([]);

// 模拟数据
const mockProjectOptions = [
  { value: "项目A", label: "项目A" },
  { value: "项目B", label: "项目B" },
  { value: "项目C", label: "项目C" }
];

// 获取项目选项API
const fetchProjectOptions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/rule/search/project');
    if (response.data) {
      // 处理直接返回数组的情况
      const dataArray = Array.isArray(response.data) ? response.data :
        (response.data.options ? response.data.options : []);

      projectOptions.value = dataArray.map((item: string) => ({
        value: item,
        label: item
      }));
    }
  } catch (error) {
    console.error('获取项目列表失败:', error);

    // 使用模拟数据
    projectOptions.value = mockProjectOptions;

    ElMessage({
      message: "无法连接到服务器，使用模拟数据",
      type: "warning",
      duration: 3000
    });
  }
};

// Handle project selection change
const handleProjectChange = () => {
  if (selectedProject.value) {
    emit('projectSelected', selectedProject.value);
  }
};

// Fetch project options when component is mounted
onMounted(() => {
  fetchProjectOptions();
});

// Watch for changes to the selected project
watch(selectedProject, (newValue) => {
  if (newValue) {
    handleProjectChange();
  }
});

// Watch for resetProject prop to reset the selected project
watch(() => props.resetProject, (shouldReset) => {
  if (shouldReset) {
    selectedProject.value = '';
  }
});
</script>

<style scoped>
.select-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.select-label {
  font-size: 14px;
  color: #333;
}

.select-input {
  width: 1230px;
  margin-left: 10px;
}
</style>
