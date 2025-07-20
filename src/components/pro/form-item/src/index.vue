<script setup lang="ts">
import type { Component } from "vue";
import type { FormItemInstance } from "element-plus";
import type { FormItemColumnProps, ModelBaseValueType, ProFormItemEmits } from "./types";
import { computed, watch, useTemplateRef, toValue, ref } from "vue";
import { ElFormItem, ElTooltip, ElDivider, ElUpload, ElIcon } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { addUnit, isObject, isString } from "@/common/utils";
import { getProp, toCamelCase, setProp, filterOptions, filterOptionsValue } from "@/components/pro/helper";
import { formELComponentsMap, FormElComponentEnum } from "./helper";
import { useOptions } from "@/components/pro/use-options";
import Checkbox from "./components/checkbox.vue";
import Radio from "./components/radio.vue";
import Select from "./components/select.vue";
import Tree from "./components/tree.vue";

defineOptions({ name: "ProFormItem" });

const props = withDefaults(defineProps<FormItemColumnProps>(), {
  prop: "",
  label: "",
  showLabel: true,
  width: "",
  el: "ElInput",
  elProps: () => ({}),
  elSlots: () => ({}),
  options: () => [],
  optionField: () => ({ label: "label", value: "value", children: "children", disabled: "disabled" }),
  formItemProps: () => ({}),
  clearable: true,
  tooltip: undefined,
  renderLabel: undefined,
  render: undefined,
  getFormat: undefined,
  editable: true,
});

const model = defineModel<ModelBaseValueType>({ required: false });

const formEl = computed(() => toCamelCase(toValue(props.el)) as FormElComponentEnum);
const labelValue = computed(() => toValue(props.label));
const showLabelValue = computed(() => toValue(props.showLabel));
const withValue = computed(() => addUnit(toValue(props.width)));
const formItemPropsValue = computed(() => toValue(props.formItemProps));
const editableValue = computed(() => toValue(props.editable));
const tooltipValue = computed(() => toValue(props.tooltip));

// 表单组件需要的 v-model
const elModel = computed({
  get: () => {
    const { prop, getFormat } = props;
    // 如果 model 是对象，则取到对应的 prop 值
    if (isObject(model.value) && prop) return getProp(model.value, prop, getFormat);
    return model.value;
  },
  set: val => {
    if (!isObject(model.value)) return (model.value = val);

    // 修改整个 model 而不是修改 model.xxx，确保触发响应式更新(兼容手动 modelValue + @update:modelValue 方式)
    const formModel = { ...model.value };
    setProp(formModel, props.prop, val);
    model.value = formModel;
  },
});

// 插槽参数
const slotParams = computed(() => ({
  ...props,
  value: elModel.value,
  model: model.value,
  label: labelValue.value,
  options: enums.value,
  elProps: elPropsValue.value,
  formItemProps: formItemPropsValue.value,
}));

watch(elModel, () => emits("change", elModel.value, model.value, slotParams.value));

// 有子组件的表单组件映射
const childComponentMap: Record<string, { root: Component; child?: Component }> = {
  [FormElComponentEnum.EL_SELECT]: { root: formELComponentsMap.ElSelect, child: Select },
  [FormElComponentEnum.EL_RADIO]: { root: formELComponentsMap.ElRadioGroup, child: Radio },
  [FormElComponentEnum.EL_RADIO_GROUP]: { root: formELComponentsMap.ElRadioGroup, child: Radio },
  [FormElComponentEnum.EL_RADIO_BUTTON]: { root: formELComponentsMap.ElRadioGroup, child: Radio },
  [FormElComponentEnum.EL_CHECKBOX]: { root: formELComponentsMap.ElCheckboxGroup, child: Checkbox },
  [FormElComponentEnum.EL_CHECKBOX_GROUP]: { root: formELComponentsMap.ElCheckboxGroup, child: Checkbox },
  [FormElComponentEnum.EL_CHECKBOX_BUTTON]: { root: formELComponentsMap.ElCheckboxGroup, child: Checkbox },
};

const updateElModel = (value: unknown) => (elModel.value = value);

