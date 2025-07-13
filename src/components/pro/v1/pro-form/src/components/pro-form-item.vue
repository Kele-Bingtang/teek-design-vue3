<script setup lang="tsx">
import type { Component, defineComponent } from "vue";
import { computed, inject, ref, resolveComponent } from "vue";
import { ComponentNameEnum, formEnumMapKey, type FormSchemaProps, type PascalCaseComponentName } from "../interface";
import Tree from "./tree.vue";
import { getProp, hyphenToCamelCase, setComponentSlots, setProp } from "../helper";
import { useRenderSelect } from "./use-render-select";
import { useRenderRadio } from "./use-render-radio";
import { useRenderCheckbox } from "./use-render-checkbox";
import { useRenderComponent } from "./use-render-component";
import { componentMap } from "../helper/component-map";

defineOptions({ name: "ProFormItem" });

interface ProFormItemProps {
  column: FormSchemaProps;
  style?: CSSStyleDeclaration;
}

const props = defineProps<ProFormItemProps>();

const model = defineModel<Record<string, any>>({ required: true });

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.fieldNames?.label ?? "label",
    value: props.column.fieldNames?.value ?? "value",
    children: props.column.fieldNames?.children ?? "children",
    disabled: props.column.fieldNames?.disabled ?? "disabled",
  };
});

// 接收 enumMap (el 为 select-v 2 需单独处理 enumData)
const enumMap = inject(formEnumMapKey, ref(new Map()));
const columnEnum = computed(() => {
  const { useEnumMap, enumKey, prop, el } = props.column;

  if (useEnumMap) {
    if (typeof useEnumMap === "function") {
      return useEnumMap(enumMap.value);
    }

    const data = enumMap.value.get(useEnumMap);
    if (!data) return [];
    if (enumKey) return data[enumKey] || [];
    return data;
  }

  let enumData = enumMap.value.get(prop);

  if (!enumData) return [];
  if (hyphenToCamelCase(el) === ComponentNameEnum.EL_SELECT_V2) {
    enumData = enumData.map((item: Record<string, any>) => {
      return { ...item, label: item[fieldNames.value.label], value: item[fieldNames.value.value] };
    });
  }
  if (enumKey) return enumData[enumKey] || [];
  return enumData;
});

// 处理透传的 formProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const formProps = computed(() => {
  const label = fieldNames.value.label;
  const value = fieldNames.value.value;
  const children = fieldNames.value.children;
  const formEl = hyphenToCamelCase(props.column?.el);
  let formProps = props.column.props ?? {};

  if (formEl === ComponentNameEnum.EL_TREE_SELECT) {
    formProps = { ...formProps, props: { ...formProps.props, label, children }, nodeKey: value };
  }

  if (formEl === ComponentNameEnum.EL_CASCADER) {
    formProps = { ...formProps, props: { ...formProps.props, label, value, children } };
  }

  if (formEl === ComponentNameEnum.EL_DATE_PICKER) {
    if (formProps.type === "datetime") formProps = { valueFormat: "YYYY-MM-DD HH:mm:ss", ...formProps };
    if (formProps.type === "date") formProps = { valueFormat: "YYYY-MM-DD", ...formProps };
    else formProps = { valueFormat: "YYYY-MM-DD", ...formProps };
  }

  if (formEl === ComponentNameEnum.EL_TIME_PICKER) formProps = { valueFormat: "HH:mm:ss", ...formProps };

  return formProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const { props: { type, isRange, placeholder } = {}, el } = props.column;
  if (["datetimerange", "daterange", "monthrange"].includes(type) || isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }
  const placeholderConst =
    placeholder ?? (hyphenToCamelCase(el)?.includes(ComponentNameEnum.EL_INPUT) ? "请输入" : "请选择");

  return { placeholder: placeholderConst };
});

// 是否有清除按钮 (当有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const { props: { clearable } = {}, defaultValue } = props.column;
  return clearable ?? (defaultValue === null || defaultValue === undefined);
});

const isDisabled = () => {
  if (typeof props.column.disabled === "function") return props.column.disabled(model.value);
  return props.column.disabled;
};

