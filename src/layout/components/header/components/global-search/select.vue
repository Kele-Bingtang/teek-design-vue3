<script setup lang="ts">
import { computed, ref, onUnmounted, nextTick } from "vue";
import { ElAutocomplete, ElTooltip } from "element-plus";
import { useRouteStore } from "@/pinia";
import { useDebounceFn } from "@vueuse/core";
import { isFunction } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useRouter, type RouteLocationNormalizedLoaded } from "vue-router";
import { formatTitle } from "@/router/helper";

defineOptions({ name: "MenuSearch" });

const ns = useNamespace("menu-search");

const router = useRouter();
const routeStore = useRouteStore();
const nestMode = ref(true);
const menuList = computed(() =>
  nestMode.value
    ? createNestMenuSearchList(routeStore.loadedRouteList)
    : routeStore.flatRouteList.filter(item => !item.meta.hideInMenu)
);

const handleSearchMenuList = (queryString: string, callback: (result: any) => void) => {
  const results = queryString ? menuList.value.filter(filterNodeMethod(queryString) as () => boolean) : menuList.value;
  callback(results);
};

const isShowSearch = ref(false);
const autocompleteInstance = useTemplateRef("autocompleteInstance");
const searchMenu = ref("");

// 关闭搜索菜单
const handleCloseSearch = () => {
  isShowSearch.value = false;
  document.body.removeEventListener("click", handleCloseSearch);
  autocompleteInstance.value && autocompleteInstance.value.blur();
};

// 打开搜索菜单
const handleStartSearch = () => {
  isShowSearch.value = true;
  searchMenu.value = "";
  // 工具实现防抖
  useDebounceFn(() => {
    autocompleteInstance.value && autocompleteInstance.value.focus();
    document.body.addEventListener("click", handleCloseSearch);
  }, 250)();
};

const handleSwitchMode = () => {
  nestMode.value = !nestMode.value;
  if (autocompleteInstance.value) {
    autocompleteInstance.value.close();
    nextTick(() => {
      setTimeout(() => {
        autocompleteInstance.value?.focus();
      }, 800);
    });
  }
};

// 筛选菜单
const filterNodeMethod = (queryString: string) => {
  return (restaurant: RouteLocationNormalizedLoaded) => {
    return (
      restaurant.meta._fullPath.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
      formatTitle(restaurant)?.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    );
  };
};

// 点击菜单跳转
const handleClickMenu = (menuItem: Recordable) => {
  searchMenu.value = "";
  if (menuItem.meta.isLink) window.open(menuItem.meta.isLink, "_blank");
  else router.push(menuItem.meta._fullPath);
  handleCloseSearch();
};

/**
 * 生成层级下的所有 title 合在一起的菜单数组
 * @param menuList 嵌套菜单列表
 */
const createNestMenuSearchList = (menuList: RouterConfig[]) => {
  const res: (RouterConfigRaw & { title: string[] })[] = [];
  menuList.forEach(menu => {
    if (menu.meta.hideInMenu) return res;
    const item = { ...menu, title: [formatTitle(menu)] };
    if (item.children && item.children.length) {
      const menuListChild = createNestMenuSearchList(item.children);
      menuListChild.forEach(child => {
        const c = { ...child };
        c.title = [...item.title, ...child.title] as string[];
        res.push(c);
      });
    } else {
      res.push(item);
    }
  });
  return res;
};

onUnmounted(() => {
  document.body.removeEventListener("click", handleCloseSearch);
});
</script>

<template>
  <div :class="[ns.b(), ns.is('show', isShowSearch)]">
    <Icon v-if="!isShowSearch" icon="core-search" @click.stop="handleStartSearch" />

    <el-autocomplete
      v-model="searchMenu"
      ref="autocompleteInstance"
      placeholder="支持菜单名称、路径"
      :fetch-suggestions="handleSearchMenuList"
      @select="handleClickMenu"
      @click.stop
    >
      <template #prefix>
        <el-tooltip effect="dark" content="切换查询模式" placement="left" :show-after="100">
          <Icon
            :class="ns.e('icon')"
            icon="search"
            pointer
            hover
            :hover-color="ns.cssVar('color-primary')"
            @click.stop="handleSwitchMode"
          />
        </el-tooltip>
      </template>

      <template #default="{ item }">
        <template v-if="!isFunction(item.meta.title)">
          <Icon class="icon" :icon="item.meta.icon" />
          <span>{{ nestMode ? item.title.join(" > ") : item.meta.title }}</span>
        </template>
      </template>
    </el-autocomplete>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(menu-search) {
  @include is(show) {
    width: 220px !important;
    background-color: transparent !important;
  }

  @include is(show, false) {
    :deep(.#{$el-namespace}-autocomplete) {
      width: 0;
      transition: width cssVar(transition-duration);

      @include el-joins(input__wrapper) {
        width: 0;
        padding: 0;
      }

      @include el-joins(input__prefix) {
        display: none;
      }
    }
  }
}

@include el-joins(autocomplete__popper) {
  .icon {
    position: relative;
    top: 2px;
    font-size: 16px;
  }

  span {
    margin: 0 0 0 10px;
    font-size: 14px;
  }
}
</style>
