<!-- vue-codemirror6 1.3.0 -->

<script setup lang="ts">
import { indentWithTab } from "@codemirror/commands";
import { indentUnit as indentUnitConfig, type LanguageSupport } from "@codemirror/language";
import {
  diagnosticCount as linterDagnosticCount,
  forceLinting as forceLintingFun,
  linter as linterFun,
  lintGutter,
  type Diagnostic,
  type LintSource,
} from "@codemirror/lint";
import {
  Compartment,
  EditorSelection,
  EditorState,
  StateEffect,
  type Transaction,
  type Extension,
  type SelectionRange,
  type StateField,
  type Text,
} from "@codemirror/state";
import { EditorView, keymap, placeholder as placeholderFun, type ViewUpdate } from "@codemirror/view";
import { MergeView } from "@codemirror/merge";
import { basicSetup, minimalSetup } from "codemirror";
import { useNamespace } from "@/composables";
import { addUnit } from "@/utils";
import { ref, shallowRef, computed, type Ref, type ComputedRef, watch, onMounted, nextTick, onUnmounted } from "vue";
import { FullScreen } from "@element-plus/icons-vue";

export interface MergeCodeMirrorProps {
  [key: string]: any;
  oldDoc?: string | Text; // 旧代码
  newDoc?: string | Text; // 新代码
  revertControls?: "a-to-b" | "b-to-a" | boolean; // 是否新旧代码支持一键替换
  highlight?: boolean; // 新旧代码对比高亮，默认开启 true
  orientation?: "a-b" | "b-a"; // 左右编辑器顺序，默认 "a-b"
  gutter?: boolean; // 行代码前使用高亮竖线条，默认使用 true
  enabled?: ("a" | "b" | string)[]; // 是否禁用编辑功能，默认禁用 a、b
  header?: boolean; // 是否启用 header，默认不启用 false
  headerBgColor?: string; // header 背景色，默认 "#f6f8fa"，需要开启 header
  headerBorderColor?: string; // header 边框色，默认 "#d0d7de"，需要开启 header
  leftTitle?: string; // header 左侧标题，默认 "Before"
  rightTitle?: string; // header 右侧标题，默认 "After"
  margin?: number; // 与 minSize 互斥，指定多少个相同的代码行数不允许折叠，默认为 3
  minSize?: number; // 多少行没有区别的代码行数可以折叠，默认折叠超过 4 行的代码行
  highlightColor?: {
    aHighlightLineBgColor?: string; // a 编辑器高亮行背景色，默认 #ffebe9
    aHighlightTextBgColor?: string; // a 编辑器高亮文本背景色，默认 #ff818266
    bHighlightLineBgColor?: string; // b 编辑器高亮行背景色，默认 #e6ffec
    bHighlightTextBgColor?: string; // b 编辑器高亮文本背景色，默认 #abf2bc
  };
}

export interface CodeMirrorProps {
  width?: string | number; // 代码编辑器宽度，默认 undefined
  height?: string | number; // 代码编辑器高度，默认 undefined
  maxHeight?: string | number; // 代码编辑器最大高度，默认 undefined
  fontSize?: string | number; // 字体大小，默认 14px
  localTheme?: Extension; // 本地主题包
  lang?: LanguageSupport; // 本地代码语言包
  basic?: boolean; // 是否导入代码编辑器常用功能，See https://codemirror.net/docs/ref/#codemirror.basicSetup
  minimal?: boolean; // 是否导入代码编辑器 Mini 功能，See https://codemirror.net/docs/ref/#codemirror.minimalSetup
  dark?: boolean; // 是否切换为暗黑主题（前提是主题支持切换），默认不切换 false
  placeholder?: string; // 代码编辑器占位符
  wrap?: boolean; // 内容宽度超出屏幕后，是否开启自动换行，默认开启 true
  tab?: boolean; // 是否启用 Tab 键缩进，默认开启 true
  tabSize?: number; // Tab 键缩进单位，默认 undefined
  multiple?: boolean; // 是否开启允许多选，默认不开启 false，See https://codemirror.net/docs/ref/#state.EditorState^allowMultipleSelections
  lineSeparator?: string; // 换行符，默认 "\n"
  customTheme?: Record<string, any>; // 自定义主题，See https://codemirror.net/docs/ref/#view.EditorView^theme
  readonly?: boolean; // 是否只读代码编辑器，默认不开启 false
  disabled?: boolean; // 是否禁用代码编辑器，默认不开启 false
  phrases?: Record<string, string>; // 自定义代码编辑器的国际化语言内容，See https://codemirror.net/6/examples/translate/
  linter?: LintSource | any; // 代码校验器，See https://codemirror.net/docs/ref/#lint.linter
  linterConfig?: Record<string, any>; // 代码校验器配置项，See https://codemirror.net/docs/ref/#lint.linter^config
  forceLinting?: boolean; // 是否在输入过程开始校验语法，false 则在输入完成后校验，默认不开启 false
  gutter?: boolean; // 当代码语法出错，开头是否红色圆圈 🔴 提示，前提开启 linter 属性，默认不开启 false
  gutterConfig?: Record<string, any>; // 语法错误配置项，See https://codemirror.net/docs/ref/#lint.lintGutter^config
  tag?: string; // 代码编辑器根标签，默认是 div
  indentUnit?: string; // 缩进单位，如 "  "，缩进两个空格，"    " 代表缩进四个空格
  extensions?: Extension[]; // 额外扩展
  mergeConfig?: MergeCodeMirrorProps; // 代码对比编辑器配置项，传入配置项即开启
  fullScreen?: boolean; // 是否启用全屏模式，默认不开启 false
}

