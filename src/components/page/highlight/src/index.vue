<script setup lang="ts">
import type { HighlightEmits, HighlightProps } from "./types";
import { computed, useSlots } from "vue";
import { useNamespace } from "@/composables";

const props = withDefaults(defineProps<HighlightProps>(), {
  tag: "span",
  keys: () => [],
  color: useNamespace().cssVarEl("color-primary"),
});

const emit = defineEmits<HighlightEmits>();

const slots = useSlots();

/**
 * 匹配高亮的文本，将其置为特殊字符，方便后续进行替换
 */
const parseText = (text: string) => {
  let result = text;
  props.keys.forEach((key, index) => {
    const regex = new RegExp(key, "g");
    result = result.replace(regex, `{{${index}}}`);
  });
  return result.split(/{{|}}/);
};

// 5. 生成高亮节点数组
const highlightNodes = computed(() => {
  if (!slots.default?.()?.[0]?.children) return [];

  const text = slots.default()[0].children as string;
  const segments = parseText(text);

  return segments.map(segment => {
    const index = parseInt(segment);
    return isNaN(index)
      ? { type: "text", content: segment }
      : {
          type: "highlight",
          key: props.keys?.[index] || "",
          index,
        };
  });
});
</script>

<template>
  <component :is="props.tag">
    <template v-for="(node, index) in highlightNodes" :key="index">
      <template v-if="node.type === 'text'">
        {{ node.content }}
      </template>

      <!-- 高亮关键词 -->
      <span
        v-else-if="node.type === 'highlight'"
        @click="emit('click', node.key!)"
        :style="{ color: props.color, cursor: 'pointer' }"
      >
        {{ node.key }}
      </span>
    </template>
  </component>
</template>
