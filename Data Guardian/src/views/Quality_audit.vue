<template>
  <div>
    <h1>
      这是质量稽核页面
    </h1>

    <!-- 查看按钮 -->
    <el-button @click="showDialog(1)">查看规则</el-button>

    <!-- 编辑按钮 -->
    <el-button @click="openEditDialog(1)">编辑规则</el-button>

    <!-- 删除按钮 -->
    <el-button @click="openDeleteDialog(1)" type="danger">删除规则</el-button>

    <!-- 导入按钮 -->
    <el-button type="primary" @click="openUploadDialog">导入规则</el-button>

    <!-- 查看弹窗子组件 -->
    <FormDialog ref="formDialog" />

    <!-- 编辑弹窗子组件 -->
    <EditDialog ref="editDialog" />

    <!-- 删除弹窗子组件 -->
    <DeleteDialog ref="deleteDialog" />

    <!-- 导入弹窗子组件 -->
    <UploadDialog ref="uploadDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormDialog from "@/components/Rule_configuration/view_dialog/View_Dialog.vue"
import DeleteDialog from "@/components/Rule_configuration/delete_dialog/Delete_Dialog.vue"
import EditDialog from "@/components/Rule_configuration/edit_dialog/Edit_Dialog.vue"
import UploadDialog from "@/components/Rule_configuration/upload_dialog/Upload_Dialog.vue"

// 获取组件的引用
const formDialog = ref(null)
const deleteDialog = ref(null)
const editDialog = ref(null)
const uploadDialog = ref(null)

// 打开查看弹窗并传入规则ID
const showDialog = (ruleId: number) => {
  formDialog.value?.openDialog(ruleId)
}

// 打开编辑弹窗并传入规则ID
const openEditDialog = (ruleId: number) => {
  editDialog.value?.openDialog(ruleId)
}

// 打开删除弹窗并传入规则ID
const openDeleteDialog = (ruleId: number) => {
  deleteDialog.value?.openDialog(ruleId)
}

// 打开导入弹窗
const openUploadDialog = () => {
  uploadDialog.value?.openDialog()
}
</script>
