<template>
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
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

// 用于存放选择的时间范围，类型为 [Date, Date] 或 null
const dateValue = ref<[Date, Date] | null>(null)

// 通过 emit 将开始时间和结束时间数据上报给父组件
const emit = defineEmits<{
  (e: 'update:start_time', value: string): void,
  (e: 'update:end_time', value: string): void
}>()

// 监听日期选择变化，转换为 "YYYY-MM-DD" 格式后上报
watch(dateValue, (newVal) => {
  if (newVal) {
    const start = newVal[0].toISOString().slice(0, 10)
    const end = newVal[1].toISOString().slice(0, 10)
    emit('update:start_time', start)
    emit('update:end_time', end)
  } else {
    // 清空时上报空字符串
    emit('update:start_time', '')
    emit('update:end_time', '')
  }
})

// 添加 reset 方法
const reset = () => {
  dateValue.value = null  // 清空日期选择
  emit('update:start_time', '')  // 清空开始时间
  emit('update:end_time', '')    // 清空结束时间
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
</style>
