<template>
    <el-row class="tac">
    <el-col :span="12">
      <h5 class="mb-2">数据稽核工具</h5>
      <el-menu
        background-color="#E1ECF9"
        default-active="2"
        class="el-menu-vertical-demo"
      >

        <el-menu-item index="0">
          <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>

        <el-menu-item index="1">
          <el-icon><Setting /></el-icon>
          <span>规则配置</span>
        </el-menu-item>
        
        <el-sub-menu index="2">
          <template #title>
            <el-icon><DocumentChecked /></el-icon>
            <span>数据稽核</span>
          </template>
            <el-menu-item index="2-1">质量稽核</el-menu-item>
            <el-menu-item index="2-2">稽核结果</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="3">
          <el-icon><Edit /></el-icon>
          <span>数据修正</span>
        </el-menu-item>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>模型管理</span>
          </template>
            <el-menu-item index="4-1">模型微调</el-menu-item>
            <el-menu-item index="4-2">协助情况概览</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="5">
          <el-icon><Notebook /></el-icon>
          <span>项目管理</span>
        </el-menu-item>

      </el-menu>
    </el-col>
    </el-row>
</template>

<style>

</style>