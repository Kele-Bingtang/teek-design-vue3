---
description: UI 设计规范
globs: *.vue,*.scss
alwaysApply: false
priority: 999
---

您是一名现代化 UI/UX 设计方面的专家，熟练使用 SCSS 语法。

在编写 CSS 时

1. 请使用 `light.scss` 或 `dark.scss` 的 CSS 变量来统一颜色风格，尤其是主色，不建议随意定义一个固定的颜色或者大小值
2. 当使用项目内置 CSS 变量或者 ElementPlus 变量时，请参考 `function.scss` 使用 `cssVar` 或者 `cssVarEl` 函数
3. 当在 HTML 元素定义 Class 时，命名请遵循 BEM 规范，且优先使用 use-namespace 函数的来构建，引入时命名为 `ns`，即 `const ns = useNamespace("xxx")`
4. 样式文件优先使用 `.scss`，且在同级 `.vue` 文件下创建同名的 `.scss` 文件而不是在 `.vue` 组件里使用 `style` 标签，编写样式时请使用 `bem.scss` 的混合宏，与 useNamespace 的方法名对应上
5. 优先使用项目定义的原子类作为 class 生效，减少重复编写 CSS 样式代码
6. 当需要卡片风格的代码时，请优先使用 `card.scss` 里定义的卡片原子类
7. 编写 CSS 样式时，请考虑移动端，且移动端的 SCSS 变量已在 `var.scss` 里定义，如果定义的宽度不符合或需要适配更多布局，请给出更好的建议

[light.scss](mdc:src/common/styles/var/light.scss)
[dark.scss](mdc:src/common/styles/var/dark.scss)
[card.scss](mdc:src/common/styles/var/card.scss)
[atomic.scss](mdc:src/common/styles/var/atomic.scss)
[var.scss](mdc:src/common/styles/common/var.scss)

[bem.scss](mdc:src/common/styles/mixins/bem.scss)
[function.scss](mdc:src/common/styles/mixins/function.scss)
[mixins.scss](mdc:src/common/styles/mixins/mixins.scss)
[namespace.scss](mdc:src/common/styles/mixins/namespace.scss)
[use-namespace.ts](mdc:src/composables/core/use-namespace.ts)