const { renderComponent: RenderComponent } = useRenderComponent(
  model,
  formProps,
  props.column,
  columnEnum.value,
  fieldNames.value
);
const { renderSelectOptions } = useRenderSelect();
const { renderRadioOptions } = useRenderRadio();
const { renderCheckboxOptions } = useRenderCheckbox();

// 渲染插槽
const RenderSlots = () => {
  const { column } = props;
  return column.render!({
    model: model.value,
    data: getProp(model.value, column.prop),
    enumData: columnEnum.value,
  });
};

// 存储组件实例
const formComponentRef = ref<Component | any>();

// 渲染 Element Plus 的组件
const RenderElComponents = () => {
  const { column, style } = props;
  const { el, prop, valueFormat, slots = {} } = column;

  const rootEl = hyphenToCamelCase(el) || "";

  // 初始化组件的插槽（如果有自定义插槽）
  const slotsMap = { ...setComponentSlots(slots) };
  // 获取 default 默认插槽
  const defaultSlot = getDefaultSlot(rootEl);

  defaultSlot && (slotsMap.default = defaultSlot);

  // TSX 不能直接使用 Vue3 内置组件 <component></component>，因此通过内置 resolveComponent 函数获取
  const Component =
    (componentMap[rootEl as PascalCaseComponentName] as ReturnType<typeof defineComponent>) || resolveComponent(rootEl);

  const componentModel = computed({
    get: () => {
      return getProp(model.value, prop, valueFormat);
    },
    set: val => {
      setProp(model.value, prop, val);
    },
  });

  return Component ? (
    // EP 上传组件绑定的是 v-model:file-list 而不是 v-model
    rootEl === ComponentNameEnum.EL_UPLOAD ? (
      <Component
        v-model:file-list={componentModel.value}
        ref={formComponentRef}
        disabled={isDisabled()}
        clearable={clearable.value}
        {...formProps.value}
        {...placeholder.value}
        style={style}
      >
        {{ ...slotsMap }}
      </Component>
    ) : (
      <Component
        v-model={componentModel.value}
        ref={formComponentRef}
        disabled={isDisabled()}
        clearable={clearable.value}
        {...formProps.value}
        {...placeholder.value}
        data={rootEl === ComponentNameEnum.EL_TREE_SELECT ? columnEnum.value : []}
        options={
          [ComponentNameEnum.EL_CASCADER, ComponentNameEnum.EL_SELECT_V2].includes(rootEl as ComponentNameEnum)
            ? columnEnum.value
            : []
        }
        style={style}
      >
        {{ ...slotsMap }}
      </Component>
    )
  ) : undefined;
};

const getDefaultSlot = (rootEl: string) => {
  const { column } = props;
  const { slots = {} } = column;

  // 如果自定义插槽，则返回自定义插槽
  if (slots.default) return () => slots.default(columnEnum.value, fieldNames.value);

  // 下拉框
  if (rootEl === ComponentNameEnum.EL_SELECT) return () => renderSelectOptions(columnEnum.value, fieldNames.value);

  // 单选框组和按钮样式
  if ([ComponentNameEnum.EL_RADIO_GROUP, ComponentNameEnum.EL_RADIO_BUTTON].includes(rootEl as ComponentNameEnum)) {
    return () => renderRadioOptions(columnEnum.value, fieldNames.value, column);
  }

  // 多选框组和按钮样式
  if (
    [ComponentNameEnum.EL_CHECKBOX_GROUP, ComponentNameEnum.EL_CHECKBOX_BUTTON].includes(rootEl as ComponentNameEnum)
  ) {
    return () => renderCheckboxOptions(columnEnum.value, fieldNames.value, column);
  }

  // 虚拟列表
  if (rootEl === ComponentNameEnum.EL_SELECT_V2 && slots.default) return ({ item }) => slots.default(item);
};

defineExpose({
  formComponentRef,
});
</script>

<template>
  <RenderSlots v-if="column?.render" :style="style" />

  <Tree
    v-else-if="hyphenToCamelCase(column.el) === ComponentNameEnum.EL_TREE"
    :data="columnEnum"
    :model-value="getProp(model, column.prop)"
    @update:model-value="v => setProp(model, column.prop, v)"
    v-bind="{ ...formProps }"
  />

  <RenderElComponents v-else-if="hyphenToCamelCase(column.el)?.startsWith('El')" />

  <RenderComponent v-else :style="style" />
</template>
