<script setup lang="ts">
import type { IconifyIcon } from "@iconify/vue";
import { computed, getCurrentInstance, onMounted, ref, type Component } from "vue";

defineOptions({ name: "MaterialInput" });

interface MaterialInputProps {
  type?: string;
  id?: string;
  icon?: string | IconifyIcon | Component;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  minlength?: number;
  maxlength?: number;
  validateEvent?: boolean;
  activeColor?: string;
  theme?: string;
}

const props = withDefaults(defineProps<MaterialInputProps>(), {
  type: "text",
  id: "",
  icon: "",
  name: "",
  placeholder: "",
  readonly: false,
  disabled: false,
  required: true,
  autoComplete: "off",
  min: 0,
  max: 10000,
  step: 1,
  minlength: 0,
  maxlength: 20,
  validateEvent: true,
  activeColor: "#2196f3",
  theme: "",
});

type MaterialInputEmits = {
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
};
const emits = defineEmits<MaterialInputEmits>();

const focus = ref(false);
const valueCopy = defineModel<string>({ required: true });

const themeColor = computed(() => {
  const theme = props.theme;
  if (theme === "blue") {
    return "#2196f3";
  } else if (theme === "grey") {
    return "#9e9e9e";
  } else if (theme === "grey-light") {
    return "#e0e0e0";
  } else if (theme === "red") {
    return "#f44336";
  }
  return "";
});
const computedClasses = computed(() => ({
  "material--active": focus.value,
  "material--disabled": props.disabled,
  "material--raised": Boolean(focus.value || valueCopy.value),
}));

const filledPlaceholder = computed(() => {
  if (focus.value) {
    return props.placeholder;
  }
  return "";
});

onMounted(() => {
  const activeColor = themeColor.value ? themeColor.value : props.activeColor;
  document.styleSheets[0].insertRule(
    `.material-input-component.material--active .material-label { color: ${activeColor} !important}`,
    0
  );
});

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  valueCopy.value = value;
  const instance = getCurrentInstance();
  if ((instance?.parent as any).type.name === "ElFormItem") {
    if (props.validateEvent) {
      // See https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue#L293
      (instance?.parent as any).emit("el.form.change", [value]);
    }
  }
};

const handleFocus = (event: FocusEvent) => {
  focus.value = true;
  emits("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  focus.value = false;
  emits("blur", event);
  const instance = getCurrentInstance();
  if ((instance?.parent as any).type.name === "ElFormItem") {
    if (props.validateEvent) {
      // See https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue#L292
      (instance?.parent as any).$emit("el.form.blur", [valueCopy.value]);
    }
  }
};
</script>

<template>
  <div :class="computedClasses" class="material-input-component">
    <div :class="{ iconClass: icon }">
      <Icon v-if="icon" :icon="icon" class="material-input__icon" />
      <input
        v-if="type === 'email'"
        :id="id"
        v-model="valueCopy"
        type="email"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'url'"
        :id="id"
        v-model="valueCopy"
        type="url"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'number'"
        :id="id"
        v-model="valueCopy"
        type="number"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :step="step"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'password'"
        :id="id"
        v-model="valueCopy"
        type="password"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :step="step"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'tel'"
        :id="id"
        v-model="valueCopy"
        type="tel"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'text'"
        :id="id"
        v-model="valueCopy"
        type="text"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <span class="material-input-bar" />
      <label class="material-label">
        <slot />
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
