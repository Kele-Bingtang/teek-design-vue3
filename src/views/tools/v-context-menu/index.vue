<script setup lang="ts" name="VContextmenu">
import Basic from "./components/basic.vue";
import MenuGroup from "./components/menuGroup.vue";
import MenuDynamic from "./components/menuDynamic.vue";
import "v-contextmenu/dist/themes/default.css";
</script>

<template>
  <el-space fill style="width: 100%">
    <el-card shadow="never" class="tk-card-minimal">
      <template #header>
        <span class="font-medium">
          <el-link
            href="https://www.npmjs.com/package/v-contextmenu/v/2.8.1?activeTab=readme"
            target="_blank"
            style="font-size: 20px"
          >
            v-contextmenu 插件
          </el-link>
        </span>
      </template>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
          <!-- 基本使用 -->
          <Basic />
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
          <!-- 按钮组 -->
          <MenuGroup />
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
          <!-- 动态菜单 -->
          <MenuDynamic />
        </el-col>
      </el-row>
    </el-card>
  </el-space>
</template>
