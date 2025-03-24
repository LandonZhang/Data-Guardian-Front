<template>
  <div class="select-item">
    <span class="select-label">选择项目</span>
    <el-select-v2
      v-model="value"
      :options="options"
      placeholder="请选择项目"
      class="select-input"
    />
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const value = ref()
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}))
</script>


<style scoped>
.select-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.select-label {
  font-size: 14px;
  color: #333;
}

.select-input {
  width: 1240px;
  margin-left: 10px;
}
</style>