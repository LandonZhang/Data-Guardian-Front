<template>
  <el-button @click="resetFilters">重置</el-button>
</template>

<script lang="ts" setup>
/**
 * 本组件用于触发重置操作，
 * 点击按钮后，通过 emit 事件通知父组件，
 * 父组件可以在对应事件回调中调用各搜索组件的 reset 方法
 */
const emit = defineEmits<{
  (e: 'reset'): void;
}>();

const resetFilters = () => {
  emit('reset');
};
</script>
