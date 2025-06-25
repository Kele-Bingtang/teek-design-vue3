<script setup lang="ts">
import { onMounted } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "TextHoverEffect" });

const ns = useNamespace("link-hover");
const blockClass = ns.b();

interface TextHoverEffectProps {
  className?: string;
  text?: string;
  initColor?: string;
  hoverColor?: string;
}
const props = withDefaults(defineProps<TextHoverEffectProps>(), {
  className: "",
  text: "",
  initColor: "#4dd9d5",
  hoverColor: "#3888fa",
});

onMounted(() => {
  document.styleSheets[0].insertRule(`.${blockClass}::before { background: ${props.hoverColor} !important}`, 0);
  document.styleSheets[0].insertRule(`.${blockClass} span::before { color: ${props.hoverColor} !important}`, 0);
});
</script>

<template>
  <a :class="[blockClass, className]" :style="{ color: initColor }" href="#">
    <slot>
      {{ text }}
    </slot>
    <span :data-letters="text" />
    <span :data-letters="text" />
  </a>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(link-hover) {
  position: relative;
  display: inline-block;
  overflow: hidden;
  font-family: Dosis, sans-serif;
  font-weight: 800;
  line-height: 1;
  color: #4dd9d5;
  text-decoration: none;
  outline: none;
  transition: color 0.5s 0.25s;

  &:hover {
    color: transparent !important;
    transition: none;

    &::before {
      transform: translate3d(100%, 0, 0);
    }
  }

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 6px;
    margin: -3px 0 0;
    content: "";
    background: var(--theme-color);
    transform: translate3d(-100%, 0, 0);
    transition: -webkit-transform 0.4s;
    transition: transform 0.4s;
    transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    overflow: hidden;

    &::before {
      position: absolute;
      left: 0;
      width: 100%;
      color: var(--theme-color);
      content: attr(data-letters);
      transition: -webkit-transform 0.5s;
      transition: transform 0.5s;
    }

    &:nth-child(2) {
      top: 50%;
    }

    &:first-child::before {
      top: 0;
      transform: translate3d(0, 100%, 0);
    }

    &:nth-child(2)::before {
      bottom: 0;
      transform: translate3d(0, -100%, 0);
    }
  }

  &:hover span::before {
    transform: translate3d(0, 0, 0);
    transition-delay: 0.3s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
  }
}
</style>
