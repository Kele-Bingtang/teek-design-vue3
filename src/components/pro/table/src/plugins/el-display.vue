<script setup lang="ts">
import type { ElDisplayProps } from "../types";
import type { ElRenderParams, TableComponentEnum } from "../helper";
import { unref, computed, toValue } from "vue";
import { isFunction } from "@/common/utils";
import { toCamelCase } from "@/components/pro/helper";
import { tableElComponentsMap } from "../helper";

import "../styles/el-display.scss";

defineOptions({ name: "ElDisplay" });

const props = withDefaults(defineProps<ElDisplayProps>(), {
  displayValue: undefined,
  originValue: undefined,
  el: undefined,
  elProps: () => ({}),
  options: () => [],
  optionField: () => ({ label: "label", value: "value", children: "children", disabled: "disabled" }),
});

const elRenderParams = computed<ElRenderParams>(() => {
  const { originValue, displayValue, options, optionField } = props;

  return {
    originValue,
    displayValue,
    formatValue: formatValue.value,
    props: {}, // 使用时再传入
    options,
    optionField,
  };
});

// 获取 EL 组件信息
const componentInfo = computed(() => tableElComponentsMap[toCamelCase(toValue(props.el)) as TableComponentEnum]);

// 解析传来的 elProps
const elPropsValue = computed(() =>
  isFunction(props.elProps) ? props.elProps(props.originValue) : unref(props.elProps)
);

// 获取 EL 组件最终需要的 Props
const finalElProps = computed(() => {
  const componentInfoValue = componentInfo.value || {};
  let defaultProps: Recordable = {};

  if ("is" in componentInfoValue || "renderEl" in componentInfoValue) {
    defaultProps = isFunction(componentInfoValue.props)
      ? componentInfoValue.props({ ...elRenderParams.value, props: elPropsValue.value })
      : componentInfoValue.props;
  }

  return { ...defaultProps, ...elPropsValue.value };
});

// 获取格式化后的值
const formatValue = computed(() => {
  const { displayValue } = props;
  const componentInfoValue = componentInfo.value || {};

  if ("format" in componentInfoValue) return componentInfoValue.format?.(displayValue, finalElProps.value);
  return displayValue;
});

// 获取 EL 组件
const elComponent = computed(() => {
  const componentInfoValue = componentInfo.value || {};

  if ("renderEl" in componentInfoValue) {
    return componentInfoValue.renderEl?.({ ...elRenderParams.value, props: finalElProps.value });
  }
  if ("is" in componentInfoValue) return componentInfoValue.is;

  return componentInfoValue;
});

// 是否隐藏当前单元格
const isHidden = computed(() => {
  const { displayValue } = props;
  const componentInfoValue = componentInfo.value || {};

  if ("hidden" in componentInfoValue) return componentInfoValue.hidden?.(displayValue, finalElProps.value);

  return false;
});
</script>

<template>
  <!-- renderEl 函数渲染 -->
  <component v-if="'renderEl' in (componentInfo || {}) && !isHidden" :is="elComponent" v-bind="finalElProps" />

  <!-- is 传的组件支持插槽 -->
  <component v-else-if="componentInfo && !isHidden" :is="elComponent" v-bind="finalElProps">
    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
      <slot :name="slot" v-bind="{ ...scope, ...finalElProps }" />
    </template>

    <slot name="value" v-bind="finalElProps" :value="formatValue">{{ formatValue }}</slot>
  </component>

  <template v-else>
    <slot name="value" v-bind="finalElProps" :value="formatValue">{{ formatValue }}</slot>
  </template>
</template>
