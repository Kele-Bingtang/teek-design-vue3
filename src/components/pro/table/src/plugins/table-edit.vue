<script setup lang="ts">
import type { ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps, ModelBaseValueType } from "@/components/pro/form-item";
import type { TableEditProps } from "../types";
import { getProp, setProp } from "@/components/pro/helper";
import ProForm from "@/components/pro/form";

defineOptions({ name: "TableEdit" });

interface TableEditEmits {
  change: [model: ModelBaseValueType, column: FormItemColumnProps];
}

const props = withDefaults(defineProps<TableEditProps>(), {
  prop: "",
  value: undefined,
});

const emits = defineEmits<TableEditEmits>();

const model = ref<Recordable>({});

const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");

const columns = computed(() => {
  const { options } = props;
  return [{ ...props, options: options ? ref(options) : options, value: undefined, editable: true }];
});

watch(
  () => props.value,
  val => setProp(model.value, props.prop, val),
  { immediate: true }
);

const handleChange = (model: ModelBaseValueType, column: FormItemColumnProps) => {
  emits("change", getProp(model as Recordable, props.prop), column);
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
    :use-flex-layout="false"
    :el-form-props="{
      hideRequiredAsterisk: true,
    }"
    @change="handleChange"
  />
</template>
