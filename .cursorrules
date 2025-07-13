# 代码编写规范

## 组件格式
- 使用 `<script setup lang="ts">` 语法
- 使用 `defineOptions({ name: "Xxx" })` 定义组件名
- 使用 `const ns = useNamespace("xx-xx")` 创建命名空间
- 样式文件使用 `@use "./index"` 引入
- 使用 `import { useNamespace } from "@/composables"` 创建命名空间

## 类型定义规范
- Props 和 Emits 使用 TypeScript interface 定义
- 所有函数参数都要加类型注解
- 类型文件放在组件同级目录的 `types.ts` 中

## 导入规范
1. 先引入所有 type 类型（按照导入规范顺序引入，不允许类型和函数的引入混杂在一起）
2. 引入第三方依赖（Vue 相关生态优先，如 vue、vue-router、vuex、vue-i18n、vue-use，然后是组件库如 Element Plus，@element-plus/icons-vue，最后是第三方插件）
3. 引入项目目录的其他依赖（@/路径，路径按照 src 目录结构顺序引入）
4. 引入项目目录的其他组件（@/路径，路径按照 src 目录结构顺序引入）
5. 引入相对路径的依赖（@/路径，路径按照 src 目录结构顺序引入）
6. 引入相对路径的组件（@/路径，路径按照 src 目录结构顺序引入）
7. 直接引入第三方库（如 import "vue-cropper/dist/index.css"）
8. 直接引入绝对路径（如 import "@/common/styles/common/var.scss"）
9. 直接引入相对路径（如 import "./index.scss"）

## 组件内 Composables 使用
- 不推荐直接在组件中写响应式变量、computed、watch、function、生命周期
- 将关联性高的代码放到 `function useXx` 里然后暴露出来使用
- 使用 `defineModel` 代替 `props.modelValue`

## 文件组织
- 通用组件放在 `src/components/` 目录下，按功能分子文件夹
- 通用可复用逻辑放在 `src/composables/`
- 通用样式放在 `src/common/styles/`
- 通用 API 请求相关文件放在 `src/common/api/`
- 通用工具函数放在 `src/common/utils/`

## 命名规范
- 所有文件使用 `kebab-case` 风格
- 引入组件的命名为 `Camel-Case`，如 `import ProTable from "pro-table.vue"`
- TypeScript 接口和类型用 PascalCase
- 每个组件目录下用 `index.ts` 统一导出

## UI 设计规范
- 使用 `light.scss` 或 `dark.scss` 的 CSS 变量来统一颜色风格
- 使用 `varCss` 或 `varCssEl` 函数引用 CSS 变量（cssVar 引入 `--tk-` 开头，cssVarEl 引入 `--el-` 开头）
- 遵循 BEM 规范，优先使用 useNamespace 函数（如 `ns.b()`、`ns.e()`、`ns.em()`、`ns.is()`、`ns.has()`）
- 组件的样式优先创建并使用 `.scss` 文件，且在同级 `.vue` 文件下创建同名的 `.scss` 文件
- 使用 `bem.scss` 的混合宏（如 `@include b(xx) { @include e(xx) { @include m(xx) { @include is(xx) { @include has(xx) { } } } } }`），如果 `@include e(xx){}` 里使用 `@include e{}` 则第二个参数加上 true，即 `@include e(xx, true){}`，否则 `@include e(xx){}` 建议同级写
- 优先使用项目定义的原子类，在 `atomic.scss` 中定义
- 请适配移动端，部分移动端宽度变量在 `var.scss` 中定义

## 代码结构
- props、emits、composables 写在 script 顶部
- 适当换行，如变量与函数之间，script、template、style 标签之间必须换行
- 使用 ESLint 和 Prettier 保证代码风格统一
- composable 和函数用 JSDoc 或 TypeScript 注释说明用途