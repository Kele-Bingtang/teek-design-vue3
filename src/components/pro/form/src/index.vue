<script setup lang="ts">
import type { FormInstance, FormItemProp } from "element-plus";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { FormColumn, ProFormNamespace } from "./types";
import { unref, onMounted, computed, toValue } from "vue";
import { ElForm, ElMessage, ElButton } from "element-plus";
import { useNamespace } from "@/composables";
import { filterEmpty } from "@/components/pro/helper";
import { useFormApi, useProFormMainFn } from "./composables";
import FormMain from "./form-main.vue";

defineOptions({ name: "ProForm" });

const props = withDefaults(defineProps<ProFormNamespace.Props>(), {
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

// 定义 emit 事件
const emits = defineEmits<ProFormNamespace.Emits>();

const ns = useNamespace("pro-form");

const model = defineModel<Recordable>({ default: () => reactive({}) });
// 存储 ElForm 实例
const elFormInstance = useTemplateRef<FormInstance>("elFormInstance");

// 最终的 props
const finalProps = computed(() => {
  const propsObj = {
    ...props,
    columns:
      isRef(props.columns) || isReactive(props.columns)
        ? props.columns
        : (reactive(unref(props.columns)) as FormColumn[]),
  };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const showLabelValue = computed(() => toValue(finalProps.value.showLabel));
const footerStyle = computed(() => ({
  display: "flex",
  justifyContent:
    finalProps.value.footerAlign === "left" ? "flex-start" : props.footerAlign === "center" ? "center" : "flex-end",
}));

const formMainProps = computed(() => {
  return filterEmpty({
    ...finalProps.value,
    elFormProps: undefined,
    showErrorTip: undefined,
    showFooter: undefined,
    showReset: undefined,
    submitText: undefined,
    resetText: undefined,
    submitLoading: undefined,
    footerAlign: undefined,
    preventNativeSubmit: undefined,
  });
});

const { mergeProps, setValues, setProps, setColumn, addColumn, delColumn } = useFormApi(model, finalProps);
const { submitForm, resetForm } = useFormFooter();
const { proFormMainInstance, getOptionsMap, destroyOrInit, getElFormItemInstance, getElInstance } = useProFormMainFn();

/**
 * 表单 Footer 按钮相关逻辑
 */
function useFormFooter() {
  const submitForm = async () => {
    if (props.preventNativeSubmit) {
      emits("submit", model.value);
      return true;
    }

    return await elFormInstance.value?.validate((isValid, invalidFields) => {
      if (isValid) return emits("submit", model.value);

      if (props.showErrorTip) {
        ElMessage.closeAll();
        ElMessage.warning(Object.values(invalidFields || { message: ["请完整填写表单然后再次提交！"] })[0][0].message);
      }
      emits("submitError", invalidFields);
    });
  };

  const resetForm = () => {
    elFormInstance.value?.resetFields();
    emits("reset", model.value);
  };

  return { submitForm, resetForm };
}

const handleValidate = (prop: FormItemProp, isValid: boolean, message: string): void => {
  emits("validate", prop, isValid, message);
};

const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

onMounted(() => {
  emits("register", elFormInstance.value?.$parent || null, elFormInstance.value);
});

const expose = {
  model,
  setValues,
  setProps,
  setColumn,
  addColumn,
  delColumn,
  submitForm,
  resetForm,

  elFormInstance,
  proFormMainInstance,
  getOptionsMap,
  destroyOrInit,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(expose);
</script>

<template>
  <el-form
    ref="elFormInstance"
    labelPosition="left"
    v-bind="{ ...$attrs, ...finalProps.elFormProps }"
    :label-width="showLabelValue ? finalProps.elFormProps.labelWidth : 0"
    :label-suffix="showLabelValue ? finalProps.elFormProps.labelSuffix : ''"
    :model="model"
    :class="ns.b()"
    @validate="handleValidate"
  >
    <slot v-bind="{ formMainProps, onChange: handleChange }">
      <FormMain ref="proFormMainInstance" v-model="model" v-bind="formMainProps" @change="handleChange">
        <template #default="scope">
          <slot name="form-main" v-bind="scope" />
        </template>

        <!-- 其他通用插槽 -->
        <template v-for="slot in Object.keys($slots).filter(key => !key.includes('form-main'))" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </FormMain>
    </slot>

    <div v-if="showFooter" :style="footerStyle">
      <slot name="footer" v-bind="{ submitForm, resetForm }">
        <el-button v-if="showReset" @click="resetForm">
          {{ resetText }}
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">
          {{ submitText }}
        </el-button>
      </slot>
    </div>
  </el-form>
</template>
