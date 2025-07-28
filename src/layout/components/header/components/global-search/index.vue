<script setup lang="ts">
import { ref, onMounted, nextTick, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useEventListener } from "@vueuse/core";
import { ArrowUp, ArrowDown, Back, Close } from "@element-plus/icons-vue";
import { isArray, mittBus } from "@/common/utils";
import { OpenSearchDialogKey } from "@/common/config";
import { useKeyDown, useMenu, useNamespace } from "@/composables";
import { formatTitle } from "@/router/helper";
import { useSettingStore, useUserStore } from "@/pinia";

import "./index.scss";

defineOptions({ name: "GlobalSearch" });

const router = useRouter();
const ns = useNamespace("global-search");
const userStore = useUserStore();
const settingStore = useSettingStore();
const { menuList } = useMenu();

const showSearchDialog = ref(false);
const isKeyboardNavigating = ref(false);
const searchVal = ref("");
const historyHIndex = ref(0);
const highlightedIndex = ref(0);

const historyMaxLength = 10;
const searchResult = ref<RouterConfig[]>([]);
const { searchHistory } = storeToRefs(userStore);
const { shortcutKey } = storeToRefs(settingStore);

const searchInputInstance = useTemplateRef("searchInputInstance");
const searchResultScrollbarInstance = useTemplateRef("searchResultScrollbarInstance");

const { start } = useKeyDown({
  watcher: computed(() => shortcutKey.value.search),
  // 快捷键 ALT + Q 退出登录
  callback: event => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey;
    if (isCommandKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      showSearchDialog.value = true;
      focusInput();
    }
  },
});
start();

/**
 * 打开对话框
 */
const openSearchDialog = () => {
  showSearchDialog.value = true;
  focusInput();
};

/**
 * 关闭对话框
 */
const closeSearchDialog = () => {
  searchVal.value = "";
  searchResult.value = [];
  highlightedIndex.value = 0;
  historyHIndex.value = 0;
};

/**
 * 键盘快捷键处理
 */
const handleKeydown = (event: KeyboardEvent) => {
  // 当搜索对话框打开时，处理方向键和回车键
  if (showSearchDialog.value) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightPrevious();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightNext();
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectHighlighted();
    } else if (event.key === "Escape") {
      event.preventDefault();
      showSearchDialog.value = false;
    }
  }
};

useEventListener("keydown", handleKeydown);

/**
 * 激活文本框
 */
const focusInput = () => {
  setTimeout(() => {
    searchInputInstance.value?.focus();
  }, 100);
};

const handleSearch = (val: string) => {
  if (val) searchResult.value = flattenAndFilterMenuItems(menuList.value, val);
  else searchResult.value = [];
};

/**
 * 筛选菜单项
 */
const flattenAndFilterMenuItems = (items: RouterConfig[], val: string) => {
  const lowerVal = val.toLowerCase();
  const result: RouterConfig[] = [];

  const flattenAndMatch = (item: RouterConfig) => {
    if (item.meta?.hideInMenu) return;

    const lowerItemTitle = formatTitle(item).toLowerCase();

    if (item.children && item.children.length > 0) {
      item.children.forEach(flattenAndMatch);
      return;
    }

    if (lowerItemTitle.includes(lowerVal) && item.path) {
      result.push({ ...item, children: undefined });
    }
  };

  items.forEach(flattenAndMatch);
  return result;
};

/**
 * 高亮控制并实现滚动条跟随
 */
const highlightPrevious = () => {
  isKeyboardNavigating.value = true;

  if (searchVal.value) {
    highlightedIndex.value = (highlightedIndex.value - 1 + searchResult.value.length) % searchResult.value.length;
    scrollToHighlightedItem();
  } else {
    historyHIndex.value = (historyHIndex.value - 1 + searchHistory.value.length) % searchHistory.value.length;
    scrollToHighlightedHistoryItem();
  }
  // 延迟重置键盘导航状态，防止立即被 hover 覆盖
  setTimeout(() => {
    isKeyboardNavigating.value = false;
  }, 100);
};

const highlightNext = () => {
  isKeyboardNavigating.value = true;

  if (searchVal.value) {
    highlightedIndex.value = (highlightedIndex.value + 1) % searchResult.value.length;
    scrollToHighlightedItem();
  } else {
    historyHIndex.value = (historyHIndex.value + 1) % searchHistory.value.length;
    scrollToHighlightedHistoryItem();
  }
  setTimeout(() => {
    isKeyboardNavigating.value = false;
  }, 100);
};

const scrollToHighlightedItem = async () => {
  await nextTick();

  if (!searchResultScrollbarInstance.value || !searchResult.value.length) return;

  const scrollWrapper = searchResultScrollbarInstance.value.wrapRef;
  if (!scrollWrapper) return;

  const highlightedElements = scrollWrapper.querySelectorAll(`.${ns.e("search-item")}`);
  if (!highlightedElements[highlightedIndex.value]) return;

  const highlightedElement = highlightedElements[highlightedIndex.value] as HTMLElement;
  const itemHeight = highlightedElement.offsetHeight;
  const scrollTop = scrollWrapper.scrollTop;
  const containerHeight = scrollWrapper.clientHeight;
  const itemTop = highlightedElement.offsetTop;
  const itemBottom = itemTop + itemHeight;

  if (itemTop < scrollTop) searchResultScrollbarInstance.value.setScrollTop(itemTop);
  else if (itemBottom > scrollTop + containerHeight) {
    searchResultScrollbarInstance.value.setScrollTop(itemBottom - containerHeight);
  }
};

