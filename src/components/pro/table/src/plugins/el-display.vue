<script setup lang="ts">
import type { ElDisplayProps } from "../types";
import type { ComponentNameEnum } from "../helper";
import { toValue } from "vue";
import { toCamelCase } from "@/components/pro/helper";
import { isFunction } from "@/utils";
import { componentsMap } from "../helper";

import "../styles/el-display.scss";

defineOptions({ name: "ElDisplay" });

const props = withDefaults(defineProps<ElDisplayProps>(), {
  el: undefined,
  elProps: () => ({}),
  value: undefined,
});

// 获取 EL 组件信息
const componentInfo = computed(() => componentsMap[toCamelCase(props.el) as ComponentNameEnum]);

// 解析传来的 elProps
const elPropsValue = computed(() => toValue(props.elProps));

// 获取格式化后的值
const formatValue = computed(() => {
  const { value } = props;
  const componentInfoValue = componentInfo.value || {};

  if ("format" in componentInfoValue) return componentInfoValue.format?.(value, elPropsValue.value);
  return value;
});

// 获取 EL 组件
const elComponent = computed(() => {
  const { value } = props;
  const componentInfoValue = componentInfo.value || {};

  if ("renderEl" in componentInfoValue) return componentInfoValue.renderEl?.(value, elPropsValue, formatValue.value);
  if ("is" in componentInfoValue) return componentInfoValue.is;

  return componentInfoValue;
});

// 获取 EL 组件最终需要的 Props
const finalElProps = computed(() => {
  const { value } = props;
  const componentInfoValue = componentInfo.value || {};
  let defaultProps: Recordable = {};

  if ("is" in componentInfoValue || "renderEl" in componentInfoValue) {
    defaultProps = isFunction(componentInfoValue.props)
      ? componentInfoValue.props(value, formatValue.value)
      : componentInfoValue.props;
  }
  return { ...defaultProps, ...elPropsValue.value };
});
</script>

<template>
  <!-- renderEl 函数渲染 -->
  <component v-if="'renderEl' in (componentInfo || {})" :is="elComponent" v-bind="finalElProps" />

  <!-- is 传的组件支持插槽 -->
  <component v-else-if="componentInfo" :is="elComponent" v-bind="finalElProps">
    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
      <slot :name="slot" v-bind="{ ...scope, ...finalElProps }" />
    </template>

    <slot name="value" v-bind="finalElProps" :value="formatValue">{{ formatValue }}</slot>
  </component>

  <template v-else>
    <slot name="value" v-bind="finalElProps" :value="formatValue">{{ formatValue }}</slot>
  </template>
</template>
