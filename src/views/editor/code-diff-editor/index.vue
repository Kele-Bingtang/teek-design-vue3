<script lang="ts" setup>
import { CodeDiff } from "v-code-diff";
import oldDoc from "./oldDoc.json";
import newDOc from "./newDoc.json";
import { useNamespace } from "@/composables";

const ns = useNamespace();

const oldString = ref(JSON.stringify(oldDoc, null, 2));
const newString = ref(JSON.stringify(newDOc, null, 2));

const state = reactive({
  language: "json",
  theme: "light",
  diffStyle: "word",
  forceInlineComparison: false,
  outputFormat: "side-by-side",
  context: 10,
  trim: false,
  noDiffLineFeed: false,
  oldFilename: "package.json",
  newFilename: "newPackage.json",
  hideHeader: false,
  hideStat: false,
  maxHeight: "900px",
});

const printEvent = (e: Event) => {
  console.log("diff finished! below is data:");
  console.log(e);
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="CodeMirror 组件">
      <template #header>
        <el-link
          href="https://github.com/Shimada666/v-code-diff"
          target="_blank"
          underline="never"
          style="margin-bottom: 10px; font-size: 22px"
        >
          v-code-diff 组件
        </el-link>
        <el-alert :closable="false">
          可以去代码编辑器（该菜单上方），它是利用 CodeMirror 实现代码对比功能，比 `v-code-diff` 多了
          <span :style="`color: var(--${ns.elNamespace}-color-primary)`">代码替换功能</span>
          ，但是少了部分功能，如统计信息、更细节对比、空格去除等功能
        </el-alert>
      </template>

      <el-space wrap :size="30">
        <div>
          语言选择：
          <el-select v-model="state.language" style="width: 130px">
            <el-option
              v-for="item in ['plaintext', 'json', 'yaml', 'javascript', 'java', 'python', 'sql', 'xml', 'bash']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>

        <div>
          主题选择：
          <el-radio-group v-model="state.theme">
            <el-radio value="light">亮色</el-radio>
            <el-radio value="dark">暗色</el-radio>
          </el-radio-group>
        </div>

        <div>
          输出格式选择：
          <el-radio-group v-model="state.outputFormat">
            <el-radio value="line-by-line">line-by-line</el-radio>
            <el-radio value="side-by-side">side-by-side</el-radio>
          </el-radio-group>
        </div>

        <div>
          对比格式选择：
          <el-radio-group v-model="state.diffStyle">
            <el-radio value="word">Work</el-radio>
            <el-radio value="char">Character</el-radio>
          </el-radio-group>
        </div>

        <div>
          是否去除空格：
          <el-switch v-model="state.trim" />
        </div>

        <div>
          换行符对比：
          <el-switch v-model="state.noDiffLineFeed" />
        </div>

        <div>
          隐藏头部：
          <el-switch v-model="state.hideHeader" />
        </div>

        <div>
          隐藏统计信息：
          <el-switch v-model="state.hideStat" />
        </div>

        <div>
          更细节对比：
          <el-switch v-model="state.forceInlineComparison" />
        </div>

        <div>
          代码对比器高度：
          <el-input style="width: 80px" v-model="state.maxHeight" />
        </div>

        <div>
          隔多少行不隐藏：
          <el-input style="width: 80px" v-model="state.context" />
        </div>

        <div>
          旧文件名：
          <el-input style="width: 150px" v-model="state.oldFilename" />
        </div>
        <div>
          新文件名：
          <el-input style="width: 150px" v-model="state.newFilename" />
        </div>
      </el-space>

      <CodeDiff
        :theme="state.theme"
        :old-string="oldString"
        :new-string="newString"
        :language="state.language"
        :diff-style="state.diffStyle"
        :force-inline-comparison="state.forceInlineComparison"
        :output-format="state.outputFormat"
        :context="state.context"
        :trim="state.trim"
        :no-diff-line-feed="state.noDiffLineFeed"
        :filename="state.oldFilename"
        :new-filename="state.newFilename"
        :hide-header="state.hideHeader"
        :hide-stat="state.hideStat"
        :max-height="state.maxHeight"
        @diff="printEvent"
      />
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="language">
          代码语言，如 typescript，默认纯文本 plaintext。
          <el-link
            type="primary"
            href="https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md"
            target="_blank"
            underline="never"
          >
            查看全部支持语言
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="oldString">旧的字符串。`string` 类型</el-descriptions-item>
        <el-descriptions-item label="newString">新的字符串。`string` 类型</el-descriptions-item>
        <el-descriptions-item label="context">不同地方上下间隔多少行不隐藏。`number` 类型</el-descriptions-item>
        <el-descriptions-item label="outputFormat">
          显展示方式。`string` 类型，默认为 `line-by-line`，可选 `line-by-line`、`side-by-side`
        </el-descriptions-item>
        <el-descriptions-item label="diffStyle">
          差异风格, 单词级差异或字母级差异。`string` 类型，默认为 `word`，可选 `word`、`char`
        </el-descriptions-item>
        <el-descriptions-item label="forceInlineComparison">
          细分差异；存在差异时，强制进行行内对比（word 或 char 级）。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
        <el-descriptions-item label="trim">移除字符串前后空白字符。`boolean` 类型，默认为 `false`</el-descriptions-item>
        <el-descriptions-item label="noDiffLineFeed">
          不 diff windows 换行符(CRLF)与 linux 换行符(LF)。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
        <el-descriptions-item label="maxHeight">
          组件最大高度，例如 300px。`string` 类型，默认为 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="filename">文件名 。`string` 类型，默认为 `undefined`</el-descriptions-item>
        <el-descriptions-item label="newFilename">
          新文件文件名 。`string` 类型，默认为 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="maxHeight">新文件文件名。`string` 类型，默认为 `undefined`</el-descriptions-item>
        <el-descriptions-item label="hideHeader">隐藏头部栏 。`boolean` 类型，默认为 `false`</el-descriptions-item>
        <el-descriptions-item label="hideStat">
          隐藏头部栏中的统计信息 。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
        <el-descriptions-item label="theme">
          用于切换日间模式/夜间模式 `ThemeType` 类型，默认为 `light`，可选 `light`、`dark`
        </el-descriptions-item>
        <el-descriptions-item label="ignoreMatchingLines">
          给出一个模式来忽略匹配行，例如：'(time|token)'。`string` 类型
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="diff">
          diff 完成后触发，类型为 `(result: {stat: { isChanged: boolean, addNum: number, delNum: number}}) => void`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="插槽 📚" :column="1" border>
        <el-descriptions-item label="stat">自定义统计内容，参数为 { stat }</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