const scrollToHighlightedHistoryItem = async () => {
  await nextTick();

  if (!searchResultScrollbarInstance.value || !searchHistory.value.length) return;

  const scrollWrapper = searchResultScrollbarInstance.value.wrapRef;
  if (!scrollWrapper) return;

  const historyItems = scrollWrapper.querySelectorAll(`.${ns.e("history-item")}`);
  if (!historyItems[historyHIndex.value]) return;

  const highlightedElement = historyItems[historyHIndex.value] as HTMLElement;
  const itemHeight = highlightedElement.offsetHeight;
  const scrollTop = scrollWrapper.scrollTop;
  const containerHeight = scrollWrapper.clientHeight;
  const itemTop = highlightedElement.offsetTop;
  const itemBottom = itemTop + itemHeight;

  if (itemTop < scrollTop) {
    searchResultScrollbarInstance.value.setScrollTop(itemTop);
  } else if (itemBottom > scrollTop + containerHeight) {
    searchResultScrollbarInstance.value.setScrollTop(itemBottom - containerHeight);
  }
};

const selectHighlighted = () => {
  if (searchVal.value && searchResult.value.length) {
    handleGoPage(searchResult.value[highlightedIndex.value]);
  } else if (!searchVal.value && searchHistory.value.length) {
    handleGoPage(searchHistory.value[historyHIndex.value]);
  }
};

const isHighlighted = (index: number) => {
  return highlightedIndex.value === index;
};

const handleSearchBlur = () => {
  highlightedIndex.value = 0;
};

/**
 * 修改 hover 高亮逻辑，只有在非键盘导航时才生效
 */
const highlightOnHover = (index: number) => {
  if (!isKeyboardNavigating.value && searchVal.value) {
    highlightedIndex.value = index;
  }
};

const highlightOnHoverHistory = (index: number) => {
  if (!isKeyboardNavigating.value && !searchVal.value) {
    historyHIndex.value = index;
  }
};

const handleGoPage = (item: RouterConfig) => {
  showSearchDialog.value = false;
  addHistory(item);

  if (item.name) router.push({ name: item.name });
  else router.push(item.meta._fullPath);

  searchVal.value = "";
  searchResult.value = [];
};

// 历史记录管理
const updateHistory = () => {
  if (isArray(searchHistory.value)) userStore.setSearchHistory(searchHistory.value);
};

const addHistory = (item: RouterConfig) => {
  const hasItemIndex = searchHistory.value.findIndex(historyItem => historyItem.path === item.path);

  if (hasItemIndex !== -1) {
    searchHistory.value.splice(hasItemIndex, 1);
  } else if (searchHistory.value.length >= historyMaxLength) {
    searchHistory.value.pop();
  }

  const cleanedItem = { ...item };
  delete cleanedItem.children;
  delete cleanedItem.meta.auths;
  searchHistory.value.unshift(cleanedItem);
  updateHistory();
};

const deleteHistory = (index: number) => {
  searchHistory.value.splice(index, 1);
  updateHistory();
};

onMounted(() => {
  mittBus.on(OpenSearchDialogKey, openSearchDialog);
});
</script>

<template>
  <div :class="ns.b()">
    <el-dialog
      v-model="showSearchDialog"
      width="600"
      :show-close="false"
      :lock-scroll="false"
      modal-class="search-modal"
      @close="closeSearchDialog"
    >
      <el-input
        ref="searchInputInstance"
        v-model="searchVal"
        :placeholder="$t('_search.placeholder')"
        @input="handleSearch"
        @blur="handleSearchBlur"
      >
        <template #prefix>
          <Icon icon="core-search" :size="17" />
        </template>
        <template #suffix>
          <div class="search-keydown">
            <span>ESC</span>
          </div>
        </template>
      </el-input>

      <el-scrollbar ref="searchResultScrollbarInstance" :class="ns.e('search-scrollbar')" :max-height="380">
        <ul :class="ns.e('search-list')" v-show="searchResult.length">
          <li :class="ns.e('search-item')" v-for="(item, index) in searchResult" :key="index">
            <div
              :class="ns.is('highlighted', isHighlighted(index))"
              @click="handleGoPage(item)"
              @mouseenter="highlightOnHover(index)"
            >
              {{ formatTitle(item) }}
              <Icon class="selected-icon" v-show="isHighlighted(index)"><Back /></Icon>
            </div>
          </li>
        </ul>

        <div
          :class="ns.e('search-history')"
          v-show="!searchVal && searchResult.length === 0 && searchHistory.length > 0"
        >
          <p class="title">{{ $t("_search.historyTitle") }}</p>
          <ul :class="ns.e('history-list')">
            <li
              :class="[ns.e('history-item'), ns.is('highlighted', historyHIndex === index)]"
              v-for="(item, index) in searchHistory"
              :key="index"
              @click="handleGoPage(item)"
              @mouseenter="highlightOnHoverHistory(index)"
            >
              {{ formatTitle(item) }}
              <Icon class="selected-icon" @click.stop="deleteHistory(index)"><Close /></Icon>
            </li>
          </ul>
        </div>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <div>
            <Icon><ArrowUp /></Icon>
            <Icon><ArrowDown /></Icon>
            <span>{{ $t("_search.switchKeydown") }}</span>
          </div>
          <div>
            <Icon><Back /></Icon>
            <span>{{ $t("_search.selectKeydown") }}</span>
          </div>
          <div>
            <i>esc</i>
            <span>{{ $t("_search.closeKeyDown") }}</span>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
