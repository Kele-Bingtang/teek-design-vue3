<script setup lang="ts">
import type { ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { ProFormDialogEmits, ProFormDialogProps } from "./types";
import { ProForm } from "@/components/pro/form";
import { ProDialog } from "@/components/pro/dialog";

defineOptions({ name: "ProFormDialog" });

withDefaults(defineProps<ProFormDialogProps>(), {
  dialog: () => ({}),
  form: () => ({}),
});

const emits = defineEmits<ProFormDialogEmits>();

const model = defineModel<Recordable>({ default: () => ({}) });
const dialogVisible = defineModel("visible", { default: false });

const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");

const handleChange = (model: Recordable, column: FormItemColumnProps) => {
  emits("change", model, column);
};

const handleConfirm = async () => {
  const isValid = await proFormInstance.value?.submitForm();
  if (isValid) emits("confirm", model.value);
};

const handleCancel = () => {
  close();
  emits("cancel");
};

const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

const expose = { proFormInstance, handleConfirm, handleCancel, open, close };

defineExpose(expose);
</script>

<template>
  <ProDialog
    v-model="dialogVisible"
    draggable
    v-bind="{ ...dialog, onConfirm: undefined, onCancel: undefined }"
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

    <ProForm ref="proFormInstance" v-model="model" v-bind="form" :show-footer="false" @change="handleChange">
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProForm>
  </ProDialog>
</template>
