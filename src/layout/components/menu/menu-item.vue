<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMenuItem, ElSubMenu } from "element-plus";
import { isValidURL } from "@/common/utils";
import { useNamespace } from "@/composables";
import { Tooltip } from "@/components";
import { useLayoutStore } from "@/pinia";
import SystemConfig from "@/common/config";
import { formatTitle } from "@/router/helper";

defineOptions({ name: "AsideMenuItem" });

defineProps<{ menuItem: RouterConfig }>();

const ns = useNamespace();
const router = useRouter();
const layoutStore = useLayoutStore();

const isSwitchLanguage = ref(false);

const handleMenuClick = (menuItem: RouterConfig) => {
  if (isValidURL(menuItem.path)) return window.open(menuItem.path, "_blank");
  router.push(menuItem.meta._fullPath || menuItem.path || "");
};

const title = (menuItem: RouterConfig) => {
  const title = formatTitle(menuItem, isSwitchLanguage.value);
  menuItem.meta.title = title;
  return title;
};

watch(
  () => layoutStore.language,
  async () => {
    isSwitchLanguage.value = true;
    await nextTick();
    isSwitchLanguage.value = false;
  }
);
</script>

<template>
  <template v-if="menuItem.meta.render">
    <component :is="menuItem.meta.render" :class="[`${ns.elNamespace}-menu-item`, 'is-only']" />
  </template>

  <el-menu-item
    v-else-if="!menuItem.children || menuItem.children.length == 0"
    :index="menuItem.meta._fullPath"
    @click="handleMenuClick(menuItem)"
    class="is-only"
  >
    <Icon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" :class="`${ns.elNamespace}-icon`" />
    <template #title>
      <span v-if="!menuItem.meta.useTooltip">{{ title(menuItem) }}</span>
      <Tooltip v-else :effect="SystemConfig.layoutConfig.tooltipEffect" :offset="-10" :try="1">
        <span>{{ title(menuItem) }}</span>
      </Tooltip>
    </template>
  </el-menu-item>

  <el-sub-menu v-else :index="menuItem.meta._fullPath || menuItem.path" class="is-sub">
    <template #title>
      <Icon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" :class="`${ns.elNamespace}-icon`" />
      <span v-if="!menuItem.meta.useTooltip">{{ title(menuItem) }}</span>
      <Tooltip v-else :effect="SystemConfig.layoutConfig.tooltipEffect" :offset="-10" :try="1">
        <span>{{ title(menuItem) }}</span>
      </Tooltip>
    </template>

    <template v-if="menuItem.children">
      <MenuItem v-for="child in menuItem.children" :key="child.path" :menu-item="child" />
    </template>
  </el-sub-menu>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include joins(icon) {
  width: var(--#{$el-namespace}-menu-icon-width);
  margin-right: 5px;
  font-size: 18px;
  vertical-align: middle;
  text-align: center;
}
</style>
