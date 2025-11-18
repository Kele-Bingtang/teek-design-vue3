<script setup lang="ts">
import type { Component, ComponentPublicInstance } from "vue";
import type { FormItemInstance } from "element-plus";
import type { FormItemColumnProps, ProFormItemInstance } from "@/components/pro/form-item";
import type { FormColumn, FormMainNamespace } from "./types";
import { computed, shallowRef, unref, watch, toValue, reactive } from "vue";
import { ElRow, ElCol } from "element-plus";
import { isEmpty, isFunction } from "@/common/utils";
import { formatValue, getProp, setProp, deleteProp, getObjectKeys } from "@/components/pro/helper";
import { useOptions } from "@/components/pro/use-options";
import { ProFormItem } from "@/components/pro/form-item";

defineOptions({ name: "ProFormMain" });

const props = withDefaults(defineProps<FormMainNamespace.Props>(), {
  columns: () => [],
  cleanModel: false,
  notCleanModelKeys: () => [],
  flexLayout: true,
  rowProps: () => ({}),
  colProps: () => ({}),
  showLabel: true,
  clearable: true,
  editable: true,
  width: "100%",
});

const emits = defineEmits<FormMainNamespace.Emits>();

const model = defineModel<Recordable>({ default: () => reactive({}) });

const { optionsMap, initOptionsMap } = useOptions();
const { availableColumns, destroyOrInit } = useFormInit();
const { setProFormItemInstance, getElFormItemInstance, getElInstance } = useFormGetInstance();

/**
 * 表单数据初始化相关逻辑
 */
function useFormInit() {
  // 计算属性：过滤掉需要销毁的表单项
  const availableColumns = computed(() => props.columns.filter(item => !destroyOrInit(item)) || []);
  // 定时器
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 初始化默认值
  const initDefaultValue = async (column: FormColumn) => {
    const { defaultValue, optionField, prop } = column;
    const modelConst = model.value;
    const value = getProp(modelConst, prop);

    // 如果有值，则不需要赋默认值
    if (!isEmpty(value)) return;

    const defaultValueConst = await formatValue<FormColumn["defaultValue"]>(defaultValue, {
      model: modelConst,
      optionsMap: optionsMap.value,
      prop,
    });

    if (!isEmpty(defaultValueConst)) return setProp(modelConst, prop, defaultValueConst);

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
  const destroyOrInit = (column: FormColumn) => {
    let destroy = unref(column.destroy) ?? false;
    if (isFunction(column.destroy)) destroy = unref(column.destroy(model.value)) ?? false;

    // 如果不销毁，则初始化表单默认值，反之则重置为空
    if (!destroy) initDefaultValue(column);
    else deleteProp(model.value, column.prop);

    return destroy;
  };

  // 监听表单结构化数组，重新组装 column
  watch(
    availableColumns,
    columns => {
      // 防抖：防止初始化时连续执行
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        const { cleanModel, notCleanModelKeys } = props;

        columns.forEach(column => {
          // 初始化枚举数据
          initOptionsMap(column.options, column.prop, { model: model.value });
        });

        // 排序表单项
        columns.sort((a, b) => a.order! - b.order!);

        if (!cleanModel) return;
        // 如果 column 对应的 prop 不存在，则删除 model 中的对应的 prop
        getObjectKeys(model.value).forEach(key => {
          const isExist = columns.some(column => column.prop === key || notCleanModelKeys?.includes(key));
          if (!isExist) deleteProp(model.value, key);
        });
      }, 1);
    },
    { deep: true, immediate: true }
  );

  return { availableColumns, destroyOrInit };
}

/**
 * 表单组件实例初始化和获取
 */
function useFormGetInstance() {
  // 存储表单组件实例
  const proFormItemInstances = shallowRef<Record<string, ProFormItemInstance>>({});

  // 存储 ProFormItem 的实例
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

const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

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
  const { colProps } = props;
  return {
    span: 24, // 默认 2 个表单占满一行
    ...colProps,
    ...toValue(column.colProps),
  };
};

const expose = {
  optionsMap,
  destroyOrInit,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(expose);
</script>

<template>
  <slot :isHidden :setProFormItemInstance :optionsMap>
    <el-row v-if="flexLayout" v-bind="{ gutter: 20, ...rowProps }">
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
          :show-label="column.showLabel ?? showLabel"
          :width="column.width ?? width"
          :editable="column.editable ?? editable"
          :options="optionsMap.get(column.optionsProp || column.prop)"
          @change="handleChange"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </ProFormItem>
      </el-col>
    </el-row>

    <template v-else v-for="column in availableColumns" :key="column.prop">
      <ProFormItem
        v-show="!isHidden(column)"
        :ref="el => setProFormItemInstance(el, column.prop)"
        v-bind="column"
        v-model="model"
        :clearable="column.clearable ?? clearable"
        :show-label="column.showLabel ?? showLabel"
        :width="column.width ?? width"
        :editable="column.editable ?? editable"
        :options="optionsMap.get(column.optionsProp || column.prop)"
        @change="handleChange"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </ProFormItem>
    </template>
  </slot>
</template>
