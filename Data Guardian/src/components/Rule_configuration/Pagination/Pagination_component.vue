<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :current-page="currentPage"
    :page-size="12"
    @current-change="handlePageChange"
    class="pagination"
  />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

//接收父组件传递的 `total`（总数据条数）
const props = defineProps<{ total: number }>()

//向父组件发送 `page` 变化事件
const emit = defineEmits<{
  (event: 'update:page', page: number): void
}>()

//维护当前页码
const currentPage = ref(1)

// 监听 `total` 变化，确保 `currentPage` 在有效范围内
watch(() => props.total, (newTotal) => {
  const maxPage = Math.ceil(newTotal / 12) || 1 // 计算最大页码数
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage // 防止 `currentPage` 超出范围
  }
})

// 处理页码变化，并通知父组件
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  emit('update:page', newPage) // 通知父组件更新 `page`
}
</script>


<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
