<script setup lang="ts" name="">
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useBreadcrumbs, useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "Breadcrumb" });

const ns = useNamespace("breadcrumb");

const settingStore = useSettingStore();
const { breadcrumbList } = useBreadcrumbs();
</script>

<template>
  <el-breadcrumb :class="ns.b()" class="flx-align-center" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbList" :key="breadcrumb.path">
        <div
          v-if="breadcrumb.meta.notClickBread || index === breadcrumbList.length - 1"
          :class="[ns.e('link'), ns.no('click')]"
        >
          <Icon
            v-if="breadcrumb.meta?.icon && settingStore.showBreadcrumbIcon"
            :icon="breadcrumb.meta.icon"
            :class="ns.e('icon')"
          />
          <span>{{ breadcrumb.meta.title }}</span>
        </div>

        <router-link v-else :to="{ path: breadcrumb.meta._fullPath || breadcrumb.path }" :class="ns.e('link')">
          <Icon
            v-if="breadcrumb.meta?.icon && settingStore.showBreadcrumbIcon"
            :icon="breadcrumb.meta.icon"
            :class="ns.e('icon')"
          />
          <span>{{ breadcrumb.meta.title }}</span>
        </router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
