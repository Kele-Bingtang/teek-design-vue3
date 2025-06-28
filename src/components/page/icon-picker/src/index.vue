<script lang="ts" setup>
import type { CSSProperties } from "vue";
import { computed, ref, watch, inject, nextTick } from "vue";
import { ElInput, ElPopover, ElScrollbar, ElTabs, ElTabPane, ElPagination } from "element-plus";
import { useNamespace } from "@/composables";
import { GlobalConfigKey } from "@/common/config";
import epIcons from "./data/icons.ep";
import antIcons from "./data/icons.ant-design";
import tIcons from "./data/icons.tdesign";

defineOptions({ name: "IconPicker" });

const ns = useNamespace("icon-picker");

defineProps<{ tip?: boolean }>();

const configGlobal = inject(GlobalConfigKey);

const init = async (icon?: string) => {
  if (!icon) return;
  const iconInfo = icon.split(":");
  iconName.value = iconInfo[0];
  const wrapIndex = icons.findIndex(item => item.prefix === iconInfo[0]);

  // 查询当前icon的索引
  const index = filterItemIcons(icons[wrapIndex]?.icons || []).findIndex(item => item === icon);
  // 计算当前icon的页码
  await nextTick();
  currentPage.value = Math.ceil((index + 1) / pageSize.value);
};

const modelValue = defineModel<string>();

const size = computed(() => configGlobal?.size.value || "default");

const iconSize = computed(() => {
  return size.value === "small"
    ? ns.cssVarEl("component-size-small")
    : size.value === "large"
      ? ns.cssVarEl("component-size-large")
      : ns.cssVarEl("component-size");
});

const iconWrapStyle = computed((): CSSProperties => {
  return {
    width: iconSize.value,
    height: iconSize.value,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 0 1px var(${ns.cssVarNameEl("input-border-color")},${ns.cssVarEl("border-color")}) inset`,
    position: "relative",
    left: "-1px",
    cursor: "pointer",
  };
});

const icons = [epIcons, antIcons, tIcons];

const iconName = ref(icons[0].prefix);

const currentIconNameIndex = computed(() => {
  return icons.findIndex(item => item.prefix === iconName.value);
});

const tabChange = () => {
  currentPage.value = 1;
};

const pageSize = ref(49);

const currentPage = ref(1);

const filterIcons = (icons: string[]) => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return icons.slice(start, end);
};

watch(
  () => modelValue.value,
  async val => {
    await nextTick();
    val && init(val);
  },
  {
    immediate: true,
  }
);

const popoverShow = () => {
  init(modelValue.value);
};

const iconSelect = (icon: string) => {
  // 如果是同一个 icon 则不做处理，则相当于点击了清空按钮
  if (icon === modelValue.value) {
    modelValue.value = "";
    return;
  }
  modelValue.value = icon;
};

const search = ref("");

const filterItemIcons = (icons: string[]) => {
  return icons.filter(item => item.includes(search.value));
};

const inputClear = () => {
  init(modelValue.value);
};
</script>

<template>
  <div :class="ns.b()">
    <el-input disabled v-model="modelValue" clearable v-bind="$attrs" />
    <ElPopover
      :popper-class="ns.b()"
      placement="bottom"
      trigger="click"
      :width="450"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; height: 380px;"
      @show="popoverShow"
    >
      <template #reference>
        <div :style="iconWrapStyle">
          <Icon v-if="modelValue" :icon="modelValue" />
        </div>
      </template>
      <el-scrollbar style="height: calc(100% - 50px)">
        <el-input v-model="search" clearable placeholder="搜索图标" @clear="inputClear" style="margin-bottom: 20px" />
        <ElTabs tab-position="left" v-model="iconName" @tab-change="tabChange">
          <ElTabPane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix">
            <div :class="ns.e('icons')">
              <div
                v-for="icon in filterIcons(filterItemIcons(item.icons))"
                :key="icon"
                :style="{
                  width: iconSize,
                  height: iconSize,
                  border: `1px solid ${icon === modelValue ? ns.cssVarEl('color-primary') : ns.cssVarEl('border-color')}`,
                }"
                :class="ns.e('icon')"
                @click="iconSelect(icon)"
                v-copy="tip ? modelValue : undefined"
              >
                <Icon :icon="icon" :color="icon === modelValue ? ns.cssVarEl('color-primary') : 'inherit'" />
              </div>
            </div>
          </ElTabPane>
        </ElTabs>
      </el-scrollbar>
      <div :class="ns.e('pagination')">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :pager-count="5"
          size="small"
          :page-sizes="[100, 200, 300, 400]"
          layout="total, prev, pager, next, jumper"
          :total="filterItemIcons(icons[currentIconNameIndex]?.icons || []).length"
        />
      </div>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
