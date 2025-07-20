<script setup lang="ts">
import type { BreakPoint, GridInstance } from "@/components/pro/grid";
import type { FormItemColumnProps, ModelBaseValueType } from "@/components/pro/form-item";
import type { ProSearchColumnProps, ProSearchEmits, ProSearchProps } from "./types";
import { computed, onMounted, useTemplateRef } from "vue";
import { ElButton, ElIcon } from "element-plus";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { filterEmpty } from "@/components/pro/helper";
import { ProForm, useProFormFn } from "@/components/pro/form";
import { ProFormItem } from "@/components/pro/form-item";
import { Grid, GridItem } from "@/components/pro/grid";
import { useNamespace } from "@/composables";
import { useSearchApi } from "./composables/use-search-api";

defineOptions({ name: "ProSearch" });

const ns = useNamespace("pro-search");

const props = withDefaults(defineProps<ProSearchProps>(), {
  columns: () => [],
  position: "right",
  showAction: true,
  showSearch: true,
  showReset: true,
  showCollapse: true,
  searchText: "搜索",
  resetText: "重置",
  collapseText: "折叠",
  expandText: "展开",
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  gap: () => [20, 0],
  collapse: true,
  showRow: 1,
  searchLoading: false,
  resetLoading: false,
  removeNoValue: true,
  validate: true,
  showLabel: true,
  form: () => ({}),
});

const emits = defineEmits<ProSearchEmits>();

// 搜索参数
const model = defineModel<Recordable>({ default: () => ({}) });
// Grid 组件实例
const gridInstance = useTemplateRef<GridInstance>("gridInstance");
// 获取响应式断点
const breakPoint = computed<BreakPoint>(() => gridInstance.value?.breakPoint || "xl");

const finalProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const { mergeProps, setValues, setProps, setColumn, addColumn, delColumn } = useSearchApi(model, finalProps);

const {
  proFormInstance,
  getOptionsMap,
  submitForm,
  resetForm,
  getProFormInstance,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
} = useProFormFn("proFormInstance");

// 搜索表单的配置项
const searchColumns = computed(() =>
  finalProps.value.columns
    .filter((column, index) => {
      // 设置表单排序默认值
      column.order ??= index + 5;
      return !(getProFormInstance()?.destroyOrInit(column) ?? column.destroy);
    })
    .sort((a, b) => a.order! - b.order!)
    .map((column, index) => {
      // index 决定了表单的排序，因此现在上面进行排序
      column._index = index;
      column.width ??= "100%";

      // 如果不开启校验，则清空校验规则
      if (!finalProps.value.validate) {
        column.formItemProps = { ...column.formItemProps, rules: undefined, required: undefined };
      }

      return column;
    })
);

const rowSpan = computed(() => {
  const { searchCols } = finalProps.value;
  if (typeof searchCols === "number") return searchCols;
  return searchCols[breakPoint.value];
});

// 判断是否显示 展开/折叠 按钮
const showCollapseButton = computed(() => {
  const { searchCols } = finalProps.value;

  let show = false;
  searchColumns.value.reduce((prev, current) => {
    prev +=
      ((current.grid && current.grid[breakPoint.value]?.span) ?? current.grid?.span ?? 1) +
      ((current.grid && current.grid[breakPoint.value]?.offset) ?? current.grid?.offset ?? 0);

    if (typeof searchCols !== "number") {
      if (prev >= searchCols[breakPoint.value]) show = true;
    } else if (prev >= searchCols) show = true;
    return prev;
  }, 0);
  return show;
});

const isRightPosition = computed(() => {
  const { position } = finalProps.value;
  return position === "right";
});

const isBlockPosition = computed(() => {
  const { position = "right" } = finalProps.value;
  return ["block-left", "block-center", "block-right"].includes(position);
});

const actionStyle = computed(() => {
  const { position = "right" } = finalProps.value;
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "18px",
  };

  if (["block-left", "left"].includes(position)) return { ...style, justifyContent: "flex-start" };
  if (["block-center"].includes(position)) return { ...style, justifyContent: "center" };
  if (["block-right", "right"].includes(position)) return { ...style, justifyContent: "flex-end" };
  return style;
});

/**
 * 获取响应式设置
 */
