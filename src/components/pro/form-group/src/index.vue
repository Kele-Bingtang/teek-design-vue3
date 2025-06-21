<script setup lang="ts">
import type { FormItemProp, FormValidateCallback } from "element-plus";
import type { FormColumn } from "@/components/pro/form";
import type { FormItemColumnProps, ModelBaseValueType } from "@/components/pro/form-item";
import type { ProFormGroupProps, ProFormGroupEmits } from "./types";
import { toValue } from "vue";
import { ProForm, ProFormMain, useProFormFn, useProFormMainFn } from "@/components/pro/form";
import { useNamespace } from "@/composables";
import { useFormGroupApi } from "./composables/use-form-group-api";

defineOptions({ name: "FormGroup" });

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

const finalProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

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

const handleValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emits("validate", prop, isValid, message);
};
const handleSubmit = (model: Recordable) => {
  emits("submit", model);
};
const handleSubmitError = (invalidFields: Parameters<FormValidateCallback>[1]) => {
  emits("submitError", invalidFields);
};
const handleReset = (model: Recordable) => {
  emits("reset", model);
};

const handleChange = (model: ModelBaseValueType, column: FormItemColumnProps) => {
  emits("change", model, column);
};

onMounted(() => {
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
        <el-card v-if="!toValue(column.hide)" v-bind="column.cardProps || cardProps" :class="ns.e('card')">
          <template #header>
            <slot
              name="group-header"
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
            <ProFormMain
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
              <template v-for="slot in Object.keys($slots).filter(key => !key.includes('form-main'))" #[slot]="scope">
                <slot :name="slot" v-bind="scope" />
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