defineOptions({ name: "CodeMirror6" });

const ns = useNamespace("code-mirror");

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  fontSize: 14,
  basic: true,
  minimal: false,
  wrap: true,
  tab: true,
  multiple: false,
  readonly: false,
  disabled: false,
  extensions: () => [],
  customTheme: () => ({}),
  linterConfig: () => defaultPhrases,
  forceLinting: false,
  gutter: false,
  tag: "div",
  fullScreen: true,
});

type CodeMirror6Emits = {
  /** CodeMirror update */
  update: [_value: ViewUpdate];
  /** CodeMirror onReady */
  ready: [
    _value: {
      view?: EditorView | MergeView;
      state?: EditorState | { a: EditorState; b: EditorState };
      container: HTMLElement;
    },
  ];
  /** CodeMirror onFocus */
  focus: [_value: boolean];
  /** State Changed */
  change: [_value: EditorState];
  /** CodeMirror onDestroy */
  destroy: [];
};

const emits = defineEmits<CodeMirror6Emits>();

// 编辑器 DOM 元素引用
const editorRef = useTemplateRef<HTMLElement | undefined>("editorRef");

// v-model
const doc = defineModel<string | Text>({ default: "" });
const isFullscreen = ref(false);

/**
 * CodeMirror 的 EditorEditorView
 *
 * @see {@link https://codemirror.net/docs/ref/#view.EditorView}
 */
const view = shallowRef<EditorView>(new EditorView());

const mergeView = shallowRef<MergeView>(new MergeView({ a: {}, b: {} }));

/**
 * 是否获得焦点
 *
 * @see {@link https://codemirror.net/docs/ref/#view.EditorView.hasFocus}
 */
const focus = computed<boolean>({
  get: () => view.value.hasFocus,
  set: f => {
    if (f) view.value.focus();
  },
});

/**
 * 选择范围
 *
 * @see {@link https://codemirror.net/docs/ref/#state.EditorSelection}
 */
const selection = computed<EditorSelection>({
  get: () => view.value.state.selection,
  set: s => view.value.dispatch({ selection: s }),
});

/** 光标位置 */
const cursor = computed<number>({
  get: () => view.value.state.selection.main.head,
  set: a => view.value.dispatch({ selection: { anchor: a } }),
});

/** JSON */
const json = computed<Record<string, StateField<any>>>({
  get: () => view.value.state.toJSON(),
  set: j => view.value.setState(EditorState.fromJSON(j)),
});

/** 文本长度 */
const length: Ref<number> = ref(0);

/**
 * 语法检查的诊断代码数量
 *
 * @see {@link https://codemirror.net/docs/ref/#lint.diagnosticCount}
 */
const diagnosticCount: Ref<number> = ref(0);

