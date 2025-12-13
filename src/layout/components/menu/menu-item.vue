<script setup lang="ts">
import { useRouter } from "vue-router";
import { ElMenuItem, ElSubMenu } from "element-plus";
import { isValidURL } from "@/common/utils";
import { Tooltip, PointTag } from "@/components";
import { useNamespace, useCommon } from "@/composables";
import { useSettingStore } from "@/pinia";
import { LayoutModeEnum } from "@/common/enums";

defineOptions({ name: "AsideMenuItem" });

defineProps<{ menuItem: RouterConfig }>();

const ns = useNamespace();
const router = useRouter();
const settingStore = useSettingStore();
const { isMobile, getTitle } = useCommon();

const { menu, layout } = storeToRefs(settingStore);

const showTag = computed(() => layout.value.layoutMode === LayoutModeEnum.Mixins || !menu.value.collapsed);

/**
 * 菜单点击事件，跳转页面
 */
const handleMenuClick = (menuItem: RouterConfig) => {
  // 移动端点击菜单时关闭菜单
  if (isMobile.value) settingStore.collapseSideMenu();

  if (isValidURL(menuItem.path)) return window.open(menuItem.path, "_blank");
  router.push(menuItem.meta._fullPath || menuItem.path || "");
};
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
      <span v-if="!menuItem.meta.useTooltip">{{ getTitle(menuItem) }}</span>
      <Tooltip v-else :offset="-10" :try="1">
        <span>{{ getTitle(menuItem) }}</span>
      </Tooltip>
      <el-tag
        v-if="menuItem.meta.tagText && showTag"
        size="small"
        type="danger"
        effect="dark"
        v-bind="menuItem.meta.tagProps"
        class="menu-item-tag"
      >
        {{ menuItem.meta.tagText }}
      </el-tag>
      <PointTag
        v-if="menuItem.meta.pointTag && showTag"
        type="danger"
        v-bind="menuItem.meta.pointTagProps"
        class="menu-item-tag point-tag"
      />
    </template>
  </el-menu-item>

  <el-sub-menu v-else :index="menuItem.meta._fullPath || menuItem.path" class="is-sub">
    <template #title>
      <Icon v-if="menuItem.meta.icon" :icon="menuItem.meta.icon" :class="`${ns.elNamespace}-icon`" />
      <span v-if="!menuItem.meta.useTooltip">{{ getTitle(menuItem) }}</span>
      <Tooltip v-else :offset="-10" :try="1">
        <span>{{ getTitle(menuItem) }}</span>
      </Tooltip>
      <el-tag
        v-if="menuItem.meta.tagText && !menu.collapsed"
        size="small"
        type="danger"
        effect="dark"
        v-bind="menuItem.meta.tagProps"
        class="menu-item-tag"
      >
        {{ menuItem.meta.tagText }}
      </el-tag>
      <PointTag
        v-if="menuItem.meta.pointTag && !menu.collapsed"
        type="danger"
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
@use "@styles/mixins/function" as *;

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
