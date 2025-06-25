<script lang="tsx">
import { defineComponent, type PropType, computed, h } from "vue";
import { useNamespace } from "@/composables";

const ns = useNamespace();

export default defineComponent({
  name: "Highlight",
  props: {
    tag: {
      type: String,
      default: "span",
    },
    keys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    color: {
      type: String,
      default: `var(--${ns.elNamespace}-color-primary)`,
    },
  },

  emits: ["click"],

  setup(props, { emit, slots }) {
    const keyNodes = computed(() => {
      return props.keys.map(key => {
        return h(
          "span",
          {
            onClick: () => {
              emit("click", key);
            },
            style: {
              color: props.color,
              cursor: "pointer",
            },
          },
          key
        );
      });
    });

    /**
     * @description 匹配高亮的文本，将其置为特殊字符，方便后续进行替换
     */
    const parseText = (text: string) => {
      props.keys.forEach((key, index) => {
        const regexp = new RegExp(key, "g");
        text = text.replace(regexp, `{{${index}}}`);
      });
      return text.split(/{{|}}/);
    };

    /**
     * @description 渲染文本
     */
    const renderText = () => {
      if (!slots?.default) return null;
      const node = slots?.default()[0].children;

      if (!node) return slots?.default()[0];

      const textArray = parseText(node as string);
      const regexp = /^[0-9]*$/;
      const nodes = textArray.map(t => {
        if (regexp.test(t)) return keyNodes.value[t as any] || t;
        return t;
      });
      return h(props.tag, nodes);
    };

    return () => renderText();
  },
});
</script>
