<script setup lang="ts">
import type { ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { ProFormDrawerEmits, ProFormDrawerProps } from "./types";
import { ProForm } from "@/components/pro/form";
import { ProDrawer } from "@/components/pro/drawer";

defineOptions({ name: "ProFormDrawer" });

withDefaults(defineProps<ProFormDrawerProps>(), {
  drawer: () => ({}),
  form: () => ({}),
});

const emits = defineEmits<ProFormDrawerEmits>();

const model = defineModel<Recordable>({ default: () => ({}) });
const drawerVisible = defineModel("visible", { default: false });

const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");

/**
 * 表单值改变事件
 */
const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

/**
 * 确认按钮点击事件
 */
const handleConfirm = async () => {
  const isValid = await proFormInstance.value?.submitForm();
  if (isValid) emits("confirm", model.value);
};

/**
 * 取消按钮点击事件
 */
const handleCancel = () => {
  close();
  emits("cancel");
};

/**
 * 打开抽屉
 */
const open = () => (drawerVisible.value = true);
/**
 * 关闭抽屉

 */
const close = () => (drawerVisible.value = false);

const expose = { proFormInstance, handleConfirm, handleCancel, open, close };

defineExpose(expose);
</script>

<template>
  <ProDrawer
    v-model="drawerVisible"
    draggable
    v-bind="{ ...drawer, onConfirm: undefined, onCancel: undefined }"
    @confirm="handleConfirm"
    @close="handleCancel"
  >
    <template v-if="$slots['header']" #header>
      <slot name="header" />
    </template>

    <template v-if="$slots['header-title']" #header-title>
      <slot name="header-title" />
    </template>

    <template v-if="$slots['fullscreen-icon']" #fullscreen-icon>
      <slot name="fullscreen-icon" />
    </template>

    <template v-if="$slots['footer']" #footer>
      <slot name="footer" v-bind="{ handleConfirm, handleCancel }" />
    </template>

    <ProForm
      ref="proFormInstance"
      v-model="model"
      :col-props="{ span: 24 }"
      v-bind="form"
      :show-footer="false"
      @change="handleChange"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProForm>
  </ProDrawer>
</template>
