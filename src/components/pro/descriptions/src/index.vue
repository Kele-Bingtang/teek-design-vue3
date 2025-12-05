<script setup lang="ts">
import type { ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { DescriptionColumn, ProDescriptionsEmits, ProDescriptionsProp, DescriptionsRenderParams } from "./types";
import {
  computed,
  isReactive,
  isRef,
  onMounted,
  reactive,
  ref,
  toValue,
  unref,
  useTemplateRef,
  watch,
  watchEffect,
} from "vue";
import { ElDescriptions, ElDescriptionsItem, ElButton, type DescriptionInstance } from "element-plus";
import { isArray, isFunction } from "@/common/utils";
import { filterOptions, filterOptionsValue, getProp, setProp } from "@/components/pro/helper";
import { useOptions } from "@/components/pro/use-options";
import { ElDisplay } from "@/components/pro/table";
import { useNamespace } from "@/composables";
import { useDescriptionsApi } from "./composables";
import DescriptionsEdit from "./edit.vue";

import "./index.scss";

defineOptions({ name: "ProDescriptions" });

const props = withDefaults(defineProps<ProDescriptionsProp>(), {
  data: () => ({}),
  requestApi: undefined,
  defaultRequestParams: () => ({}),
  columns: () => [],
  descriptionsItemProps: () => ({}),
  card: false,
  editable: false,
  formProps: () => ({}),
  editButton: false,
  editText: () => ["编辑", "退出编辑"],
  showReset: true,
  submitText: "提交",
  resetText: "重置",
  submitLoading: false,
  footerAlign: "left",
  footerStyle: () => ({}),
  validate: true,
});

const emits = defineEmits<ProDescriptionsEmits>();

const ns = useNamespace("pro-descriptions");
const elDescriptionsInstance = useTemplateRef<DescriptionInstance>("elDescriptionsInstance");

const model = defineModel<Recordable>({ default: () => reactive({}) });

const editable = ref(false);

// 最终的 props
const finalProps = computed(() => {
  const propsObj = {
    ...props,
    columns:
      isRef(props.columns) || isReactive(props.columns)
        ? props.columns
        : (reactive(unref(props.columns)) as DescriptionColumn[]),
  };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const footerStyle = computed(() => {
  const { footerStyle, footerAlign } = finalProps.value;

  return {
    marginTop: "20px",
    ...footerStyle,
    display: "flex",
    justifyContent: footerAlign === "left" ? "flex-start" : footerAlign === "center" ? "center" : "flex-end",
  };
});

const { mergeProps, setValues, setProps, setColumn, addColumn, delColumn } = useDescriptionsApi(model, finalProps);
const { data: descriptionsData, isRequestGetData } = useDescriptionsDataInit();
const { optionsMap, initOptionsMap } = useOptions();
const { availableColumns } = useDescriptionsInit();
const { proFormInstances, registerProFormInstance, getProFormInstances } = useFormInstanceGet();

const isEditable = computed(() => editable.value || availableColumns.value.some(column => column.editable));

watchEffect(() => (editable.value = finalProps.value.editable));

/**
 * 描述列表列配置初始化
 */
function useDescriptionsInit() {
  // 过滤掉需要隐藏的配置项
  const availableColumns = computed(() => finalProps.value.columns.filter(item => !item.hidden) || []);
  // 定时器
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(
    availableColumns,
    columns => {
      // 防抖：防止初始化时连续执行
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        columns.forEach(column => {
          // 初始化枚举数据
          initOptionsMap(column.options, column.prop || "");
        });

        // 排序配置项
        columns.sort((a, b) => a.order! - b.order!);
      }, 1);
    },
    { deep: true, immediate: true }
  );

  return { availableColumns };
}

/**
 * 描述列表数据初始化
 */
function useDescriptionsDataInit(immediate = true) {
  const requestData = ref<Recordable>({});
  const isRequestGetData = ref(false);

  const data = computed(() => {
    const { data } = finalProps.value;

    if (data && Object.keys(data).length) return data;
    return requestData.value;
  });

  /**
   * 描述列表数据初始化
   */
  const initDescriptionsData = async () => {
    const { requestApi, defaultRequestParams, transformData } = finalProps.value;

    // 如果传入请求函数，则请求获取数据
    if (requestApi) {
      const result = await requestApi(defaultRequestParams);
      // 兼容常用数据格式
      const data = result?.data || result || {};

      requestData.value = transformData?.(data, result) || data;
      isRequestGetData.value = true;
    }
  };

  if (immediate) initDescriptionsData();

  return { data, isRequestGetData };
}

/**
 * ProForm 组件涉及实例获取
 */
function useFormInstanceGet() {
  const proFormInstances = ref<Record<string, ProFormInstance>>({});

  /**
   * 获取 ProFormItem 的实例
   */
  const registerProFormInstance = (el: InstanceType<typeof DescriptionsEdit>, prop: string) => {
    if (!el) return;
    setProp(proFormInstances.value, prop, el.proFormInstance);
  };

  const getProFormInstances = () => Object.values(proFormInstances.value);

  return { proFormInstances, registerProFormInstance, getProFormInstances };
}

/**
 * 初始化列配置
 */
const initColumn = (column: DescriptionColumn) => {
  const { span, rowSpan, width, minWidth, labelWidth, ...rest } = column;

  const callFn = <T,>(fn: (editable: boolean) => T) => {
    return fn(editable.value ?? column.editable ?? false);
  };

  // 如果是函数，则传参调用获取函数返回值，否则等于本身
  const spanValue = isFunction(span) ? callFn(span) : unref(span);
  const rowSpanValue = isFunction(rowSpan) ? callFn(rowSpan) : unref(rowSpan);
  const widthValue = isFunction(width) ? callFn(width) : unref(width);
  const minWidthValue = isFunction(minWidth) ? callFn(minWidth) : unref(minWidth);
  const labelWidthValue = isFunction(labelWidth) ? callFn(labelWidth) : unref(labelWidth);

  return {
    ...rest,
    span: spanValue,
    rowSpan: rowSpanValue,
    width: widthValue,
    minWidth: minWidthValue,
    labelWidth: labelWidthValue,
  };
};

/**
 * 获取当前值
 */
const getValue = (column: DescriptionColumn) => {
  const dataValue = descriptionsData.value;
  const { prop = "", optionsProp, optionField, transformOption } = column;
  const options = unref(optionsMap.value.get(optionsProp || prop));

  if (!options) return getProp(dataValue, prop);

  // 获取字典数据
  const option = transformOption
    ? transformOption(getProp(dataValue, prop), options, dataValue)
    : filterOptions(getProp(dataValue, prop), options, optionField);

  const label = option ? filterOptionsValue(option, optionField?.label || "label") : "";

  // 如果当前值为数组，使用 / 分隔符拼接（根据需求自定义分隔符）
  if (isArray(label)) return label.length ? label.join(" / ") : "--";
  return label ?? "--";
};

/**
 * 格式化值
 */
const formatValue = (value: unknown, column: DescriptionColumn) => {
  const { formatValue } = column;

  return (
    formatValue?.(value, { value, column, label: toValue(column.label || ""), data: descriptionsData.value }) ??
    value ??
    "--"
  );
};

/**
 * 获取 Render/插槽 的参数
 */
const getRenderParams = (column: DescriptionColumn) =>
  ({
    value: getValue(column),
    column,
    label: toValue(column.label || ""),
    data: descriptionsData,
  }) as DescriptionsRenderParams;

/**
 * 判断表单是否开启校验
 */
const isRequired = (item: DescriptionColumn) => {
  const elFormProps = toValue(toValue(finalProps.value.formProps).elFormProps);
  const formItemProps = toValue(toValue(item.formColumn)?.formItemProps);

  if (formItemProps?.required) return true;

  const rules: Recordable = Reflect.get(formItemProps?.rules || elFormProps?.rules || {}, item.prop || "") || {};

  const isRequired = Object.values(rules).some(rule => rule.required);
  return isRequired;
};

/**
 * 打开编辑态
 */
const openEdited = () => (editable.value = true);
/**
 * 关闭编辑态
 */
const closeEdited = () => (editable.value = false);

/**
 * 表单值改变事件
 */
const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  const prop = column.prop || "";

  // 如果是请求方式获取数据，则自动更新值
  if (isRequestGetData.value) setProp(descriptionsData.value, prop, value);

  emits("formChange", value, prop, model, column);
};

