<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMenuItem, ElSubMenu } from "element-plus";
import { isValidURL } from "@/common/utils";
import { Tooltip, PointTag } from "@/components";
import { useNamespace, useCommon } from "@/composables";
import { formatTitle } from "@/router/helper";
import { useLayoutStore, useSettingStore } from "@/pinia";

defineOptions({ name: "AsideMenuItem" });

defineProps<{ menuItem: RouterConfig }>();

const ns = useNamespace();
const router = useRouter();
const layoutStore = useLayoutStore();
const settingStore = useSettingStore();
const { isMobile } = useCommon();

// 是否切换多语言
const isSwitchLanguage = ref(false);

/**
 * 菜单点击事件，跳转页面
 */
const handleMenuClick = (menuItem: RouterConfig) => {
  // 移动端点击菜单时关闭菜单
  if (isMobile.value) settingStore.closeSideMenu();

  if (isValidURL(menuItem.path)) return window.open(menuItem.path, "_blank");
  router.push(menuItem.meta._fullPath || menuItem.path || "");
};

/**
 * 获取菜单标题
 */
const title = (menuItem: RouterConfig) => {
  const title = formatTitle(menuItem, isSwitchLanguage.value);
  menuItem.meta.title = title;
  return title;
};

/**
 * 监听多语言切换
 */
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
    <component :is="menuItem.meta.render" :class="`${ns.elNamespace}-menu-item`" class="is-only" />
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
      <Tooltip v-else :offset="-10" :try="1">
        <span>{{ title(menuItem) }}</span>
      </Tooltip>
      <el-tag
        v-if="menuItem.meta.tagText && !settingStore.isCollapse"
        size="small"
        type="danger"
        effect="dark"
        v-bind="menuItem.meta.tagProps"
        class="menu-item-tag"
      >
        {{ menuItem.meta.tagText }}
      </el-tag>
      <PointTag
        v-if="menuItem.meta.pointTag && !settingStore.isCollapse"
        theme="danger"
        v-bind="menuItem.meta.pointTagProps"
        class="menu-item-tag point-tag"
      />
    </template>
  </el-menu-item>

  <el-sub-menu v-else :index="menuItem.meta._fullPath || menuItem.path" class="is-sub">
    <template #title>
      <Icon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" :class="`${ns.elNamespace}-icon`" />
      <span v-if="!menuItem.meta.useTooltip">{{ title(menuItem) }}</span>
      <Tooltip v-else :offset="-10" :try="1">
        <span>{{ title(menuItem) }}</span>
      </Tooltip>
      <el-tag
        v-if="menuItem.meta.tagText && !settingStore.isCollapse"
        size="small"
        type="danger"
        effect="dark"
        v-bind="menuItem.meta.tagProps"
        class="menu-item-tag"
      >
        {{ menuItem.meta.tagText }}
      </el-tag>
      <PointTag
        v-if="menuItem.meta.pointTag && !settingStore.isCollapse"
        theme="danger"
        v-bind="menuItem.meta.pointTagProps"
        class="menu-item-tag point-tag"
      />
    </template>

    <template v-if="menuItem.children">
      <MenuItem v-for="child in menuItem.children" :key="child.path" :menu-item="child" :class="ns.is('child')" />
    </template>
  </el-sub-menu>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include joins(icon) {
  width: cssVarEl(menu-icon-width);
  margin-right: 5px;
  font-size: 18px;
  vertical-align: middle;
  text-align: center;
}

.menu-item-tag {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
}

.is-sub > .#{$el-namespace}-sub-menu__title {
  .menu-item-tag {
    right: 38px;
  }
}
</style>
