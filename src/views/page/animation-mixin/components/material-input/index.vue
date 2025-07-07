<script setup lang="ts">
import type { MaterialInputEmits, MaterialInputProps } from "./types";
import { computed, ref } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "MaterialInput" });

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
  minLength: 0,
  maxLength: 20,
  activeColor: "",
  theme: "primary",
  elForm: null,
  validateTrigger: "blur",
});

const emits = defineEmits<MaterialInputEmits>();

const ns = useNamespace("material-input");

const focus = ref(false);

// 输入框的值
const modelValue = defineModel<string>({ required: true });

// 主题颜色
const themeColor = computed(() => {
  const theme = props.theme;
  if (theme === "primary") return ns.cssVarEl("color-primary");
  if (theme === "danger") return ns.cssVarEl("color-danger");
  if (theme === "success") return ns.cssVarEl("color-success");
  if (theme === "red") return ns.cssVarEl("color-red");
  if (theme === "error") return ns.cssVarEl("color-error");
  if (theme === "grey") return ns.cssVar("text-gray-600");
  if (theme === "grey-light") return ns.cssVar("text-gray-400");

  // 自行添加更多主题颜色
  return "";
});

/**
 * 计算填充的占位符
 */
const filledPlaceholder = computed(() => {
  if (focus.value) return props.placeholder;
  return "";
});

/**
 * 处理输入事件
 */
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  modelValue.value = value;
  emits("input", event);
  if (props.elForm && props.validateTrigger === "change") props.elForm.validateField(props.name);
};

/**
 * 处理聚焦事件
 */
const handleFocus = (event: FocusEvent) => {
  focus.value = true;
  emits("focus", event);
};

/**
 * 处理失去焦点事件
 */
const handleBlur = (event: FocusEvent) => {
  focus.value = false;
  emits("blur", event);
  if (props.elForm && props.validateTrigger === "blur") props.elForm.validateField(props.name);
};
</script>

<template>
  <div
    ref="inputInstance"
    :class="[
      ns.b(),
      ns.has('icon', !!icon),
      ns.is('disabled', disabled),
      ns.is('active', focus),
      ns.is('raised', Boolean(focus || modelValue)),
    ]"
    :style="{ [ns.cssVarName('active-color')]: activeColor || themeColor }"
  >
    <Icon v-if="icon" :icon="icon" :class="ns.e('icon')" />
    <input
      v-if="type === 'email'"
      :id="id"
      v-model="modelValue"
      type="email"
      :class="ns.e('input')"
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
      v-model="modelValue"
      type="url"
      :class="ns.e('input')"
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
      v-model="modelValue"
      type="number"
      :class="ns.e('input')"
      :name="name"
      :placeholder="filledPlaceholder"
      :readonly="readonly"
      :disabled="disabled"
      :autocomplete="autoComplete"
      :max="max"
      :min="min"
      :step="step"
      :minLength="minLength"
      :maxLength="maxLength"
      :required="required"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    />
    <input
      v-if="type === 'password'"
      :id="id"
      v-model="modelValue"
      type="password"
      :class="ns.e('input')"
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
      v-model="modelValue"
      type="tel"
      :class="ns.e('input')"
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
      v-model="modelValue"
      type="text"
      :class="ns.e('input')"
      :name="name"
      :placeholder="filledPlaceholder"
      :readonly="readonly"
      :disabled="disabled"
      :autocomplete="autoComplete"
      :minLength="minLength"
      :maxLength="maxLength"
      :required="required"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    />

    <span :class="ns.e('bar')" />
    <label :class="ns.e('label')">
      <slot />
    </label>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