/** 获取 CodeMirror 的扩展 */
const extensions: ComputedRef<Extension[]> = computed(() => {
  // 配置
  // @see https://codemirror.net/examples/config/
  const language = new Compartment();
  const tabSize = new Compartment();

  return [
    // 切换基本设置
    props.basic ? basicSetup : undefined,
    // 切换最小设置
    props.minimal && !props.basic ? minimalSetup : undefined,
    // 添加监听器
    EditorView.updateListener.of((update: ViewUpdate): void => {
      // 触发焦点事件
      emits("focus", view.value.hasFocus);

      // 更新文本长度
      length.value = view.value.state.doc?.length;

      if (update.changes.empty || !update.docChanged) return; // 如果没有更改，则不触发
      if (props.linter) {
        // 代码校验处理
        if (props.forceLinting) forceLintingFun(view.value); // 如果 forceLinting 开启，第一次加载视图后校验。
        // 计算诊断数量
        diagnosticCount.value = (props.linter(view.value) as readonly Diagnostic[]).length;
      }
      emits("update", update);
    }),
    // 切换浅色/深色模式
    EditorView.theme(props.customTheme, { dark: props.dark }),
    props.localTheme ? props.localTheme : undefined,
    // 开启行宽换行
    props.wrap ? EditorView.lineWrapping : undefined,
    // 启用 Tab 键缩进
    props.tab ? keymap.of([indentWithTab]) : undefined,
    // Tab 键缩进单位
    props.indentUnit ? indentUnitConfig.of(props.indentUnit) : undefined,
    // 允许多选
    EditorState.allowMultipleSelections.of(props.multiple),
    // Tab 键缩进大小
    props.tabSize ? tabSize.of(EditorState.tabSize.of(props.tabSize)) : undefined,
    // 国际化设置
    props.phrases ? EditorState.phrases.of(props.phrases) : undefined,
    // 编辑器只读
    EditorState.readOnly.of(props.readonly),
    // 编辑器可编辑
    EditorView.editable.of(!props.disabled),
    // // 设置换行字符
    props.lineSeparator ? EditorState.lineSeparator.of(props.lineSeparator) : undefined,
    // 代码语言
    props.lang ? language.of(props.lang) : undefined,
    // 添加代码校验器
    props.linter ? linterFun(props.linter, props.linterConfig) : undefined,
    // 显示错误行的红色圆圈 🔴 提示
    props.linter && props.gutter ? lintGutter(props.gutterConfig) : undefined,
    // 编辑器占位符
    props.placeholder ? placeholderFun(props.placeholder) : undefined,
    // 添加 props 自定义扩展
    ...(props.extensions || []),
  ].filter((extension): extension is Extension => !!extension);
});

// 监听 extensions（主要是属性）变化
watch(
  extensions,
  exts => {
    // 重新更新 extensions
    view.value.dispatch({
      effects: StateEffect.reconfigure.of(exts),
    });
  },
  { immediate: true }
);

watch(
  () => props.mergeConfig,
  newConfig => {
    mergeView.value.reconfigure({
      orientation: newConfig?.orientation,
      revertControls: newConfig?.revertControls === true ? "a-to-b" : newConfig?.revertControls || undefined,
      highlightChanges: props.mergeConfig?.highlight,
      gutter: newConfig?.gutter,
    });
  },
  { immediate: true }
);

// 监听文字输入变化
watch(
  doc,
  async value => {
    if (
      view.value.composing || // IME 修复
      view.value.state.doc.toJSON().join(props.lineSeparator ?? "\n") === value // don't need to update
    ) {
      // 不要提交 CodeMirror 的存储。
      return;
    }

    view.value.dispatch({
      changes: { from: 0, to: view.value.state.doc.length, insert: value },
      selection: view.value.state.selection,
      scrollIntoView: true,
    });
  },
  { immediate: true }
);