/**
 * 编辑按钮点击事件
 */
const handleEdited = () => {
  editable.value = !editable.value;

  if (editable.value) emits("edited");
  else emits("editedCancel");
};

/**
 * 提交按钮点击事件
 */
const handleSubmit = async () => {
  if (finalProps.value.validate) {
    await Promise.all(
      getProFormInstances().map(async proFormInstance => {
        await proFormInstance.handleSubmit();
      })
    );
  }

  emits("submit", model.value, closeEdited);
};

/**
 * 重置按钮点击事件
 */
const handleReset = () => {
  getProFormInstances().map(proFormInstance => proFormInstance.handleReset());
  emits("reset", model.value, closeEdited);
};

onMounted(() => {
  // 注册实例
  emits("register", elDescriptionsInstance.value?.$parent);
});

defineExpose({
  model,
  optionsMap,
  proFormInstances,
  setValues,
  setProps,
  setColumn,
  addColumn,
  delColumn,

  openEdited,
  closeEdited,
  handleReset,
  handleSubmit,
  getProFormInstances,
  getElFormInstance: (prop: string) => {
    const proFormInstance = proFormInstances.value[prop];
    return proFormInstance.elFormInstance;
  },
  getElFormItemInstance: (prop: string) => {
    const proFormInstance = proFormInstances.value[prop];
    return proFormInstance.proFormMainInstance?.getElFormItemInstance(prop);
  },
  getElInstance: (prop: string) => {
    const proFormInstance = proFormInstances.value[prop];
    return proFormInstance.proFormMainInstance?.getElInstance(prop);
  },
});
</script>

