<script setup lang="ts">
import type { FormColumn, ProFormEmits, ProFormProps } from "./types";
import type { FormInstance, FormItemInstance, FormItemProp } from "element-plus";
import type { ElOption, FormItemColumnProps, ModelBaseValueType } from "@/components/pro/form-item";
import { shallowRef, ref, watch, unref, onMounted, computed, type Component } from "vue";
import { ElRow, ElCol, ElForm, ElMessage, ElButton } from "element-plus";
import { ProFormItem, formatValue, getProp, setProp } from "@/components/pro/form-item";
import { useNamespace } from "@/composables";
import { addUnit, isEmpty, isFunction } from "@/utils";
import { deleteProp, getObjectKeys } from "./helper";
import { useFormApi } from "./composables";
import { proFormOptionsMapKey } from "./types";

defineOptions({ name: "ProForm" });

const props = withDefaults(defineProps<ProFormProps>(), {
  columns: () => [],
  elFormProps: () => ({}),
  useFlexLayout: true,
  rowProps: () => ({}),
  colProps: () => ({}),
  onlyRenderEl: false,
  dynamicModel: true,
  includeModelKeys: () => [],
  showErrorTip: true,
  showFooter: true,
  showReset: true,
  submitText: "提交",
  resetText: "重置",
  submitLoading: false,
  footerAlign: "right",
  preventNativeSubmit: false,
  showLabel: true,
  clearable: true,
  width: "100%",
});

// 定义 emit 事件
const emits = defineEmits<ProFormEmits>();

const ns = useNamespace("pro-form");

const model = defineModel<Recordable>({ default: () => ({}) });
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
const withValue = computed(() => addUnit(toValue(finalProps.value.width)));
const footerStyle = computed(() => ({
  display: "flex",
  justifyContent:
    finalProps.value.footerAlign === "left" ? "flex-start" : props.footerAlign === "center" ? "center" : "flex-end",
}));

const { mergeProps, setValues, setProps, setColumn, addColumn, delColumn } = useFormApi(model, finalProps);
const { optionsMap, initOptionsMap } = useFormOptions();
const { availableColumns, destroyOrInit } = useFormInit();
const { submitForm, resetForm } = useFormFooter();
const { handleChange, handleValidate } = useFormEmits();
const { setProFormItemInstance, getElFormItemInstance, getElInstance } = useFormGetInstance();

/**
 * 表单字典枚举相关逻辑
 */
function useFormOptions() {
  // 定义 optionsMap 存储枚举值
  const optionsMap = inject(proFormOptionsMapKey, ref(new Map<string, MaybeRef<ElOption[]>>()));

  const initOptionsMap = async (column: FormColumn) => {
    const { options, prop = "" } = column;
    if (!options) return;

    const optionsMapConst = optionsMap.value;

    // 如果当前 enumMap 存在相同的值则 return
    if (optionsMapConst.has(prop!) && (isFunction(options) || optionsMapConst.get(prop!) === options)) return;

    // 为了防止接口执行慢，导致页面下拉等枚举数据无法填充，所以预先存储为 [] 方便获取，接口返回后再二次存储
    optionsMapConst.set(prop!, []);

    // 处理 options 并存储到 optionsMap
    const value = await formatValue<FormItemColumnProps["options"]>(options, [model.value, optionsMapConst], false);

    optionsMapConst.set(prop, (value as any)?.data || value);
  };

  return { optionsMap, initOptionsMap };
}

/**
 * 表单数据初始化相关逻辑
 */
function useFormInit() {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 计算属性：过滤掉需要销毁的表单项
  const availableColumns = computed(() => finalProps.value.columns.filter(item => !destroyOrInit(item)));

  // 初始化默认值
  const initDefaultValue = async (column: FormColumn) => {
    const { defaultValue, optionField, prop } = column;
    const modelConst = model.value;
    const value = getProp(modelConst, prop);

    // 如果有值，则不需要赋默认值
    if (!isEmpty(value)) return;

    const defaultValueConst = await formatValue<FormColumn["defaultValue"]>(defaultValue, [
      modelConst,
      optionsMap.value,
    ]);

    if (defaultValueConst) return setProp(modelConst, prop, defaultValueConst);

    // 如果没有设置默认值，则判断字典里是否有 isDefault 为 Y 的枚举
    const enumData = unref(optionsMap.value.get(prop));
    if (enumData?.length) {
      // 找出 isDefault 为 Y 的 value
      const data = enumData.find(item => item.isDefault === "Y");

      return data && setProp(modelConst, prop, data[optionField?.value ?? "value"]);
    }
  };

  /**
   * 是否销毁表单项 & 是否初始化表单项默认值
   */
  const destroyOrInit = (item: FormColumn) => {
    let destroy = unref(item.destroy) ?? false;
    if (isFunction(item.destroy)) destroy = unref(item.destroy(model.value)) ?? false;

    // 如果不销毁，则初始化表单默认值，反之则重置为空
    if (!destroy) initDefaultValue(item);
    else deleteProp(model.value, item.prop);

    return destroy;
  };

  // 监听表单结构化数组，重新组装 column
  watch(
    availableColumns,
    (column = []) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // 防抖：防止初始化时连续执行
      timer = setTimeout(() => {
        const { dynamicModel, includeModelKeys } = finalProps.value;

        column.forEach((item, index) => {
          // 初始化枚举数据
          initOptionsMap(item);

          // 设置表单排序默认值
          item && (item.order = item.order ?? index + 5);
          // 初始化值
          initDefaultValue(item);
        });

        // 排序表单项
        column.sort((a, b) => a.order! - b.order!);

        if (!dynamicModel) return;

        // 如果 column 对应的 prop 不存在，则删除 model 中的对应的 prop
        getObjectKeys(model.value).forEach(key => {
          const isExist = column.some(item => item.prop === key || includeModelKeys?.includes(key));
          if (!isExist) deleteProp(model.value, key);
        });
      }, 10);
    },
    {
      immediate: true,
      deep: true,
    }
  );

  return { availableColumns, destroyOrInit };
}

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

