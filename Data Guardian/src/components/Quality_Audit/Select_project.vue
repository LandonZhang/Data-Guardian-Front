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

// Define props and emits for parent-child communication
const emit = defineEmits(['projectSelected']);

// Define state variables
const selectedProject = ref('');
const projectOptions = ref([]);

// Fetch project options from API
const fetchProjectOptions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/rule/search/project');
    if (response.data && response.data.options) {
      projectOptions.value = response.data.options.map((item: string) => ({
        value: item,
        label: item
      }));
    }
  } catch (error) {
    console.error('获取项目列表失败:', error);
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