// 获取标题样式
const formatDividerTitle = (labelSize = "default") => {
  if (labelSize === "default") return { fontSize: "16px", fontWeight: 600 };
  if (labelSize === "small") return { fontSize: "14px", fontWeight: 600 };
  if (labelSize === "large") return { fontSize: "18px", fontWeight: 600 };

  return {};
};

const { enums } = useFormItemOptions();
const { elPropsValue, placeholder } = useFormItemInitProps();

const emits = defineEmits<ProFormItemEmits>();

/**
 * 表单组件初始化相关参数
 */
function useFormItemInitProps() {
  // 处理透传的 elProps
  const elPropsValue = computed<Record<string, any>>(() => {
    const { optionField, elProps } = props;
    const elPropsValue = toValue(elProps) as Record<string, any>;
    const label = optionField.label;
    const value = optionField.value;
    const children = optionField.children;
    const formElConst = formEl.value;

    if (formElConst === FormElComponentEnum.EL_TREE_SELECT) {
      return { ...elPropsValue, props: { ...elPropsValue, label, children }, nodeKey: value };
    }

    if (formElConst === FormElComponentEnum.EL_CASCADER) {
      return { ...elPropsValue, props: { ...elPropsValue, label, value, children } };
    }

    if (formElConst === FormElComponentEnum.EL_DATE_PICKER) {
      const type = elPropsValue.type;

      if (type === "datetime") return { valueFormat: "YYYY-MM-DD HH:mm:ss", ...elPropsValue };
      if (type === "date") return { valueFormat: "YYYY-MM-DD", ...elPropsValue };
      if (["year", "years"].includes(type)) return { valueFormat: "YYYY", ...elPropsValue };
      if (["month", "monthrange"].includes(type)) return { valueFormat: "YYYY-MM", ...elPropsValue };

      return { valueFormat: "YYYY-MM-DD", ...elPropsValue };
    }

    if (formElConst === FormElComponentEnum.EL_TIME_PICKER) return { valueFormat: "HH:mm:ss", ...elPropsValue };

    return elPropsValue;
  });

  // 处理默认 placeholder
  const placeholder = computed(() => {
    const { type, isRange, placeholder } = elPropsValue.value;
    if (["datetimerange", "daterange", "monthrange"].includes(type) || isRange) {
      return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
    }
    const placeholderConst = placeholder ?? (formEl.value === FormElComponentEnum.EL_INPUT ? "请输入" : "请选择");

    return { placeholder: placeholderConst };
  });

  return { elPropsValue, placeholder };
}

/**
 * 表单字典枚举相关逻辑
 */
function useFormItemOptions() {
  const enums = ref<Record<string, any>[]>([]);

  const { initOptions } = useOptions();

  const init = async () => {
    const { options, optionField } = props;

    const value = await initOptions(options, [model.value]);

    // el 为 select-v2 需单独处理
    if (formEl.value === FormElComponentEnum.EL_SELECT_V2) {
      return value.map((item: Record<string, any>) => ({
        ...item,
        label: item[optionField.label!],
        value: item[optionField.value!],
      }));
    }

    return value;
  };

  watch(
    () => props.options,
    async () => (enums.value = await init()),
    { immediate: true }
  );

  return { enums };
}

// 存储每一个 ElFormItem 实例
const elFormItemInstance = useTemplateRef<FormItemInstance>("elFormItemInstance");
// 存储每一个表单组件实例
const elInstance = useTemplateRef<Component>("elInstance");

const expose = {
  elFormItemInstance,
  elInstance,
};

defineExpose(expose);
</script>