onMounted(async () => {
  /** 初始化 Value */
  let value: string | Text = doc.value;
  if (!editorRef.value) return;
  if (editorRef.value.children[0] && !props.mergeConfig && !props.fullScreen) {
    if (doc.value !== "") {
      console.warn(
        "[CodeMirror.vue] The <code-mirror> tag contains child elements that overwrite the `v-model` values."
      );
    }
    value = (editorRef.value.childNodes[0] as HTMLElement).innerText?.trim();
  }

  // 如果开启代码对比编辑器
  if (props.mergeConfig) {
    const { mergeConfig } = props;
    mergeView.value = new MergeView({
      a: {
        doc: mergeConfig.oldDoc, // 旧代码
        extensions: [
          // 如果不启用 enabled，则只读，如果启用 enabled，则可以编辑，默认只读
          !mergeConfig.enabled?.includes("a") ? EditorState.readOnly.of(true) : undefined,
          EditorView.editable.of(mergeConfig.enabled?.includes("a") !== false),
          ...extensions.value,
        ].filter((extension): extension is Extension => !!extension),
      },
      b: {
        doc: mergeConfig.newDoc, // 新代码
        extensions: [
          !mergeConfig.enabled?.includes("b") ? EditorState.readOnly.of(true) : undefined,
          EditorView.editable.of(mergeConfig.enabled?.includes("b") !== false),
          ...extensions.value,
        ].filter((extension): extension is Extension => !!extension),
      },
      parent: editorRef.value,
      collapseUnchanged: {
        margin: mergeConfig.margin || 3,
        minSize: mergeConfig.minSize || 4,
      },
      ...mergeConfig,
      // 左右编辑器顺序
      orientation: mergeConfig.orientation,
      // 使用高亮线条
      gutter: mergeConfig.gutter !== false,
      // 是否新旧代码支持一键替换
      revertControls: mergeConfig.revertControls === true ? "a-to-b" : mergeConfig.revertControls || undefined,
      // 新旧代码下划线对比高亮
      highlightChanges: mergeConfig.highlight,
    });

    await nextTick();

    return emits("ready", {
      view: mergeView.value,
      state: { a: mergeView.value.a.state, b: mergeView.value.b.state },
      container: editorRef.value,
    });
  }

  // 注册 Codemirror
  view.value = new EditorView({
    parent: editorRef.value,
    state: EditorState.create({ doc: value, extensions: extensions.value }),
    dispatch: (tr: Transaction) => {
      view.value.update([tr]);
      if (tr.changes.empty || !tr.docChanged) return;

      doc.value = tr.state.doc.toString() ?? "";
      emits("change", tr.state);
    },
  });

  await nextTick();

  emits("ready", {
    view: view.value,
    state: view.value.state,
    container: editorRef.value,
  });
});

onUnmounted(() => {
  view.value.destroy();
  mergeView.value.destroy();
  emits("destroy");
});

/**
 * 手动触发语法检查
 *
 * @see {@link https://codemirror.net/docs/ref/#lint.forceLinting}
 */
const lint = (): void => {
  if (!props.linter || !view.value) return;
  if (props.forceLinting) forceLintingFun(view.value);
  diagnosticCount.value = linterDagnosticCount(view.value.state);
};

/**
 * 手动使配置重新生效
 *
 * @see {@link https://codemirror.net/examples/config/#top-level-reconfiguration}
 */
const forceReconfigure = (): void => {
  // 先清除配置
  view.value?.dispatch({
    effects: StateEffect.reconfigure.of([]),
  });
  // 重新注册配置
  view.value?.dispatch({
    effects: StateEffect.appendConfig.of(extensions.value),
  });
};

/* ----- 实验性 ------ */

/**
 * 在编辑器中获取给定点之间的文本（下标位置而不是行号）
 *
 * @param from - 开始位置
 * @param to - 结束位置
 */
const getRange = (from?: number, to?: number): string | undefined => view.value.state.sliceDoc(from, to);
/**
 * 获取指定行文本
 *
 * @param number - 行号
 */
const getLineText = (number: number): string => view.value.state.doc.line(number + 1).text;
/** 获取行数 */
const lineCount = (): number => view.value.state.doc.lines;
/** 获取光标所在的下标位置 */
const getCursor = (): number => view.value.state.selection.main.head;
/** 获取所有当前选择的内容相关信息对象 */
const listSelections = (): readonly SelectionRange[] => {
  let _view$value$state$sel;
  return (_view$value$state$sel = view.value.state.selection.ranges) !== null && _view$value$state$sel !== undefined
    ? _view$value$state$sel
    : [];
};
/** 获取当前选择的内容 */
const getSelection = (): string => {
  let _view$value$state$sli;
  return (_view$value$state$sli = view.value.state.sliceDoc(
    view.value.state.selection.main.from,
    view.value.state.selection.main.to
  )) !== null && _view$value$state$sli !== undefined
    ? _view$value$state$sli
    : "";
};
/**
 * 获取当前选择的多行内容数组，一行占一个数组下标
 */
