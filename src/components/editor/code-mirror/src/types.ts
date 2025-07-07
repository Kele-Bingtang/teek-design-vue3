import type { LanguageSupport } from "@codemirror/language";
import type { LintSource } from "@codemirror/lint";
import type { MergeView } from "@codemirror/merge";
import type { EditorState, Extension, Text } from "@codemirror/state";
import type { EditorView, ViewUpdate } from "@codemirror/view";

export interface MergeCodeMirrorProps {
  [key: string]: any;
  /** 旧代码 */
  oldDoc?: string | Text;
  /** 新代码 */
  newDoc?: string | Text;
  /** 是否新旧代码支持一键替换 */
  revertControls?: "a-to-b" | "b-to-a" | boolean;
  /** 新旧代码对比高亮，默认开启 true */
  highlight?: boolean;
  /** 左右编辑器顺序，默认 "a-b" */
  orientation?: "a-b" | "b-a";
  /** 行代码前使用高亮竖线条，默认 true */
  gutter?: boolean;
  /** 是否禁用编辑功能，默认禁用 a、b */
  enabled?: ("a" | "b" | string)[];
  /** 是否启用 header，默认不启用 false */
  header?: boolean;
  /** header 背景色，默认 "#f6f8fa"，需要开启 header */
  headerBgColor?: string;
  /** header 边框色，默认 "#d0d7de"，需要开启 header */
  headerBorderColor?: string;
  /** header 左侧标题，默认 "Before" */
  leftTitle?: string;
  /** header 右侧标题，默认 "After" */
  rightTitle?: string;
  /** 与 minSize 互斥，指定多少个相同的代码行数不允许折叠，默认为 3 */
  margin?: number;
  /** 多少行没有区别的代码行数可以折叠，默认折叠超过 4 行的代码行 */
  minSize?: number;
  /** 高亮颜色 */
  highlightColor?: {
    /** a 编辑器高亮行背景色，默认 #ffebe9 */
    aHighlightLineBgColor?: string;
    /** a 编辑器高亮文本背景色，默认 #ff818266 */
    aHighlightTextBgColor?: string;
    /** b 编辑器高亮行背景色，默认 #e6ffec */
    bHighlightLineBgColor?: string;
    /** b 编辑器高亮文本背景色，默认 #abf2bc */
    bHighlightTextBgColor?: string;
  };
}

export interface CodeMirrorProps {
  /** 代码编辑器宽度，默认 undefined */
  width?: string | number;
  /** 代码编辑器高度，默认 undefined */
  height?: string | number;
  /** 代码编辑器最大高度，默认 undefined */
  maxHeight?: string | number;
  /** 字体大小，默认 14px */
  fontSize?: string | number;
  /** 本地主题包 */
  localTheme?: Extension;
  /** 本地代码语言包 */
  lang?: LanguageSupport;
  /** 是否导入代码编辑器常用功能，See https://codemirror.net/docs/ref/#codemirror.basicSetup */
  basic?: boolean;
  /** 是否导入代码编辑器 Mini 功能，See https://codemirror.net/docs/ref/#codemirror.minimalSetup */
  minimal?: boolean;
  /** 是否切换为暗黑主题（前提是主题支持切换），默认不切换 false */
  dark?: boolean;
  /** 代码编辑器占位符 */
  placeholder?: string;
  /** 内容宽度超出屏幕后，是否开启自动换行，默认开启 true */
  wrap?: boolean;
  /** 是否启用 Tab 键缩进，默认开启 true */
  tab?: boolean;
  /** Tab 键缩进单位，默认 undefined */
  tabSize?: number;
  /** 是否开启允许多选，默认不开启 false，See https://codemirror.net/docs/ref/#state.EditorState^allowMultipleSelections */
  multiple?: boolean;
  /** 换行符，默认 "\n" */
  lineSeparator?: string;
  /** 自定义主题，See https://codemirror.net/docs/ref/#view.EditorView^theme */
  customTheme?: Recordable;
  /** 是否只读代码编辑器，默认不开启 false */
  readonly?: boolean;
  /** 是否禁用代码编辑器，默认不开启 false */
  disabled?: boolean;
  /** 自定义代码编辑器的国际化语言内容，See https://codemirror.net/6/examples/translate/ */
  phrases?: Record<string, string>;
  /** 代码校验器，See https://codemirror.net/docs/ref/#lint.linter */
  linter?: LintSource | any;
  /** 代码校验器配置项，See https://codemirror.net/docs/ref/#lint.linter^config */
  linterConfig?: Recordable;
  /** 是否在输入过程开始校验语法，false 则在输入完成后校验，默认不开启 false */
  forceLinting?: boolean;
  /** 当代码语法出错，开头是否红色圆圈 🔴 提示，前提开启 linter 属性，默认不开启 false */
  gutter?: boolean;
  /** 语法错误配置项，See https://codemirror.net/docs/ref/#lint.lintGutter^config */
  gutterConfig?: Recordable;
  /** 代码编辑器根标签，默认是 div */
  tag?: string;
  /** 缩进单位，如 "  "，缩进两个空格，"    " 代表缩进四个空格 */
  indentUnit?: string;
  /** 额外扩展 */
  extensions?: Extension[];
  /** 代码对比编辑器配置项，传入配置项即开启 */
  mergeConfig?: MergeCodeMirrorProps;
  /** 是否启用全屏模式，默认不开启 false */
  fullScreen?: boolean;
}

export interface CodeMirrorEmits {
  /** CodeMirror 更新事件 */
  update: [_value: ViewUpdate];
  /** CodeMirror 准备就绪事件 */
  ready: [
    _value: {
      view?: EditorView | MergeView;
      state?: EditorState | { a: EditorState; b: EditorState };
      container: HTMLElement;
    },
  ];
  /** CodeMirror 聚焦事件 */
  focus: [_value: boolean];
  /** 状态改变事件 */
  change: [_value: EditorState];
  /** CodeMirror 销毁事件 */
  destroy: [];
}