const getResponsive = (item: ProSearchColumnProps) => {
  const { grid = {} } = item;
  return {
    span: grid.span,
    offset: grid.offset ?? 0,
    xs: grid.xs,
    sm: grid.sm,
    md: grid.md,
    lg: grid.lg,
    xl: grid.xl,
  };
};

/**
 * 点击搜索按钮事件
 */
const search = async () => {
  const isValid = await submitForm();
  if (isValid) {
    emits("search", finalProps.value.removeNoValue ? filterEmpty(model.value) : model.value);
  }
};

/**
 * 点击重置按钮事件
 */
const reset = async () => {
  await resetForm();
  emits("reset", finalProps.value.removeNoValue ? filterEmpty(model.value) : model.value);
};

const handleChange = (value: unknown, model: ModelBaseValueType, column: FormItemColumnProps) => {
  emits("change", value, model as Recordable, column);
};

/**
 * 折叠或展开搜索项
 *
 * @param isCollapse 是否折叠，如果不传，则根据情况取反操作
 */
const toggleCollapse = (isCollapse?: boolean) => {
  const { collapse } = finalProps.value;

  if (isCollapse === undefined) return setProps({ collapse: !collapse });
  return setProps({ collapse: isCollapse });
};

onMounted(() => {
  // 注册实例
  emits("register", proFormInstance.value?.$parent);
});

const defaultExpose = {
  model,
  toggleCollapse,
  setProps,
  setColumn,
  setValues,
  delColumn,
  addColumn,
  search,
  reset,

  proFormInstance,
  getOptionsMap,
  getProFormInstance,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(defaultExpose);
</script>

<template>
  <div v-if="searchColumns.length" :class="[ns.b(), ns.join('card-minimal')]">
    <ProForm ref="proFormInstance" v-model="model" v-bind="$attrs" :show-footer="false">
      <template #form-main="{ isHidden, setProFormItemInstance, optionsMap }">
        <Grid
          ref="gridInstance"
          :collapse="finalProps.showCollapse && finalProps.collapse"
          :cols="finalProps.searchCols"
          :gap="finalProps.gap"
          :show-row="rowSpan === 1 ? finalProps.showRow + 1 : finalProps.showRow"
        >
          <GridItem
            v-for="column in searchColumns"
            :key="column.prop"
            v-bind="getResponsive(column)"
            :index="column._index"
          >
            <ProFormItem
              v-show="!isHidden(column)"
              :ref="el => setProFormItemInstance(el, column.prop)"
              v-model="model"
              v-bind="column"
              :clearable="column.clearable ?? form.clearable"
              :show-label="column.showLabel ?? showLabel ?? form.showLabel"
              :width="column.width ?? form.width"
              :options="optionsMap.get(column.optionsProp || column.prop)"
              @change="handleChange"
            >
              <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                <slot :name="slot" v-bind="scope" />
              </template>
            </ProFormItem>
          </GridItem>

          <!-- 右侧按钮组 -->
          <GridItem :suffix="isRightPosition" :span="isBlockPosition ? rowSpan : 1">
            <div :style="actionStyle">
              <slot
                name="action"
                :model="model"
                :search="search"
                :reset="reset"
                :collapse="collapse"
                :show-collapse-button="finalProps.showCollapse && showCollapseButton"
                :toggle-collapse="toggleCollapse"
              >
                <el-button
                  v-if="finalProps.showSearch"
                  type="primary"
                  :icon="Search"
                  @click="search"
                  :loading="finalProps.searchLoading"
                >
                  {{ finalProps.searchText }}
                </el-button>

                <el-button v-if="finalProps.showReset" :icon="Delete" @click="reset" :loading="finalProps.resetLoading">
                  {{ finalProps.resetText }}
                </el-button>

                <el-button
                  v-if="finalProps.showCollapse && showCollapseButton"
                  type="primary"
                  link
                  class="search-isOpen"
                  @click="toggleCollapse()"
                >
                  {{ finalProps.collapse ? finalProps.expandText : finalProps.collapseText }}
                  <el-icon class="el-icon--right">
                    <component :is="finalProps.collapse ? ArrowDown : ArrowUp" />
                  </el-icon>
                </el-button>
              </slot>
            </div>
          </GridItem>
        </Grid>
      </template>
    </ProForm>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
