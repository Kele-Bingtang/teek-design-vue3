<script lang="ts" setup>
import { computed, ref, watch, inject } from "vue";
import { ElInput, ElTabs, ElTabPane, ElPagination } from "element-plus";
import { ProDialog } from "@/components";
import { useNamespace } from "@/composables";
import { GlobalConfigKey } from "@/common/config";
import epIcons from "./data/icons.ep";
import antIcons from "./data/icons.ant-design";
import tIcons from "./data/icons.tdesign";
import { extractIconClasses } from "./iconfont";

defineOptions({ name: "IconPicker" });

interface IconPickerProps {
  copy?: boolean;
}

const props = withDefaults(defineProps<IconPickerProps>(), { copy: false });

const ns = useNamespace("icon-picker");

const emit = defineEmits<{ select: [icon: string] }>();

const iconfont = extractIconClasses();

// 图标库
const icons: { name: string; prefix: string; icons: any[] }[] = [
  epIcons,
  antIcons,
  tIcons,
  { name: "iconfont(unicode)", prefix: "iconfont(unicode)", icons: iconfont.map(item => item.unicode) },
  { name: "iconfont(class)", prefix: "iconfont(class)", icons: iconfont.map(item => item.className) },
];
// 当前选中的图标库
const iconName = ref(icons[0].prefix);

const currentPage = ref(1);
const pageSize = ref(100);
const search = ref("");
const dialogVisible = ref(false);

const modelValue = defineModel<string>({ default: "" });
// 当前选中的图标，当作备份来判断是父组件传入的图标名还是当前组件内选择的图标名
const selectedIcon = ref<string>("");

// 全局配置
const configGlobal = inject(GlobalConfigKey);

const size = computed(() => configGlobal?.size.value || "default");

// 当前选中的图标库索引
const currentIconNameIndex = computed(() => icons.findIndex(item => item.prefix === iconName.value));

const iconSize = computed(() => {
  return size.value === "small"
    ? ns.cssVarEl("component-size-small")
    : size.value === "large"
      ? ns.cssVarEl("component-size-large")
      : ns.cssVarEl("component-size");
});

watch(
  () => modelValue.value,
  val => {
    if (selectedIcon.value !== val) initCurrentPage(val);
  }
);

/**
 * 初始化当前页码
 */
const initCurrentPage = (icon?: string) => {
  if (!icon) return;

  const iconInfo = icon.split(":");
  iconName.value = iconInfo[0];
  const wrapIndex = icons.findIndex(item => item.prefix === iconInfo[0]);

  // 查询当前 icon 的索引
  const index = filterItemIcons(icons[wrapIndex]?.icons || []).findIndex(item => item === icon);
  // 计算当前 icon 的页码
  const num = Math.ceil((index + 1) / pageSize.value);
  currentPage.value = num > 1 ? num : 1;
};

/**
 * 获取当前页图标
 */
const getIconsByPage = (tabIcons: string[]) => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;

  return tabIcons.slice(start, end);
};

/**
 * 选择图标
 */
const iconSelect = (icon: string) => {
  // 如果选择同一个 icon，相当于点击了清空按钮
  if (icon === modelValue.value) {
    modelValue.value = "";
    selectedIcon.value = "";
    return;
  }
  modelValue.value = icon;
  selectedIcon.value = icon;

  // 选择图标后关闭弹窗
  dialogVisible.value = false;

  emit("select", modelValue.value);
};

/**
 * 过滤图标
 */
const filterItemIcons = (icons: string[]) => icons.filter(item => item.includes(search.value));

/**
 * 切换 tab 时，重置页码
 */
const tabChange = () => (currentPage.value = 1);

/**
 * 清空输入框时，重置当前页码
 */
const inputClear = () => initCurrentPage(modelValue.value);

/**
 * 全屏切换事件
 */
const fullscreenChange = (isFullscreen: boolean) => {
  pageSize.value = isFullscreen ? 400 : 100;
};
</script>

<template>
  <div :class="[ns.b(), 'flx-center']">
    <el-input v-model="modelValue" clearable v-bind="$attrs" @click="dialogVisible = true">
      <template #prepend><Icon :icon="modelValue" :size="20" /></template>
    </el-input>

    <ProDialog
      v-model="dialogVisible"
      title="图标选择"
      top="10vh"
      :show-footer="false"
      :height-offset-in-fullscreen="46"
      @fullscreen="fullscreenChange"
    >
      <el-input
        v-model="search"
        clearable
        placeholder="搜索图标（仅在激活的标签页有效）"
        @clear="inputClear"
        style="margin-bottom: 10px"
      />
      <el-tabs v-model="iconName" @tab-change="tabChange">
        <el-tab-pane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix">
          <div class="flx-wrap">
            <div
              v-for="icon in getIconsByPage(filterItemIcons(item.icons))"
              :key="icon"
              :style="{
                width: `calc(${iconSize} + 10px)`,
                height: `calc(${iconSize} + 10px)`,
                lineHeight: `calc(${iconSize} + 10px)`,
                border: `1px solid  ${ns.cssVarEl('border-color')}`,
                backgroundColor: `${icon === modelValue ? ns.cssVar('gray-200') : ''}`,
              }"
              :class="ns.e('icon')"
              @click="iconSelect(icon)"
              v-copy="props.copy ? modelValue : false"
            >
              <Icon :icon="icon" :size="20" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer-top>
        <el-pagination
          :class="ns.e('pagination')"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          background
          :page-sizes="[100, 200, 300, 400]"
          :total="filterItemIcons(icons[currentIconNameIndex]?.icons || []).length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </template>
    </ProDialog>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
