<script setup lang="ts" name="">
import { useRoute } from "vue-router";
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useBreadcrumbs, useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { HOME_URL, HOME_NAME } from "@/common/config";

defineOptions({ name: "Breadcrumb" });

const ns = useNamespace("breadcrumb");
const router = useRouter();
const route = useRoute();

const settingStore = useSettingStore();
const { breadcrumbList } = useBreadcrumbs();

const { breadcrumb: breadcrumbConfig } = storeToRefs(settingStore);

const showHome = computed(() => {
  return breadcrumbConfig.value.showHome && !breadcrumbConfig.value.onlyShowHomeIcon;
});
</script>

<template>
  <el-breadcrumb
    v-if="breadcrumbConfig.hideOnlyOne ? breadcrumbList.length !== 2 : true"
    :class="ns.b()"
    class="customize flx-align-center"
    :separator-icon="ArrowRight"
  >
    <transition-group name="breadcrumb">
      <Icon
        v-if="breadcrumbConfig.onlyShowHomeIcon"
        icon="core-home"
        :class="ns.e('home-icon')"
        @click="router.push(HOME_URL)"
      />

      <template v-for="(breadcrumb, index) in breadcrumbList" :key="breadcrumb.path">
        <el-breadcrumb-item v-if="!showHome ? breadcrumb.name !== HOME_NAME || route.name === HOME_NAME : true">
          <div
            v-if="breadcrumb.meta.notClickBread || index === breadcrumbList.length - 1"
            :class="[ns.e('link'), ns.no('click')]"
          >
            <Icon
              v-if="breadcrumb.meta?.icon && breadcrumbConfig.showIcon"
              :icon="breadcrumb.meta.icon"
              :class="ns.e('icon')"
            />
            <span>{{ breadcrumb.meta.title }}</span>
          </div>

          <router-link v-else :to="{ path: breadcrumb.meta._fullPath || breadcrumb.path }" :class="ns.e('link')">
            <Icon
              v-if="breadcrumb.meta?.icon && breadcrumbConfig.showIcon"
              :icon="breadcrumb.meta.icon"
              :class="ns.e('icon')"
            />
            <span>{{ breadcrumb.meta.title }}</span>
          </router-link>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
