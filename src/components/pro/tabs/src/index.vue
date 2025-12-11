<script setup lang="ts">
import type { TabPaneInstance, TabsInstance } from "element-plus";
import type { ProTabsProps, TabColumn } from "./types";
import { computed, shallowRef, toValue, unref, useTemplateRef } from "vue";
import { useNamespace } from "@/composables";
import { getProp, setProp } from "@/components/pro/helper";

const ns = useNamespace("pro-tabs");

defineOptions({ name: "ProTabs" });

const props = withDefaults(defineProps<ProTabsProps>(), {
  columns: () => [],
  card: false,
});

// 存储 ElTabs 实例
const elTabsInstance = useTemplateRef<TabsInstance>("elTabsInstance");
// 存储 ElTabPane 实例
const tabPaneInstances = shallowRef<Record<string, TabPaneInstance>>({});

const availableColumns = computed(() => props.columns.filter(column => !toValue(column.hidden)) || []);

const prop = (column: TabColumn) => (column.name || column.prop || "") as string;

// 设置 TabPane 的实例
const setTabPaneInstance = (el: any, prop: string) => {
  if (el) setProp(tabPaneInstances.value, prop, el);
};

const expose = {
  elTabsInstance,
  getTabPaneInstances: () => tabPaneInstances.value,
  getTabPaneInstance: (prop: string) => getProp(tabPaneInstances.value, prop) as TabPaneInstance | undefined,
};

defineExpose(expose);
</script>

<template>
  <el-tabs
    v-if="availableColumns.length"
    ref="elTabsInstance"
    :modelValue="prop(availableColumns[0])"
    v-bind="$attrs"
    :class="[ns.b(), { [ns.join('card-minimal')]: card }]"
  >
    <template v-for="column in availableColumns" :key="prop(column)">
      <el-tab-pane :ref="el => setTabPaneInstance(el, prop(column))" v-bind="column" :name="prop(column)">
        <template #default>
          <!-- 自定义 Render 函数渲染 -->
          <component
            v-show="!toValue(column.hidden)"
            v-if="column.render"
            :is="column.render()"
            v-bind="{ ...column.elProps }"
          />
          <!-- 自定义内容插槽，插槽名为 column.prop || column.name -->
          <slot v-else-if="$slots[prop(column)]" :name="prop(column)" />

          <component
            v-show="!toValue(column.hidden)"
            v-else-if="column.el"
            :is="column.el"
            v-bind="unref(column.elProps)"
          >
            <template v-for="(slot, key) in column.elSlots" :key="key" #[key]="data">
              <component :is="slot" v-bind="{ ...data }" />
            </template>
          </component>
        </template>

        <template #label>
          <!-- 自定义 Render 函数渲染 -->
          <component v-if="column.renderLabel" :is="column.renderLabel()" />
          <!-- 自定义 label 插槽 ，插槽名为 {column.prop}-label || {column.name}-label -->
          <slot v-else-if="$slots[`${prop(column)}-label`]" :name="`${prop(column)}-label`" />

          <template v-else>{{ column.label }}</template>
        </template>
      </el-tab-pane>
    </template>

    <template #add-icon><slot name="add-icon" /></template>
  </el-tabs>
</template>