<template>
  <el-form-item
    ref="elFormItemInstance"
    :label="showLabelValue ? labelValue + '' : ''"
    :prop="prop"
    v-bind="formItemProps"
    :label-width="showLabelValue ? formItemPropsValue?.labelWidth : '0'"
  >
    <template v-if="editableValue && showLabelValue" #label="{ label }">
      <!-- 自定义 label（h、JSX）渲染 -->
      <component v-if="renderLabel" :is="renderLabel(label, slotParams)" />
      <!-- 自定义 renderLabelHTML 函数渲染，返回 HTML 格式 -->
      <span v-else-if="renderLabelHTML" v-html="renderLabelHTML(label, slotParams)" />
      <!-- 自定义 label 插槽 -->
      <slot v-else-if="$slots[`${prop}-label`]" :name="`${prop}-label`" v-bind="slotParams" />
      <!-- 默认 Label -->
      <template v-else-if="label">{{ label }}</template>

      <el-tooltip v-if="isString(tooltipValue)" placement="top" effect="dark" :content="tooltipValue">
        <slot name="tooltip-icon">
          <el-icon><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>

      <el-tooltip
        v-else-if="tooltipValue"
        placement="top"
        effect="dark"
        v-bind="{ ...tooltipValue, render: undefined, contentRender: undefined }"
      >
        <!-- ElToolTip 默认插槽 -->
        <component v-if="tooltipValue.render" :is="tooltipValue.render" />
        <!-- ElToolTip content 插槽 -->
        <template v-if="tooltipValue.contentRender" #content>
          <component :is="tooltipValue.contentRender()" />
        </template>
        <slot name="tooltip-icon">
          <el-icon><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>
    </template>

    <template v-if="editableValue">
      <!-- 自定义表单组件（h、JSX）渲染-->
      <component
        v-if="render"
        :is="render(elModel, updateElModel, slotParams)"
        v-model="elModel"
        v-bind="elPropsValue"
      />
      <!-- 自定义表单组件插槽 -->
      <slot v-else-if="$slots[prop]" :name="prop" v-bind="{ update: updateElModel, ...slotParams }" />

      <template v-else>
        <Tree
          v-if="formEl === FormElComponentEnum.EL_TREE"
          :data="enums"
          v-model="elModel"
          v-bind="elPropsValue"
          :style="{ width: withValue }"
        />

        <el-divider v-else-if="formEl === FormElComponentEnum.EL_DIVIDER" v-bind="elPropsValue">
          <span :style="formatDividerTitle(elPropsValue.labelSize)">
            {{ labelValue }}
          </span>
        </el-divider>

        <el-upload
          v-else-if="formEl === FormElComponentEnum.EL_UPLOAD"
          ref="elInstance"
          v-model:file-list="elModel"
          :clearable
          v-bind="{ ...elPropsValue, ...placeholder }"
          :style="{ width: withValue }"
        />

        <component
          v-else-if="childComponentMap[formEl]"
          :is="childComponentMap[formEl].root"
          ref="elInstance"
          v-model="elModel"
          :clearable
          v-bind="{ ...elPropsValue, ...placeholder }"
          :style="{ width: withValue }"
        >
          <component :is="childComponentMap[formEl].child" :options="enums" :optionField :el="formEl" />

          <template v-for="(slot, key) in elSlots" :key="key" #[key]="data">
            <component :is="slot" v-bind="{ ...slotParams, ...data }" />
          </template>
        </component>

        <component
          v-else-if="formEl"
          :is="formELComponentsMap[formEl]"
          ref="elInstance"
          v-model="elModel"
          :clearable
          v-bind="{ ...elPropsValue, ...placeholder }"
          :data="formEl === FormElComponentEnum.EL_TREE_SELECT ? enums : elPropsValue.data || []"
          :options="
            [
              FormElComponentEnum.EL_CASCADER,
              FormElComponentEnum.EL_SELECT_V2,
              FormElComponentEnum.EL_SEGMENTED,
              FormElComponentEnum.CHECK_BOX_SELECT,
            ].includes(formEl)
              ? enums
              : []
          "
          :style="{ width: withValue }"
        >
          <template v-for="(slot, key) in elSlots" :key="key" #[key]="data">
            <component :is="slot" v-bind="{ ...slotParams, ...data }" />
          </template>
        </component>
      </template>
    </template>

    <span v-else>
      {{ enums.length ? filterOptionsValue(filterOptions(elModel, enums, optionField), "label") : elModel }}
    </span>
  </el-form-item>
</template>