/**
 *表单 emits 事件相关逻辑
 */
function useFormEmits() {
  const handleChange = (model: ModelBaseValueType, column: FormItemColumnProps) => {
    emits("change", model, column);
  };

  onMounted(() => {
    emits("register", elFormInstance.value?.$parent || null, elFormInstance.value);
  });

  const handleValidate = (prop: FormItemProp, isValid: boolean, message: string): void => {
    emits("validate", prop, isValid, message);
  };

  return { handleChange, handleValidate };
}

/**
 * 表单组件实例初始化和获取
 */
function useFormGetInstance() {
  // 存储表单组件实例
  const proFormItemInstances = shallowRef<Record<string, InstanceType<typeof ProFormItem>>>({});

  // 获取 ProFormItem 的实例
  const setProFormItemInstance = (el: any, prop: string) => {
    if (el) setProp(proFormItemInstances.value, prop, el);
  };

  // 获取 ElFormItem 实例
  const getElFormItemInstance = (prop: FormColumn["prop"]): FormItemInstance => {
    return getProp(proFormItemInstances.value, prop).elFormItemInstance;
  };

  // 获取表单组件实例
  const getElInstance = (prop: FormColumn["prop"]): Component | ComponentPublicInstance => {
    return getProp(proFormItemInstances.value, prop).elInstance;
  };

  return { setProFormItemInstance, getElFormItemInstance, getElInstance };
}

/**
 * 是否隐藏表单项
 */
const isHidden = (column: FormColumn) => {
  const { hidden } = column;
  if (isFunction(hidden)) return unref(hidden(model.value)) ?? false;
  return unref(hidden);
};

/**
 * 获取 ElCol Props
 */
const getColProps = (column: FormColumn) => {
  const { colProps } = finalProps.value;
  return {
    span: 24,
    ...colProps,
    ...toValue(column.colProps),
  };
};

const expose = {
  elFormInstance,
  model,
  setValues,
  setProps,
  setColumn,
  addColumn,
  delColumn,
  getElFormItemInstance,
  getElInstance,
  destroyOrInit,
  isHidden,
  optionsMap,
  submitForm,
  resetForm,
};

defineExpose(expose);
</script>

<template>
  <el-form
    ref="elFormInstance"
    v-bind="{ ...finalProps.elFormProps, ...$attrs }"
    :label-width="showLabelValue ? finalProps.elFormProps.labelWidth : 0"
    :label-suffix="showLabelValue ? finalProps.elFormProps.labelSuffix : ''"
    :model="model"
    :class="ns.b()"
    @validate="handleValidate"
  >
    <slot :isHidden :setProFormItemInstance :optionsMap>
      <el-row v-if="finalProps.useFlexLayout" :gutter="20" v-bind="finalProps.rowProps" style="width: 100%">
        <el-col
          v-for="column in availableColumns"
          :key="column.prop"
          v-show="!isHidden(column)"
          v-bind="getColProps(column)"
        >
          <ProFormItem
            :ref="el => setProFormItemInstance(el, column.prop)"
            v-model="model"
            v-bind="column"
            :clearable="column.clearable ?? clearable"
            :width="column.width ?? withValue"
            :show-label="column.showLabel ?? showLabelValue"
            :options="optionsMap.get(column.optionsProp || column.prop)"
            @change="handleChange"
          />
        </el-col>
      </el-row>

      <template v-else v-for="column in availableColumns" :key="column.prop">
        <ProFormItem
          :ref="el => setProFormItemInstance(el, column.prop)"
          v-model="model"
          v-bind="column"
          :clearable="column.clearable ?? clearable"
          :width="column.width ?? withValue"
          :show-label="column.showLabel ?? showLabelValue"
          v-show="!isHidden(column)"
          :options="optionsMap.get(column.optionsProp || column.prop)"
          @change="handleChange"
        />
      </template>

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
    </slot>
  </el-form>
</template>
