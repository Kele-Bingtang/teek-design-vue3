<script setup lang="ts" name="Menu1"></script>

<template>
  <el-alert :closable="false" title="menu 1">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-alert>
</template>
