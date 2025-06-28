<template>
  <Codemirror
    ref="codemirrorInstance"
    v-model:value="code"
    :options="cmOptions"
    @blur="onCmBlur"
    @paste="onPaste"
  ></Codemirror>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/lib/codemirror.css";
// 编辑器代码格式
import "codemirror/mode/properties/properties.js";
import "codemirror/addon/display/autorefresh";
import "./config";
import "./theme";
import "./mode";

defineOptions({ name: "CodeMirror" });

interface CodeMirrorProps {
  modelValue?: string;
  cmTheme?: string;
  cmMode?: string;
  cmIndentUnit?: number;
  autoFormatJson?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  modelValue: "",
  cmTheme: "idea",
  cmMode: "application/json",
  cmIndentUnit: 2,
  autoFormatJson: false,
  readonly: false,
});

type CodeMirrorEmits = {
  "update:modelValue": [value: string];
  "on-blur": [value: string];
  "on-paste": [currentValue: string, oldVal: string];
};

const emits = defineEmits<CodeMirrorEmits>();

const codemirrorInstance = useTemplateRef("codemirrorInstance");
const code = computed({
  get() {
    return props.modelValue || "";
  },
  set(value) {
    emits("update:modelValue", value);
  },
});

// const cm = computed(() => codemirrorInstance.value.codemirror);

const cmOptions = computed(() => ({
  theme: props.cmTheme, // 主题
  mode: props.cmMode, // 代码格式
  tabSize: props.cmIndentUnit, // tab 的空格个数
  indentUnit: props.cmIndentUnit, // 一个代码块应缩进多少个空格，应该与 tabSize 保证一直
  smartIndent: true, // 是否智能缩进
  autocorrect: true, // 自动更正
  spellcheck: true, // 拼写检查
  // lint: true, // 检查格式
  lineNumbers: true, // 是否显示行数
  lineWrapping: true, // 是否自动换行
  styleActiveLine: true, // 当前行高亮
  readOnly: props.readonly, // 只读
  // keyMap: 'sublime',  // sublime 编辑器效果
  matchBrackets: true, // 括号匹配提示
  autorefresh: true, // 自动刷新
  autoCloseBrackets: true, // 在键入时将自动关闭括号和引号
  matchTags: { bothTags: true }, // 将突出显示光标周围的标签
  foldGutter: true, // 可将对象折叠，与下面的 gutters 一起使用
  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  highlightSelectionMatches: {
    minChars: 2,
    style: "matchhighlight",
    showToken: true,
  },
  extraKeys: { Ctrl: "autocomplete" }, // 可以用于为编辑器指定额外的键绑定，以及 keyMap 定义的键绑定
}));

onMounted(() => {
  onPaste();
});

const onCmBlur = (cm: any) => {
  const editorValue = cm.getValue();
  if (cmOptions.value.mode === "application/json" && editorValue) {
    if (!props.autoFormatJson) {
      return;
    }
    code.value = formatStrInJson(editorValue);
  }
  emits("on-blur", code.value);
};

// 重置检查格式
// const resetLint = () => {
//   if (!cm.value.getValue()) {
//     nextTick(() => {
//       cm.value.setOption("lint", false);
//     });
//     return;
//   }
//   cm.value.setOption("lint", false);
//   nextTick(() => {
//     cm.value.setOption("lint", true);
//   });
// };

// const onKeyDown = (event: any) => {
//   const keyCode = event.keyCode || event.which || event.charCode;
//   const keyCombination = event.ctrlKey || event.altKey || event.metaKey;
//   if (!keyCombination && keyCode > 64 && keyCode < 123) {
//     cm.value.showHint({ completeSingle: false });
//   }
// };

// const onMouseDown = () => {
//   cm.value.closeHint();
// };

const onPaste = () => {
  if (cmOptions.value.mode === "application/json") {
    const oldCode = code.value;
    emits("update:modelValue", formatStrInJson(code.value));
    emits("on-paste", code.value, oldCode);
  }
};

const formatStrInJson = (strValue: string) => {
  return JSON.stringify(JSON.parse(strValue), null, props.cmIndentUnit);
};
</script>
