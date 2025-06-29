<script setup lang="ts">
import type { ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { ProFormStepsEmits, ProFormStepsProps } from "./types";
import { ProForm } from "@/components/pro/form";
import { useNamespace } from "@/composables";

import "./index.scss";

defineOptions({ name: "ProFormSteps" });

const props = withDefaults(defineProps<ProFormStepsProps>(), {
  columns: () => [],
  submitText: "提交",
  nextText: "下一步",
  preText: "上一步",
});

const emits = defineEmits<ProFormStepsEmits>();

const ns = useNamespace("pro-form-steps");

const stepIndexModel = defineModel({ default: 1 });
const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");
const active = ref<number>(1);

const currentIndex = computed(() => active.value - 1);

watchEffect(() => (active.value = stepIndexModel.value));

const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

/**
 * 点击上一步事件
 */
const pre = () => {
  if (active.value-- > props.columns.length + 1) active.value = 1;
  stepIndexModel.value = active.value;

  emits("pre", active.value);
};

/**
 * 点击下一步事件
 */
const next = (model: Recordable) => {
  const currentActive = active.value;

  active.value = Math.min(currentActive + 1, props.columns.length);

  stepIndexModel.value = active.value;

  const allModel = props.columns?.reduce((pre, current) => ({ ...pre, ...current.form?.modelValue }), {});

  emits("next", active.value, model, allModel);

  if (currentActive === props.columns.length && active.value === props.columns.length) {
    emits("submit", active.value, model, allModel);
  }
};

const expose = { proFormInstance, pre, next };

defineExpose(expose);
</script>

<template>
  <div :class="ns.b()">
    <el-steps :active="active" finish-status="success" v-bind="$attrs">
      <el-step v-for="item in columns" :key="item.title" v-bind="item">
        <template v-if="$slots.icon" #icon>
          <slot name="icon" :icon="item.icon" :title="item.title" :description="item.description" />
        </template>

        <template v-if="$slots.title" #title>
          <slot name="title" :icon="item.icon" :title="item.title" :description="item.description" />
        </template>

        <template v-if="$slots.description" #description>
          <slot name="description" :icon="item.icon" :title="item.title" :description="item.description" />
        </template>
      </el-step>
    </el-steps>

    <ProForm
      ref="proFormInstance"
      footer-align="left"
      v-bind="columns[currentIndex]?.form"
      @update:model-value="
        value => {
          const column = columns[currentIndex];
          if (column?.form) column.form.modelValue = value;
        }
      "
      :submit-text="active === columns.length ? submitText : nextText"
      :reset-text="preText"
      @submit="next"
      @reset="pre"
      @change="handleChange"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProForm>
  </div>
</template>
