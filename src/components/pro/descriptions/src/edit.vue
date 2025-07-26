<script setup lang="ts">
import type { FormColumn, ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { EditProps, EditEmits } from "./types";
import { computed, ref, useTemplateRef, watch, nextTick } from "vue";
import { setProp } from "@/components/pro/helper";
import ProForm from "@/components/pro/form";

defineOptions({ name: "DescriptionsEdit" });

const props = withDefaults(defineProps<EditProps>(), {
  prop: "",
  value: undefined,
  formProps: () => ({}),
});

const emits = defineEmits<EditEmits>();

const model = defineModel<Recordable>({ default: () => ({}) });

const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");

// 计算 ProForm 需要的配置项
const columns = computed(() => {
  const { options } = props;
  return [{ ...props, options: options ? ref(options) : options, value: undefined, editable: true }] as FormColumn[];
});

// 父级数据改变后触发子级数据改变
watch(
  () => props.value,
  async val => {
    await nextTick();
    setProp(model.value, props.prop, val);
  },
  { immediate: true }
);

/**
 * 表单值改变事件
 */
const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

defineExpose({ proFormInstance });
</script>

<template>
  <ProForm
    ref="proFormInstance"
    :columns
    v-model="model"
    :show-label="false"
    :show-footer="false"
    :flex-layout="false"
    v-bind="formProps"
    @change="handleChange"
  />
</template>
