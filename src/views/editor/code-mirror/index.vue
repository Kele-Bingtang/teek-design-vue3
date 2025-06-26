<script setup lang="ts" name="CodeMirrorDemo">
import { CodeMirror, type MergeCodeMirrorProps } from "@/components";
import { computed, ref } from "vue";
// 如果需要更多主题，可以查看开源项目 https://uiwjs.github.io/react-codemirror/#/theme/home，或者自行搜索其他开源项目，或者自定义主题
import { oneDark } from "@codemirror/theme-one-dark";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";

// 组件为了 Demo，下载并引入了多种语言，实际根据自己的选择依赖
import { javascript, esLint } from "@codemirror/lang-javascript";
// 搭配 lang-javascript 使用
import * as eslintLinter from "eslint-linter-browserify";
import globals from "globals";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import oldDoc from "../code-diff-editor/oldDoc.json";
import newDoc from "../code-diff-editor/newDoc.json";
import { useNamespace } from "@/composables";

const ns = useNamespace();

const code = ref('const a = "codeMirror"\nconst b = "kbt"\n\n\n\n\n\n\n\n\n\nconst getCode = () => "useCodeMirror"');
const theme = ref("default");
const lang = ref("javascript");
const disabled = ref(false);
const readonly = ref(false);
const wrap = ref(true);
const gutter = ref(false);

const revertControls = ref(false);
const highlight = ref(true);
const gutter1 = ref(true);
const orientation = ref(true);
const header = ref(true);
const height1 = ref("");
const height2 = ref("");
const maxHeight1 = ref("");
const maxHeight2 = ref("");

const mergeConfig = computed<MergeCodeMirrorProps>(() => {
  return {
    oldDoc: JSON.stringify(oldDoc, null, 2),
    newDoc: JSON.stringify(newDoc, null, 2),
    revertControls: revertControls.value,
    highlight: highlight.value,
    gutter: gutter1.value,
    orientation: orientation.value ? "a-b" : "b-a",
    header: header.value,
  };
});

/**
 * 主题
 */
const themeValue = computed(() => {
  if (theme.value === "oneDark") return oneDark;
  if (theme.value === "dracula") return dracula;
  if (theme.value === "xcodeLight") return xcodeLight;
  if (theme.value === "xcodeDark") return xcodeDark;
  return undefined;
});

// esLint Demo See https://github.com/UziTech/eslint-linter-browserify/blob/2f6d96e7cbe9f3d565bb5c9462ab78a9394c3189/example/script.js
const config = {
  languageOptions: {
    globals: { ...globals.node },
    parserOptions: { ecmaVersion: "2024", sourceType: "module" },
  },
  rules: {
    semi: ["error", "never"],
  },
};

/**
 * 代码语言
 */
const langValue = computed(() => {
  if (["js", "javascript"].includes(lang.value)) {
    return { lang: javascript(), linter: esLint(new eslintLinter.Linter(), config) };
  }

  if (["ts", "typescript"].includes(lang.value)) {
    return {
      lang: javascript({ jsx: false, typescript: true }), // jsx 可以开启变成 tsx
      linter: esLint(new eslintLinter.Linter(), config),
    };
  }

  if (lang.value === "json") return { lang: json(), linter: jsonParseLinter() };
  if (lang.value === "html") return { lang: html() };
  if (["md", "markdown"].includes(lang.value)) return { lang: markdown() };
  if (lang.value === "php") return { lang: php() };
  if (lang.value === "python") return { lang: python() };
  if (lang.value === "sql") return { lang: sql() };
  if (lang.value === "xml") return { lang: xml() };
  return {};
});

const themeOptions = [
  { label: "default", value: "default" },
  { label: "oneDark", value: "oneDark" },
  { label: "dracula", value: "dracula" },
  { label: "xcodeLight", value: "xcodeLight" },
  { label: "xcodeDark", value: "xcodeDark" },
];

const langOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSON", value: "json" },
  { label: "HTML", value: "html" },
  { label: "Markdown", value: "markdown" },
  { label: "PHP", value: "php" },
  { label: "Python", value: "python" },
  { label: "SQL", value: "sql" },
  { label: "XML", value: "xml" },
];
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <el-link
          href="https://codemirror.net/"
          target="_blank"
          underline="never"
          style="margin-bottom: 10px; font-size: 22px"
        >
          CodeMirror 代码编辑器
        </el-link>
        <el-alert :closable="false">
          如果对 CodeMirror
          的对比功能不满意，可以去看代码对比器（该菜单下方），这组件专门针对代码的对比功能，多了如统计信息、更细节对比、空格去除等功能，但是少了代码替换功能
        </el-alert>
      </template>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div style="font-weight: bold">基本编辑器</div>
      </template>

      <el-space :size="30">
        <el-select v-model="theme" style="width: 200px">
          <el-option v-for="item in themeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="lang" style="width: 200px">
          <el-option v-for="item in langOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-checkbox v-model="disabled" label="是否禁用" style="margin-left: 10px" />
        <el-checkbox v-model="readonly" label="是否只读" />
        <el-checkbox v-model="wrap" label="超出屏幕宽度是否自动换行" />
        <el-checkbox v-model="gutter" label="是否开启 🔴 语法错误提示" />

        <el-input v-model="height1" placeholder="输入编辑器高度" />
        <el-input v-model="maxHeight1" placeholder="输入编辑器最大高度" />
      </el-space>

      <CodeMirror
        v-model="code"
        :local-theme="themeValue"
        :disabled="disabled"
        :readonly="readonly"
        :wrap="wrap"
        :gutter="gutter"
        :height="height1"
        :max-height="maxHeight1"
        v-bind="langValue"
      ></CodeMirror>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div style="font-weight: bold">代码对比器</div>
      </template>
      <el-space :size="20">
        <el-checkbox v-model="revertControls" label="是否支持一键替换" style="margin-left: 10px" />
        <el-checkbox v-model="highlight" label="是否下划线高亮" />
        <el-checkbox v-model="gutter1" label="是否开启线条提示" />
        <el-checkbox v-model="header" label="启用 Header" />
        <el-switch v-model="orientation" active-text="a-b" inactive-text="b-a" />
        <el-input v-model="height2" placeholder="输入编辑器高度" />
        <el-input v-model="maxHeight2" placeholder="输入编辑器最大高度" />

        <el-alert :closable="false">
          如果需要开启编辑功能，则传入 `
          <span :style="`color: var(--${ns.elNamespace}-color-primary)`">enabled: ['a', 'b']</span>
          ，代表 a、b 编辑器开启编辑功能，传入 a 则 a 开启编辑功能
        </el-alert>
      </el-space>

      <CodeMirror :wrap="wrap" :merge-config="mergeConfig" :height="height2" :max-height="maxHeight2"></CodeMirror>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="基本编辑器 配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model">代码内容。`string | Text` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="width">
          代码编辑器宽度。`string | Text` 类型，默认为 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="maxHeight">代码编辑器高度。`string` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="fontSize">字体大小。`string` 类型，默认 `"14px"`</el-descriptions-item>
        <el-descriptions-item label="localTheme">本地主题包。`Extension` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="lang">
          本地代码语言包。`LanguageSupport` 类型，默认 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="basic">
          是否导入代码编辑器常用功能。`boolean` 类型，默认 `true`
        </el-descriptions-item>
        <el-descriptions-item label="minimal">
          是否导入代码编辑器 Mini 功能。`boolean` 类型，默认 `false`。和 basic 互斥（basic 优先），导入功能少于 basic
        </el-descriptions-item>
        <el-descriptions-item label="dark">
          是否切换为暗黑主题（前提是主题支持切换）。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="placeholder">代码编辑器占位符。`string` 类型，默认 `""`</el-descriptions-item>
        <el-descriptions-item label="wrap">
          header 内容宽度超出屏幕后，是否开启自动换行。`boolean` 类型，默认 `true`
        </el-descriptions-item>
        <el-descriptions-item label="tab">是否启用 Tab 键缩进。`boolean` 类型，默认 `true`</el-descriptions-item>
        <el-descriptions-item label="tabSize">Tab 键缩进单位。`number` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="multiple">是否开启允许多选。`boolean` 类型，默认 `false`</el-descriptions-item>
        <el-descriptions-item label="lineSeparator">换行符。`string` 类型，默认 `"\n"`</el-descriptions-item>
        <el-descriptions-item label="customTheme">自定义主题。`{}` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="readonly">是否只读代码编辑器。`boolean` 类型，默认 `false`</el-descriptions-item>
        <el-descriptions-item label="disabled">是否禁用代码编辑器。`boolean` 类型，默认 `false`</el-descriptions-item>
        <el-descriptions-item label="phrases">
          自定义代码编辑器的国际化语言内容。`{}` 类型，默认 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="linter">
          代码校验器。`LintSource | any` 类型，默认 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="linterConfig">代码校验器配置项。`{}` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="forceLinting">
          是否在输入过程开始校验语法。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="gutter">
          当代码语法出错，开头是否红色圆圈 🔴 提示，前提开启 linter 属性。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="gutterConfig">语法错误配置项。`{}` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="tag">代码编辑器根标签。`string` 类型，默认 `"div"`</el-descriptions-item>
        <el-descriptions-item label="indentUnit">
          缩进单位，如 " "，缩进两个空格，" " 代表缩进四个空格。`string` 类型，默认 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="extensions">额外扩展。`Extension` 类型，默认 `undefined`</el-descriptions-item>
        <el-descriptions-item label="mergeConfig">
          代码对比编辑器配置项，传入配置项即开启。`MergeCodeMirrorProps` 类型，默认 `undefined`。详情请看「代码对比器
          mergeConfig 配置项」
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="update">
          CodeMirror 内容修改后触发。`(_value: ViewUpdate) => void`
        </el-descriptions-item>
        <el-descriptions-item label="ready">
          CodeMirror onReady 触发。`(_value: { view?: EditorView | MergeView; state?: EditorState | { a: EditorState; b:
          EditorState }; container: HTMLElement; }) => void`
        </el-descriptions-item>
        <el-descriptions-item label="focus">CodeMirror 焦点激活触发。`(_value: boolean) => void`</el-descriptions-item>
        <el-descriptions-item label="change">
          CodeMirror 状态修改触发。`(_value: EditorState) => void`
        </el-descriptions-item>
        <el-descriptions-item label="destroy">CodeMirror 销毁时触发。`() => void`</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="expose 参数 📚" :column="1" border>
        <el-descriptions-item label="editor">CodeMirror 编辑器 Ref 实例</el-descriptions-item>
        <el-descriptions-item label="view">EditorView 实例</el-descriptions-item>
        <el-descriptions-item label="cursor">光标位置</el-descriptions-item>
        <el-descriptions-item label="selection">选择的范围</el-descriptions-item>
        <el-descriptions-item label="focus">是否获得焦点</el-descriptions-item>
        <el-descriptions-item label="length">代码长度</el-descriptions-item>
        <el-descriptions-item label="json">JSON 序列化器</el-descriptions-item>
        <el-descriptions-item label="diagnosticCount">诊断字数</el-descriptions-item>
        <el-descriptions-item label="dom">内容区 DOM 元素</el-descriptions-item>
        <el-descriptions-item label="lint">语法检测函数</el-descriptions-item>
        <el-descriptions-item label="forceReconfigure">手动使配置重新生效函数</el-descriptions-item>
        <el-descriptions-item label="getRange">
          在编辑器中获取给定点之间的文本函数（下标位置而不是行号）
        </el-descriptions-item>
        <el-descriptions-item label="getLineText">获取指定行文本函数</el-descriptions-item>
        <el-descriptions-item label="lineCount">获取行数函数</el-descriptions-item>
        <el-descriptions-item label="getCursor">获取光标所在的下标位置函数</el-descriptions-item>
        <el-descriptions-item label="listSelections">获取所有当前选择的内容相关信息对象函数</el-descriptions-item>
        <el-descriptions-item label="getSelection">获取当前选择的内容函数</el-descriptions-item>
        <el-descriptions-item label="getSelections">
          获取当前选择的多行内容数组函数，一行占一个数组下标
        </el-descriptions-item>
        <el-descriptions-item label="somethingSelected">
          如果有文本被选中，返回 `true`；否则返回 `false`，检查是否有任何选择范围不为空
        </el-descriptions-item>
        <el-descriptions-item label="replaceRange">
          将文档中从 `from` 位置到 `to` 位置的文本替换为给定的 `replacement` 文本
        </el-descriptions-item>
        <el-descriptions-item label="replaceSelection">
          替换当前的选区（或选区）为给定的 `replacement` 文本。默认情况下，新选择会位于插入的文本之后
        </el-descriptions-item>
        <el-descriptions-item label="setCursor">设置光标位置到指定的 `position`</el-descriptions-item>
        <el-descriptions-item label="setSelection">
          设置单一的选取范围，其中 `anchor` 是锚点位置，`head` 是可选的头部位置。
        </el-descriptions-item>
        <el-descriptions-item label="setSelections">
          设置新的选取范围数组，至少需要一个选取。`ranges` 是选取范围数组，`primary` 是可选的主选取索引
        </el-descriptions-item>
        <el-descriptions-item label="extendSelectionsBy">
          应用提供的函数 `f` 到所有现有的选取上，并根据结果调用 `extendSelections` 方法。这允许动态扩展选取范围
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="代码对比器 mergeConfig 配置项 📚" :column="1" border>
        <el-descriptions-item label="oldDoc">旧代码。`string | Text` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="newDoc">新代码。`string | Text` 类型，默认 `""`</el-descriptions-item>
        <el-descriptions-item label="revertControls">
          新旧代码对比高亮。`boolean` 类型，默认 `true`
        </el-descriptions-item>
        <el-descriptions-item label="orientation">
          左右编辑器顺序。`"a-b" | "b-a"` 类型，默认 `"a-b"`
        </el-descriptions-item>
        <el-descriptions-item label="gutter">行代码前使用高亮竖线条。`boolean` 类型，默认 `true`</el-descriptions-item>
        <el-descriptions-item label="header">是否启用 header。`boolean` 类型，默认 `false`</el-descriptions-item>
        <el-descriptions-item label="headerBgColor">
          header 背景色。`string` 类型，默认 `"#f6f8fa"`
        </el-descriptions-item>
        <el-descriptions-item label="headerBorderColor">
          header 边框色。`string` 类型，默认 `"#d0d7de"`
        </el-descriptions-item>
        <el-descriptions-item label="leftTitle">header 左侧标题。`string` 类型，默认 `"Before"`</el-descriptions-item>
        <el-descriptions-item label="rightTitle">header 右侧标题。`string` 类型，默认 `"After"`</el-descriptions-item>
        <el-descriptions-item label="margin">
          与 minSize 互斥，指定多少个相同的代码行数不允许折叠。`number` 类型，默认 `3`
        </el-descriptions-item>
        <el-descriptions-item label="minSize">
          多少行没有区别的代码行数可以折叠。`number` 类型，默认 `4`
        </el-descriptions-item>
        <el-descriptions-item label="highlightColor">
          代码对比高亮颜色配置。详情看「highlightColor 配置项」
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="highlightColor 配置项 📚" :column="1" border>
        <el-descriptions-item label="aHighlightLineBgColor">
          a 编辑器高亮行背景色。`string` 类型，默认为 `#ffebe9`
        </el-descriptions-item>
        <el-descriptions-item label="aHighlightTextBgColor">
          a 编辑器高亮文本背景色。`string` 类型，默认 `#ff818266"`
        </el-descriptions-item>
        <el-descriptions-item label="aHighlightLineBgColor">
          b 编辑器高亮行背景色。`string` 类型，默认为 `#e6ffec`
        </el-descriptions-item>
        <el-descriptions-item label="aHighlightTextBgColor">
          b 编辑器高亮文本背景色。`string` 类型，默认 `#abf2bc"`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