const getSelections = (): string[] => {
  const s = view.value.state;
  if (!s) return [];

  return s.selection.ranges.map((r: { from: number; to: number }) => s.sliceDoc(r.from, r.to));
};
/** 如果有文本被选中，返回 `true`；否则返回 `false`，检查是否有任何选择范围不为空 */
const somethingSelected = (): boolean => view.value.state.selection.ranges.some((r: { empty: boolean }) => !r.empty);

/**
 * 将文档中从 `from` 位置到 `to` 位置的文本替换为给定的 `replacement` 文本
 *
 * @param replacement - replacement text
 * @param from - start string at position
 * @param to -  insert the string at position
 */
const replaceRange = (replacement: string | Text, from: number, to: number): void =>
  view.value.dispatch({
    changes: { from, to, insert: replacement },
  });
/**
 * 替换当前的选区（或选区）为给定的 `replacement` 文本。默认情况下，新选择会位于插入的文本之后
 *
 * @param replacement - replacement text
 */
const replaceSelection = (replacement: string | Text): void =>
  view.value.dispatch(view.value.state.replaceSelection(replacement));
/**
 * 设置光标位置到指定的 `position`
 *
 * @param position - position.
 */
const setCursor = (position: number): void => view.value.dispatch({ selection: { anchor: position } });
/**
 * 设置单一的选取范围，其中 `anchor` 是锚点位置，`head` 是可选的头部位置。
 *
 * @param anchor - anchor position
 * @param head -
 */
const setSelection = (anchor: number, head?: number): void => view.value.dispatch({ selection: { anchor, head } });
/**
 * 设置新的选取范围数组，至少需要一个选取。`ranges` 是选取范围数组，`primary` 是可选的主选取索引
 *
 * @param ranges - Selection range
 * @param primary -
 */
const setSelections = (ranges: readonly SelectionRange[], primary?: number): void =>
  view.value.dispatch({
    selection: EditorSelection.create(ranges, primary),
  });
/**
 * 应用提供的函数 `f` 到所有现有的选取上，并根据结果调用 `extendSelections` 方法。这允许动态扩展选取范围
 *
 * @param f - function
 */
const extendSelectionsBy = (f: any): void =>
  view.value.dispatch({
    selection: EditorSelection.create(selection.value.ranges.map((r: SelectionRange) => r.extend(f(r)))),
  });

defineExpose({
  editor: editorRef,
  view,
  cursor,
  selection,
  focus,
  length,
  json,
  diagnosticCount,
  dom: view.value.contentDOM,
  lint,
  forceReconfigure,
  // Bellow is CodeMirror5's function
  getRange,
  getLineText,
  lineCount,
  getCursor,
  listSelections,
  getSelection,
  getSelections,
  somethingSelected,
  replaceRange,
  replaceSelection,
  setCursor,
  setSelection,
  setSelections,
  extendSelectionsBy,
});

// 全屏事件
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const codeMirrorWidth = computed(() => addUnit(props.width));
const codeMirrorHeight = computed(() => addUnit(props.height));
const codeMirrorMaxHeight = computed(() => addUnit(props.maxHeight));
const codeMirrorFontSize = computed(() => addUnit(props.fontSize));
const mergeCmBgColor = computed(() => props.mergeConfig?.headerBgColor || "#f6f8fa");
const mergeCmBorderColor = computed(() => props.mergeConfig?.headerBorderColor || "#d0d7de");
const mergeCmAHighlightLineBgColor = computed(
  () => props.mergeConfig?.highlightColor?.aHighlightLineBgColor || "#ffebe9"
);
const mergeCmAHighlightTextBgColor = computed(
  () => props.mergeConfig?.highlightColor?.aHighlightTextBgColor || "#ff818266"
);
const mergeCmBHighlightLineBgColor = computed(
  () => props.mergeConfig?.highlightColor?.bHighlightLineBgColor || "#e6ffec"
);
const mergeCmBHighlightTextBgColor = computed(
  () => props.mergeConfig?.highlightColor?.bHighlightTextBgColor || "#abf2bc"
);
</script>

