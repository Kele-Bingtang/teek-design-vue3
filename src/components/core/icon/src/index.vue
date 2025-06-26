<script setup lang="ts">
import type { IconProps } from "./icon";
import { useSlots, computed, toRaw } from "vue";
import { useNamespace } from "@/composables";
import { addUnit, isString } from "@/common/utils";
import SvgIcon from "./components/svg-icon.vue";
import FontIcon from "./components/font-icon.vue";
import IconifyOffline from "./components/iconify-offline.vue";
import IconifyOnline from "./components/iconify-online.vue";

defineOptions({ name: "Icon" });

const { icon = "", iconType, color, hover = false, hoverColor, pointer = false, ...props } = defineProps<IconProps>();

const ns = useNamespace("icon");
const slot = useSlots();

const getStyle = () => {
  return {
    ...props.style,
    ...(pointer ? { cursor: "pointer" } : undefined),
    "--icon-color": color,
    "--icon-size": props.size && addUnit(props.size),
    "--icon-color-hover": hoverColor,
  };
};

/**
 * 当 props.icon 为字符串时，支持传入修饰符来代替 props.iconType
 *
 * 1、icon 为 img- 或 IMG- 开头，则默认为 img
 * 2、icon 为 if- 或 IF- 开头，则默认为 iconfont
 * 3、icon 为 uni- 或 UNI- 开头，则默认为 unicode
 * 4、icon 为 sym- 或 SYM- 开头，则默认为 symbol
 * 5、icon 为 svg- 或 SVG- 开头，则默认为 svg
 */
const finalIcon = computed<any>(() => {
  if (!isString(icon)) return toRaw(icon);
  return icon.replace(/^(svg-|if-|uni-|sym-|img-)/i, "");
});

const getFontIconType = () => {
  if (iconType && ["unicode", "iconfont", "symbol"].includes(iconType)) {
    return iconType as unknown as "unicode" | "iconfont" | "symbol";
  }

  if (!isString(icon)) return;

  if (icon.toLowerCase().startsWith("if-")) return "iconfont";
  if (icon.toLowerCase().startsWith("uni-")) return "unicode";
  if (icon.toLowerCase().startsWith("sym-")) return "symbol";

  if (icon.startsWith("&#xe")) return "unicode";
};

const isSvgIcon = () =>
  isString(icon) && (iconType === "svg" || icon.startsWith("<svg") || icon.startsWith("svg-") || isString(icon));
const isFontIcon = () => isString(icon) && !!getFontIconType();
const isComponent = () =>
  !isString(icon) &&
  (iconType === "component" ||
    (typeof icon === "object" && ("setup" in icon || "render" in icon)) ||
    typeof icon === "function");
const isIconifyOffline = () => !isString(icon) && (iconType === "iconifyOffline" || "body" in icon);
const isIconifyOnline = () => isString(icon) && (iconType === "iconifyOnline" || icon.includes(":"));
const isImg = () => isString(icon) && (iconType === "img" || icon.toLowerCase().startsWith("img-"));
</script>

<template>
  <i :class="[ns.b(), ns.is('hover', hover)]" :style="getStyle()">
    <template v-if="slot.default">
      <slot />
    </template>

    <template v-else-if="isComponent()">
      <component :is="finalIcon" :size />
    </template>

    <img v-else-if="isImg()" :src="finalIcon" :alt="imgAlt" />
    <FontIcon v-else-if="isFontIcon()" :icon="finalIcon" :iconType="getFontIconType()!" />
    <IconifyOffline v-else-if="isIconifyOffline()" :icon="finalIcon" />
    <IconifyOnline v-else-if="isIconifyOnline()" :icon="finalIcon" />
    <SvgIcon v-else-if="isSvgIcon()" :icon="finalIcon" />
  </i>
</template>

<style lang="scss">
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/namespace" as *;

@include b(icon) {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-size, 1em);
  height: var(--icon-size, 1em);
  font-size: var(--icon-size, inherit);
  line-height: 1em;
  color: var(--icon-color, inherit);
  fill: var(--icon-color, currentColor);
  transition: color var(--#{$el-namespace}-transition-duration);

  svg {
    width: var(--icon-size, 1em);
    height: var(--icon-size, 1em);
    vertical-align: middle;
    fill: currentcolor;

    &:focus {
      outline: none;
    }
  }

  .iconfont {
    font-size: var(--icon-size, 1em);
    color: var(--icon-color, inherit);
  }

  @include is(hover) {
    &:hover {
      svg,
      i {
        color: var(--icon-color-hover, inherit);
      }
    }
  }
}
</style>
