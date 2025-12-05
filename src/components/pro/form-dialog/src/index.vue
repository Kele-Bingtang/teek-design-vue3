<script setup lang="ts">
import type { ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { ProFormDialogEmits, ProFormDialogProps } from "./types";
import { useTemplateRef, reactive } from "vue";
import { ProForm } from "@/components/pro/form";
import { ProDialog } from "@/components/pro/dialog";

defineOptions({ name: "ProFormDialog" });

withDefaults(defineProps<ProFormDialogProps>(), {
  dialog: () => ({}),
  form: () => ({}),
});

const emits = defineEmits<ProFormDialogEmits>();

const model = defineModel<Recordable>({ default: () => reactive({}) });
const dialogVisible = defineModel("visible", { default: false });

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
  const isValid = await proFormInstance.value?.handleSubmit();
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
 * 打开弹窗
 */
const open = () => (dialogVisible.value = true);
/**
 * 关闭弹窗
 */
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
    <template v-if="$slots['dialog-footer']" #footer>
      <slot name="dialog-footer" v-bind="{ handleConfirm, handleCancel }" />
    </template>

    <template v-if="$slots['dialog-footer-before']" #footer-before>
      <slot name="dialog-footer-before" v-bind="{ handleConfirm, handleCancel, model }" />
    </template>

    <template v-if="$slots['dialog-footer-after']" #footer-after>
      <slot name="dialog-footer-after" v-bind="{ handleConfirm, handleCancel, model }" />
    </template>

    <template
      v-for="slot in Object.keys($slots).filter(key => !['footer', 'footer-before', 'footer-after'].includes(key))"
      #[slot]="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>

    <ProForm
      ref="proFormInstance"
      v-model="model"
      :show-footer="false"
      style="padding: 10px"
      v-bind="form"
      @change="handleChange"
    >
      <template v-if="$slots['form-footer']" #footer="{ handleSubmit, handleReset }">
        <slot name="form-footer" v-bind="{ handleSubmit, handleReset, model }" />
      </template>

      <template v-if="$slots['form-footer-before']" #footer-before>
        <slot name="form-footer-before" v-bind="{ handleConfirm, handleCancel, model }" />
      </template>

      <template v-if="$slots['form-footer-after']" #footer-after>
        <slot name="form-footer-after" v-bind="{ handleConfirm, handleCancel, model }" />
      </template>

      <template
        v-for="slot in Object.keys($slots).filter(key => !['footer', 'footer-before', 'footer-after'].includes(key))"
        #[slot]="scope"
      >
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProForm>
  </ProDialog>
</template>
