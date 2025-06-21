<script setup lang="ts">
import type { DrawerProps } from "element-plus";
import type { ProFormInstance, ProFormNamespace } from "@/components/pro/form";
import type { ProDrawerProps } from "@/components/pro/drawer";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import { ProForm } from "@/components/pro/form";
import { ProDrawer } from "@/components/pro/drawer";

defineOptions({ name: "ProFormDrawer" });

export interface ProFormDrawerProps {
  visible?: boolean;
  drawer?: ProDrawerProps & Partial<DrawerProps>;
  form?: ProFormNamespace.Props & ProFormNamespace.OnEmits;
}

export interface ProFormDrawerEmits {
  change: [model: Recordable, column: FormItemColumnProps];
  confirm: [model: Recordable];
  close: [];
}

withDefaults(defineProps<ProFormDrawerProps>(), {
  drawer: () => ({}),
  form: () => ({}),
});

const emits = defineEmits<ProFormDrawerEmits>();

const model = defineModel<Recordable>({ default: () => ({}) });
const drawerVisible = defineModel("visible", { default: false });

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
  emits("close");
};

const open = () => (drawerVisible.value = true);
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
