export default {
  root: true,
  customSyntax: "postcss-html",
  extends: [
    "stylelint-config-standard", // 配置 stylelint拓展插件
    "stylelint-config-html/vue", // 配置 vue 中 template 样式格式化
    "stylelint-config-standard-scss", // 配置 stylelint scss 插件
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss", // 配置 vue 中 scss 样式格式化
    "stylelint-config-recess-order", // 配置 stylelint css属性书写顺序插件
  ],
  /**
   * 值规则
   *
   * 1. null：关闭该规则
   * 2. [xx, { ignoreXx: [] }]，指定 xx 规则，但是忽略正则匹配的值
   * 3. [xx, { ignoreXx: {key: value} }]，指定 xx 规则，但是忽略某个属性的某个 value，支持正则
   */
  rules: {
    "no-empty-source": null, // 允许空样式
    "function-url-quotes": "always", // 要求或禁止 URL 的引号，always(必须加上引号) | never(没有引号)
    "color-hex-length": "long", // 指定 16 进制颜色的简写或扩写， short(16进制简写) | long(16进制扩写)
    "custom-property-pattern": null, // 自定义属性命名规则
    "selector-class-pattern": null, // 强制选择器类名的格式
    "no-descending-specificity": null, // 允许无降序特异性
    "keyframes-name-pattern": null, // 动画帧节点样式命名规则
    "function-name-case": null, // 指定函数名称的小写或大写
    "nesting-selector-no-missing-scoping-root": null, // 去除嵌套选择器无缺失范围根报错
    // 要求或不允许 at 规则前有空行
    "at-rule-empty-line-before": [
      "always",
      { ignore: ["after-comment", "first-nested"], ignoreAtRules: ["forward", "use", "else", "include"] },
    ],
    "value-keyword-case": ["lower", { ignoreFunctions: ["/v-bind$$(.*?$$)/"] }], // 指定关键字值的小写或大写
    "media-feature-range-notation": "prefix", // 指定媒体功能范围的上下文或前缀表示法
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global", "export", "deep"] }],
    "import-notation": "string", // 为 @import 规则指定字符串或 URL 表示法
    "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }], // 禁止未知单位
    // 不允许声明中的属性值未知
    "declaration-property-value-no-unknown": [
      true,
      { ignoreProperties: { "/.+/": "/v-bind|cssVar|cssVarName|cssVarWithDefault/" } },
    ],
    "function-no-unknown": null, // 忽略未知函数的错误
    "scss/at-function-pattern": null, // scss 的 @function 命名允许大写
    "nesting-selector-no-missing-scoping-root": null, // 允许嵌套选择器缺少作用域根
  },
  ignoreFiles: [
    "**/*.js",
    "**/*.jsx",
    "**/*.tsx",
    "**/*.ts",
    "**/*.json",
    "**/styles/*.css",
    "**/*.module.scss",
    "**/assets/**/*.*",
  ],
  overrides: [
    // 扫描 .vue/html 文件中的 <style> 标签内的样式
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html",
    },
    {
      files: ["**/*.{css,scss}"],
      customSyntax: "postcss-scss",
    },
  ],
};