<template>
  <div :class="[ns.b(), { [ns.join('card-minimal')]: card }]">
    <el-descriptions ref="elDescriptionsInstance" v-bind="{ ...$attrs, ...mergeProps }">
      <slot>
        <el-descriptions-item
          v-for="(column, index) in availableColumns"
          :key="index"
          :class-name="(column.className || '') + ` ${ns.e('content')}`"
          :label-class-name="
            (column.labelClassName || '') + ` ${ns.e('label')}` + (isRequired(column) ? ' is-required' : '')
          "
          v-bind="{ ...descriptionsItemProps, ...initColumn(column), formProps: undefined }"
          :label="toValue(column.label)"
        >
          <!-- 描述 label 插槽 -->
          <template #label>
            <!-- 自定义 label 的 Render 函数 -->
            <component v-if="column.renderLabel" :is="column.renderLabel(getRenderParams(column))" />
            <!-- 自定义 label 插槽 -->
            <slot
              v-else-if="$slots[`${column.prop}-label`]"
              :name="`${column.prop}-label`"
              v-bind="getRenderParams(column)"
              :label="toValue(column.label)"
            />

            <template v-else>{{ toValue(column.label) }}</template>
          </template>

          <!-- 编辑功能 -->
          <DescriptionsEdit
            v-if="editable || column.editable"
            v-model="model"
            :ref="(el: any) => registerProFormInstance(el, column.prop || '')"
            v-bind="toValue(column.formColumn)"
            :form-props="{ ...toValue(finalProps.formProps), ...toValue(column.formProps) }"
            :value="getProp(descriptionsData, column.prop || '')"
            :prop="column.prop || ''"
            :options="optionsMap.get(column.prop || '')"
            :option-field="column.optionField"
            @change="handleChange"
          />

          <!-- 自定义 Render 函数渲染 -->
          <component
            v-else-if="column.render"
            :is="column.render(getRenderParams(column))"
            v-bind="{ ...column.elProps }"
          />
          <!-- 自定义 RenderHtml 函数渲染，返回 HTML 格式 -->
          <span v-else-if="column.renderHTML" v-html="column.renderHTML(getRenderParams(column))" />
          <!-- 自定义插槽，插槽名为 column.prop -->
          <slot v-else-if="$slots[column.prop || '']" :name="column.prop || ''" v-bind="getRenderParams(column)" />
          <!-- 自定义 el 组件 -->
          <ElDisplay
            v-else-if="column.el"
            :origin-value="getProp(descriptionsData, column.prop || '')"
            :display-value="getValue(column)"
            :el="column.el"
            :el-props="column.elProps"
            :options="unref(optionsMap.get(column.prop || ''))"
            :option-field="column.optionField"
          >
            <template v-for="(slot, key) in column.elSlots" :key="key" #[key]="data">
              <component :is="slot" v-bind="{ ...getRenderParams(column), ...data }" />
            </template>
          </ElDisplay>

          <!-- 默认 -->
          <template v-else>{{ formatValue(getValue(column), column) }}</template>
        </el-descriptions-item>
      </slot>

      <template #title>
        <slot name="title" />
      </template>

      <template #extra>
        <slot name="extra" />

        <slot name="edit-button" v-bind="handleEdited">
          <el-button v-if="editButton" type="primary" @click="handleEdited">
            {{ editable ? editText[1] : editText[0] }}
          </el-button>
        </slot>

        <slot name="edit-button-after" />
      </template>
    </el-descriptions>

    <div v-if="isEditable" :style="footerStyle">
      <slot name="footer" v-bind="{ handleSubmit, handleReset }">
        <el-button v-if="showReset" @click="handleReset">
          {{ resetText }}
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ submitText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>
