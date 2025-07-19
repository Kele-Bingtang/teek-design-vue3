<script setup lang="ts">
import type { FormItemProp, FormValidateCallback } from "element-plus";
import type { FormColumn } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { ProFormGroupProps, ProFormGroupEmits } from "./types";
import { computed, onMounted, toValue } from "vue";
import { ElCard, ElIcon } from "element-plus";
import { ProForm, ProFormMain, useProFormFn, useProFormMainFn } from "@/components/pro/form";
import { useNamespace } from "@/composables";
import { useFormGroupApi } from "./composables/use-form-group-api";

defineOptions({ name: "ProFormGroup" });

const props = withDefaults(defineProps<ProFormGroupProps>(), {
  columns: () => [],
  elFormProps: () => ({}),
  showErrorTip: true,
  showFooter: true,
  showReset: true,
  submitText: "提交",
  resetText: "重置",
  submitLoading: false,
  footerAlign: "right",
  preventNativeSubmit: false,

  // ProFormMain 组件的 props（透传下去）
  cleanModel: false,
  notCleanModelKeys: () => [],
  flexLayout: true,
  rowProps: () => ({}),
  colProps: () => ({}),
  showLabel: true,
  clearable: true,
  width: "100%",
});

const emits = defineEmits<ProFormGroupEmits>();

const ns = useNamespace("pro-form-group");

const model = defineModel<Recordable>({ default: () => ({}) });

// 最终的 Props
const finalProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

// ProForm 的列配置项
const proFormColumns = computed(() => {
  const proFormColumns: FormColumn[] = [];
  finalProps.value.columns.forEach(item => {
    proFormColumns.push(...item.columns);
  });

  return proFormColumns;
});

const { mergeProps, setValues, setProps, setColumn, addColumn, delColumn } = useFormGroupApi(
  model,
  computed(() => proFormColumns.value)
);

const { proFormInstance, submitForm, resetForm, getProFormInstance, getElFormInstance } =
  useProFormFn("proFormInstance");
const { proFormMainInstance, getOptionsMap, getElFormItemInstance, getElInstance, getProFormMainInstance } =
  useProFormMainFn("proFormMainInstance");

// ---------- 代理 ProForm 事件 ----------

/**
 * 表单验证事件
 */
const handleValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emits("validate", prop, isValid, message);
};

/**
 * 表单提交事件
 */
const handleSubmit = (model: Recordable) => {
  emits("submit", model);
};

/**
 * 表单校验错误事件
 */
const handleSubmitError = (invalidFields: Parameters<FormValidateCallback>[1]) => {
  emits("submitError", invalidFields);
};

/**
 * 表单重置事件
 */
const handleReset = (model: Recordable) => {
  emits("reset", model);
};
/**
 * 表单值改变事件
 */
const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

onMounted(() => {
  // 往父类注册 ProForm 组件实例
  emits("register", getProFormInstance()?.$parent || null);
});

const defaultExpose = {
  model,
  setProps,
  setColumn,
  setValues,
  delColumn,
  addColumn,
  submitForm,
  resetForm,

  proFormInstance,
  proFormMainInstance,
  getOptionsMap,
  getProFormInstance,
  getProFormMainInstance,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(defaultExpose);
</script>

<template>
  <ProForm
    ref="proFormInstance"
    v-bind="{ ...$attrs, ...finalProps, cardProps: undefined }"
    v-model="model"
    :columns="proFormColumns"
    @validate="handleValidate"
    @submit="handleSubmit"
    @submit-error="handleSubmitError"
    @reset="handleReset"
    :class="ns.b()"
  >
    <template #default="{ formMainProps }">
      <template v-for="(column, index) in columns" :key="toValue(column.title)">
        <el-card v-if="!toValue(column.hidden)" v-bind="column.cardProps || cardProps" :class="ns.e('card')">
          <template #header>
            <slot
              name="header"
              :title="toValue(column.title)"
              :columns="column.columns"
              :icon="column.icon"
              :index="index"
            >
              <div :class="ns.em('card', 'icon')">
                <el-icon v-if="column.icon"><component :is="column.icon" /></el-icon>
                {{ toValue(column.title) }}
              </div>
            </slot>
          </template>

          <template #default>
            <slot v-if="column.prop && $slots[column.prop]" :name="column.prop" v-bind="column" :index="index" />

            <ProFormMain
              v-else
              ref="proFormMainInstance"
              v-model="model"
              v-bind="formMainProps"
              :columns="column.columns"
              :clean-model
              :not-clean-model-keys
              :flex-layout
              :row-props
              :col-props
              :show-label
              :clearable
              :width
              @change="handleChange"
            >
              <template #default="formMainScope">
                <slot name="form-main" v-bind="formMainScope" />
              </template>

              <!-- 其他通用插槽 -->
              <template v-for="slot in Object.keys($slots).filter(key => !['form-main'].includes(key))" #[slot]="scope">
                <slot :name="slot" v-bind="scope as Recordable" />
              </template>
            </ProFormMain>
          </template>
        </el-card>
      </template>
    </template>
  </ProForm>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