<script lang="ts">
const defaultPhrases = {
  // @codemirror/view
  "Control character": "控制字符",
  // @codemirror/commands
  "Selection deleted": "选择已删除",
  // @codemirror/language
  "Folded lines": "折叠行",
  "Unfolded lines": "展开行",
  to: "到",
  "folded code": "折叠代码",
  unfold: "展开代码",
  "Fold line": "折叠行",
  "Unfold line": "展开行",
  // @codemirror/search
  "Go to line": "跳转到行",
  go: "OK",
  Find: "查找",
  Replace: "替换",
  next: "下一个",
  previous: "上一个",
  all: "全部",
  "match case": "匹配条件",
  "by word": "全文检索",
  regexp: "正则表达式",
  replace: "替换",
  "replace all": "替换全部",
  close: "关闭",
  "current match": "当前匹配",
  "replaced $ matches": "替换 $ 命中",
  "replaced match on line $": "替换 $ 行匹配",
  "on line": "在线",
  // @codemirror/autocomplete
  Completions: "自动补全",
  // @codemirror/lint
  Diagnostics: "诊断",
  "No diagnostics": "无诊断",
};
</script>

<template>
  <component :is="tag" ref="editorRef" :class="[ns.b(), ns.is('fullscreen', isFullscreen)]">
    <template v-if="mergeConfig && mergeConfig.header">
      <slot name="header">
        <div :class="ns.e('header')">
          <slot name="headerLeft">
            <div :class="ns.em('header', 'left')">
              <slot name="leftTitle">{{ mergeConfig.leftTitle || "Before" }}</slot>
            </div>
          </slot>
          <slot name="headerRight">
            <div :class="ns.em('header', 'right')">
              <slot name="rightTitle">{{ mergeConfig.rightTitle || "After" }}</slot>
            </div>
          </slot>
        </div>
      </slot>
    </template>

    <div v-if="fullScreen" :class="ns.e('fullscreen-btn')">
      <el-button size="small" plain @click="toggleFullScreen">
        <el-icon><FullScreen /></el-icon>
      </el-button>
    </div>

    <aside v-if="$slots.default" style="display: none" aria-hidden><slot /></aside>
  </component>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/namespace" as *;

@include b(code-mirror) {
  position: relative;
  width: v-bind(codeMirrorWidth);
  height: v-bind(codeMirrorHeight);
  max-height: v-bind(codeMirrorMaxHeight);
  font-size: v-bind(codeMirrorFontSize);

  @include is(fullscreen) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #ffffff;
  }

  // CodeMirror 实际高度
  :deep(.cm-editor) {
    height: 100%;
  }

  :deep(.cm-editor.cm-focused) {
    outline: none;
    box-shadow: 0 0 0 1px var(--#{$el-namespace}-color-primary);
  }

  /* a 编辑器高亮行背景色 */
  :deep(.ͼ1.cm-merge-a .cm-changedLine, .ͼ1 .cm-deletedChunk) {
    background-color: v-bind(mergeCmAHighlightLineBgColor);
  }

  /* b 编辑器高亮行背景色 */
  :deep(.ͼ1.cm-merge-b .cm-changedLine) {
    background-color: v-bind(mergeCmBHighlightLineBgColor);
  }

  /* a 编辑器高亮文字背景色 */
  :deep(.ͼ2.cm-merge-a .cm-changedText, .ͼ2 .cm-deletedChunk .cm-deletedText) {
    background-color: v-bind(mergeCmAHighlightTextBgColor);
  }

  /* b 编辑器高亮文字背景色 */
  :deep(.ͼ2.cm-merge-b .cm-changedText) {
    background-color: v-bind(mergeCmBHighlightTextBgColor);
  }

  :deep(.cm-mergeView) {
    height: 100%;
  }

  @include e(header) {
    display: flex;
    align-items: stretch;

    @include m(left) {
      flex-grow: 1;
      flex-basis: 0;
      padding: 8px 11px;
      text-align: center;
      background-color: v-bind(mergeCmBgColor);
      border: 1px solid v-bind(mergeCmBorderColor);
    }

    @include m(right) {
      flex-grow: 1;
      flex-basis: 0;
      padding: 8px 11px;
      text-align: center;
      background-color: v-bind(mergeCmBgColor);
      border: 1px solid v-bind(mergeCmBorderColor);
    }
  }

  @include e(fullscreen-btn) {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 1999;

    @include el-joins(button) {
      width: 24px;
      height: 24px;

      @include el-joins(icon) {
        font-size: 16px;
      }
    }
  }
}
</style>
