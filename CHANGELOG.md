# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.1](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v2.1.0...v2.1.1) (2026-03-01)

### Features

- **build:** 🚀 支持线上修改配置环境变量内容，添加 SIT 和 UAT 环境构建支持 ([5bc0d58](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5bc0d58bf5c5c0d1ef5014c18f01b04226c93cee))
- **http:** 🚀 更新请求配置类型定义并优化路由获取逻辑 ([71f0b6f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/71f0b6ff7973991a0818b08e89cd70fd34498104))
- **pro-page:** 🚀 ProPage 组件添加 CURD 弹框、抽屉表单功能 ([fd9ae53](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fd9ae53426826ef7b084f1e07b84af1b158491e1))

### Bug Fixes

- **card:** 🐞 将统计卡片计数默认值设为 undefined ([d4a1f28](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d4a1f28457370ac3e46c03a64b6148f702c2ef69))
- **form:** 🐞 修复首页 Dialog 使用表单组件因存在间距导致出现滚动条问题 ([3aa1fdd](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3aa1fddae4bc19212208b1f43bdf009372a094bc))
- **image-viewer:** 🐞 修复图片查看器缩放比例限制 ([bedaa04](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bedaa040cd2d9c49dba92164087337199f510259))
- **pro-form:** 🐞 修复 v1 超级组件部分问题 ([351eee6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/351eee61f8681dff02bdd1ce7f6949c1e79f7fb9))

### Code Refactoring

- **feedback-form:** ♻️ 优化反馈表单组件的类型定义和默认值设置 ([ee57b3f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ee57b3ff5db29429426ca2cf4931a61a4af423b0))

## [2.1.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v2.0.2...v2.1.0) (2025-12-13)

### Features

- **core:** 🚀 添加全局滚动提示组件及配置支持 ([2de62eb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2de62ebd08de3af59551629dc905f359952707c0))
- **layout:** 🚀 新增蓝色菜单主题并优化样式结构 ([397f609](https://github.com/Kele-Bingtang/teek-design-vue3/commit/397f60925f5d20a05e318e65ac5333941802c552))
- **pro:** 🚀 添加 optionCache 配置项以控制字典数据缓存行为 ([7b85eff](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7b85eff5bbb245c0fbf6bcf237b351e3945b8324))
- **pro:** 🚀 添加 ProTabs 超级标签页组件并重构路由结构 ([cd0f067](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cd0f06767265d81926a3c896698eacfaae1b9e49))
- **table:** 🚀 超级表格l行、单元格样式支持动态样式函数配置 ([67673fb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/67673fb42663638bfdc41b55eea82456e3f9c3c3))
- **tree-filter:** 🚀 增强树形筛选器组件功能和样式 ([54ee0cc](https://github.com/Kele-Bingtang/teek-design-vue3/commit/54ee0ccfd8ad46bc29eed594c7ab2862cd7dd325))
- **tree-filter:** 🚀 支持动态请求参数并优化数据获取逻辑 ([76d15bb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/76d15bbdddcd07914b412b992b5ed1ea0a524238))
- **types:** 🚀 为超级描述列表和超级表格组件添加泛型支持，优化 axios 的 paramsType 逻辑 ([727d00c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/727d00c4385ede0187a3141b74f6e3c458234ecc))
- **utils:** 🚀 添加字符串简化函数并优化分栏布局样式 ([655a561](https://github.com/Kele-Bingtang/teek-design-vue3/commit/655a561ba4500641828e134bc7d9601465c4d2d4))

### Bug Fixes

- **chart:** 🐞 修复 Chart 渲染失效问题和 tab 修改失效问题 ([a8234f5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a8234f5310f22d349c0cfe889e4a7f580c09ee8c))
- **layout:** 🐞 优化布局组件和样式配置 ([fef4d02](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fef4d020ce674b462f3eb87cc82f8210cfdfd58d))
- **layout:** 修复标签页元数据合并逻辑 ([7e502d1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7e502d15c59065352f92549d63d0463a70530b8b))
- **layout:** 修复标签页元数据合并问题 ([805002f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/805002fbd453bdc89c9cce87c70b63d06f11c46a))
- **login:** 修复验证码倒计时不显示及返回登录页未重置的问题 ([271e7c6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/271e7c636bcb94495b1cdcd363b3379bbdad0bdf))
- **pro-form:** 🐞 优化表单布局和树组件全选逻辑 ([5f10de0](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5f10de024693d4d92ca522a2e614679d7c308de0))
- **pro:** 🐞 修复 options 缓存的 key 没有处理多级嵌套 prop 问题 ([f6eabff](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f6eabff59f95fb53eceae2ff9b357eec98a45ebb))
- **pro:** 🐞 修复超级组件属性传递和数据处理逻辑 ([8c47622](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8c47622d4d0808a736a42e5aefacdbcfcf340520))
- **table:** 🐞 调整超级表格表头背景色样式，修复透明问题 ([523e4fe](https://github.com/Kele-Bingtang/teek-design-vue3/commit/523e4fe032b92ee524d9ed3d30015c7079135929))
- **tree-filter:** 🐞 修复树形筛选器样式和数量显示问题 ([dcc616e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/dcc616ed7029f10ca60a1604d7f36943d9e5a270))

### Code Refactoring

- **components:** ♻️ 使用 reactive 初始化 model 默认值 ([9676896](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9676896f4c2b0222a0bbfbc6546ede88dd83338a))
- **core:** ♻️ 优化页面刷新逻辑和组件功能，修复标签页右键刷新失效问题 ([caafb6e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/caafb6e7e050ade078d49a90f065bfa3f4e0b427))
- **layout:** ♻️ 重构布局组件和样式，修复菜单 popper 时菜单主题未生效问题 ([7859fa3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7859fa332bc5d3e8956afcefbc941528f8a7ef97))
- **login:** 重构验证码逻辑文件命名以及相关导入路径 ([ea08f38](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ea08f388ec28b43ef94fd9b62456ce463358b0a1))
- **pro:** ♻️ 优化描述组件插槽渲染参数和修复 ProPage 的搜索按钮样式 ([5d8ce1f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5d8ce1ff2de8053352e58cc2ed421ce6448c0c3d))

### Others

- **package:** 🔨 修改 node 要求版本号 ([5327a18](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5327a184815ceb7c771d384f927cb34d21fada7b))
- **release:** 2.0.3 ([2631cca](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2631cca1e98d329910f75144c1507d38c13bd999))

## [2.0.2](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v2.0.1...v2.0.2) (2025-11-09)

### Features

- **core:** 优化组件与请求处理逻辑和 PointTag 组件新增 text 配置项 ([7046e64](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7046e6422e21747ddd02256c2b1ddddeadb3b9a3))
- **layout:** 🚀 优化 iframe 嵌入功能并添加动态路由支持 ([88e5e7f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/88e5e7fe3bccc9f1827672d703ee4ba056618f93))
- **pro-components:** 🚀 超级组件优化和新增部分功能 ([49599e2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/49599e2fb2cf5c14543528663934ee42e129cda3))
- **pro-components:** 🚀 增强类型支持与组件兼容性 ([2b9087a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2b9087a0c11212d3b5e4281f0b01eab52590f5d3))
- **pro-form-item:** 支持动态标签和属性值 ([4ae35ba](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4ae35ba967bc0055a7945d145470849991f3b99d))
- **pro-form:** 🚀 增强表单项 options 的函数式参数 ([a987bf1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a987bf157d42d0c4f242159fe4e93debe71bffea))
- **pro/form-item:** 🚀 支持动态表单组件属性与泛型类型增强 ([348589c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/348589cdbdee509493efb3cb48adfd30b10e2ec6))
- **tab-nav:** 🚀 优化路由路径匹配逻辑 ([e2ef79e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e2ef79e82cee3c56a544b2d30a3436315e47e116))
- **table:** 🚀 添加操作列前后插槽支持 ([5638f2d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5638f2dcf8d3f5af2fb56f89ca68de09ead50040))

### Bug Fixes

- **components:** 🐞 优化 ProSearch 相关类型和引用和修复 ProDrawer 底部按钮点击事件错误问 ([68aa343](https://github.com/Kele-Bingtang/teek-design-vue3/commit/68aa343efc79fbad47cecbf011417d63a98cf107))
- **config:** 🐞 修复线上没有开启 IFrame 监听导致 IFrame 功能失效问题 ([bbd5a48](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bbd5a486f5b8e81b49ca0bed16c09370389bd644))
- **dialog/drawer:** 🐞 优化弹框关闭逻辑和动画效果 ([c3b2944](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c3b2944cda53b3a039307e770034c14489459a2b))
- **layout:** 🐞 修复暗色菜单下嵌入布局的字体色丢失问题和头像悬停提示位置 ([7a9f93c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7a9f93c00b0806c656444347e524be65c03cd014))
- **layout:** 🐞 优化标签页滚动逻辑并修复代码编辑器颜色问题 ([e68c842](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e68c8427b7a4ab84049d599ed83c3768e23a47f8))
- **menu:** 修复激活菜单计算逻辑 ([2635fed](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2635fed96f7594d2cf930080524402fc1a8e075e))
- **pro:** 🐞 修复超级页面默认 el-select 问题 ([cb0e51f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cb0e51fb300be5685846734f1e06747f6d2ad943))
- **pro:** 🐞 修复分页触发两次事件和修复弹框按钮事件错误使用 ([58ad43c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/58ad43c1b8d2165019b158680b8b515dd2520603))
- **types:** 🐞 修复 ProPage 使用错误插槽名和修复 ProForm 双向绑定失效问题 ([208dacc](https://github.com/Kele-Bingtang/teek-design-vue3/commit/208dacc45c0246fbdbb30786d11299c7b3407940))

### Docs

- 📚 更新 CHANGELOG.md 文件 ([2c28b6c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2c28b6c96b67d2cff485126ef89f8306f401afeb))
- **TODO:** 📚 更新 2.0.2 版本计划并调整代码格式 ([cbe5f5f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cbe5f5f81b6f9c554be717f523308a665b7bc113))

### Styling

- 🎨 优化工作台日程时间线图标类型 ([662330b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/662330b96bfc768d58e8e2fbc279b022d2facb18))
- **icon:** 🎨 修改 icon 格式 ([50b1cfe](https://github.com/Kele-Bingtang/teek-design-vue3/commit/50b1cfec5fff28b1357d504b2abe088482549512))
- **stylelint:** 🎨 忽略嵌套选择器作用域根错误 ([dc1ae75](https://github.com/Kele-Bingtang/teek-design-vue3/commit/dc1ae75340797f0e2a7a6c7414a74dc9195d3a5d))

### Others

- 🔨 调整代码格式与类型定义优化 ([2bf0ac6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2bf0ac678d807536e1cdd2cad2240cd0d16b15c9))

### Code Refactoring

- **chart:** ♻️ 重构图表组合函数和修复超级页面组件查询 options 缓存失效 ([8ac3ffe](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8ac3ffea27b70a0a2882137d4aa8aa8aab1fd84d))
- **components:** ♻️ 优化表格组件注册和参数定义 ([bad14cb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bad14cb3b43f9c039aebcae5e68db061dbb8bf3f))
- **form:** ♻️ 优化表单选项和默认值处理逻辑以及 ProPage 重复请求问题 ([2cc4b49](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2cc4b49c197ddccb1821e24c136b70fd7722c8c3))
- **i18n:** ♻️ 明确指定多语言消息类型 ([d0a8205](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d0a8205083cebc2ec4004f98750f6106a5d7cafc))
- **permission:** ♻️ 重构权限切换页面 ([d3bc87b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d3bc87bb2c6f182247052fd31bfebdf2cdb16864))
- **storage:** ♻️ 重构存储管理器实现 ([ca74fbb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ca74fbb1b4fd03267541b151008e0ea033de577b))
- **table:** ♻️ 优化表格列配置和类型定义 ([9fb3192](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9fb3192ad89ff7064ddf46f66980c7682c1fd90f))

## [2.0.1](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v2.0.0...v2.0.1) (2025-08-23)

### Features

- **form-item:** 🚀 新增空白组件并优化选项过滤 ([8f5a3a2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8f5a3a2cd847f1e3130010e3d073226e55ba7fb5))
- **icon:** 🚀 更新 TODO.md 并优化 icon 组件 ([70f6a38](https://github.com/Kele-Bingtang/teek-design-vue3/commit/70f6a38d1c37daffeaaf5c5cf1a6868eaff2798a))
- **menu:** 🚀 支持 activeMenu 函数式定义 ([2c9b86c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2c9b86c43d880602abdfd74ab42cb769a56f0adb))
- **widget:** 🚀 添加搜索图标配置项 ([9870ef6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9870ef6d05197294dfbb8fd089a1a8bbe1344615))

### Bug Fixes

- 🐞 iconfont-sys 改为 icon-sys ([cc11907](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cc119076e7851b4d174f328e1e23e737b1d7d484))
- 🐞 layout-columns 布局 workbenches-full 跳转到 404 ([41fe0f1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/41fe0f1e4a9c30b5f2b3d9b0e19fb289c69bbb24))
- **layout:** 🐞 优化页面布局和主题切换 ([feb015a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/feb015afdc6999f22a8e213abc5dcf025b8b1e91))

### Docs

- 📚 更新 README 文件 ([79e7575](https://github.com/Kele-Bingtang/teek-design-vue3/commit/79e75756d87f7d65b3a9b09c804ef12bbd1b8e60))
- **README:** 📚 更新项目文档和首页内容 ([d776d41](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d776d4142b91e5c245e0587490413fbe9b354318))

### Code Refactoring

- **layout:** ♻️ 优化顶部栏高度计算并调整全局背景色 ([b9ea706](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b9ea706342ae6bdead89a0dbbb73f4382fb2b8a5))
- **storage:** ♻️ 优化缓存管理并支持数据迁移 ([b2807ae](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b2807ae6295164981e4c0f2bcae700ce80e617d8))
- **storage:** ♻️ 优化数据持久化和主题样式 ([a4486f9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a4486f98e56fc0c595beded5ac51ab6f3b294b90))
- **utils:** ♻️ 重构 ID 生成相关函数并优化颜色配置 ([0dc8b1a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0dc8b1a1c3b5e591c07cab0e64936d455c287bbc))

### Build System

- **deps:** 📦️ 更新项目依赖版本 ([3f8c21a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3f8c21add5c5bd536ee6b5ec3592b27aec250e71))

### Styling

- 🎨 优化 iconfont 图标和部分代码格式 ([0310bd1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0310bd1a0179ab1843d334090d51e02fa31c9a90))
- **dark:** 🎨 优化主题样式和颜色 ([99ad21b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/99ad21becd8ec465e857478e1e401f915397ec8a))

## [2.0.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.5.1...v2.0.0) (2025-08-05)

### Features

- 🚀 标签页添加简约风格，优化经典风格样式 ([e62fccd](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e62fccdeaae51bc5b302e6144b847220f2bc915c))
- 🚀 标签页新增固定选择功能，优化标签页部分代码以及样式 ([db2b5c9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/db2b5c923adf12b9ae48c07be9e046dfbdb33929))
- 🚀 部分依赖 major 版本升级，修复 pnpm 10.x 导致 v-code-diff 的 postinstall 脚本失效问题 ([bb010b7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bb010b74bbdcdde94e1aa3d42a97f5c6bb5c2135))
- 🚀 超级表单优化为模板风格 ([4322383](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4322383310b4f150df1d491725330a0faef0a9a2))
- 🚀 超级表格操作栏新增 operationProps 配置项，超级表格内置组件所有 props 支持透传 ([5152fe9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5152fe9ce9e8e460e095efcef32564f00c9fb64d))
- 🚀 超级表格功能列抽离组件，修复表格编辑 select 选值无法生效问题，优化超级描述的数据获取逻辑，超级表单的 renderEl 改为 render ([9fd40d3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9fd40d31ca5849d9c0633db0fe2e2792588ada7f))
- 🚀 超级表格新增 5 大常用 el 组件及其配置项，优化代码类型注释，优化超级组件样式，修复菜单搜索后跳转 404 问题 ([1a9bad6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1a9bad6f4018ec99dc8b5cd202f381a96f4e5db6))
- 🚀 超级表格新增 options 枚举解析功能 ([abddacf](https://github.com/Kele-Bingtang/teek-design-vue3/commit/abddacff9872865b31daaa849f35d817c94fabf5))
- 🚀 超级表格新增编辑功能，优化表格导出功能，优化样式目录 ([2f4c56d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2f4c56ddd3eaa5db280ae71b8ee0b9859410f1ef))
- 🚀 超级描述新增 formatValue 配置项，优化超级描述代码格式，优化 utils 下的文件 ([58194d9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/58194d9572d66225e49aa3222ca439a725105b5e))
- 🚀 超级描述组件添加编辑功能和请求函数，优化表单 change 事件参数，优化部分超级组件代码格式 ([9db0ab9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9db0ab909d9e472d9808886d0e89e003e0ebcaa7))
- 🚀 超级页面组件持续新增功能，优化超级表格 View 组件 ([1221298](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1221298df1392724674f6153f6dd36fbd438232f))
- 🚀 初始化超级页面组件，优化文件 import 顺序 ([cea842d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cea842dc707180fc8c3028a683ffa00f2029b0e2))
- 🚀 列筛选功能完成，新增操作栏组件 ([502110e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/502110eb38360ea32fd95927a1b772aee28ab413))
- 🚀 升级 husky ([ae50acb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ae50acbdffce516d35d90b046d4eb2b3a18a73e3))
- 🚀 所有依赖的最新非 major 版更新 ([be4224b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/be4224b2783cba7dec7983d056cab63020739e50))
- 🚀 新增 dialog、drawer、steps 的超级表单组件及其 Demo，优化 ProDialog 和 ProDrawer 的 Use 函数，优化部分配置项格式 ([81a7784](https://github.com/Kele-Bingtang/teek-design-vue3/commit/81a7784099b15f8af88ab1eee9299e5164dfb58e))
- 🚀 新增 ElDisplay 组件支持超级表格和超级组件的 el 功能 ([108a220](https://github.com/Kele-Bingtang/teek-design-vue3/commit/108a2202fa65099f52d1c934919717f7d70a9019))
- 🚀 新增 renderHTML 配置项 ([81df3db](https://github.com/Kele-Bingtang/teek-design-vue3/commit/81df3db7f4031b1f3e5d50aa5a7585a6369d6654))
- 🚀 新增 VITE_ROUTE_ACCESS_MODE 环境变量，优化组件命名 ([75f5e8e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/75f5e8ef119231492535b07c9a67773888eaab45))
- 🚀 新增标签页风格切换、新增页面动画切换、新增圆角大小切换，优化国际化展示 ([375df66](https://github.com/Kele-Bingtang/teek-design-vue3/commit/375df669e049351d8caf453384dddbec570ee93e))
- 🚀 新增表格基础配置功能，列配置添加禁用选择配置项，优化枚举值在表格回显问题，分页组件添加 align 配置项切换位置 ([4908691](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4908691e6b2021b5aefe163cc3784c3112b27bbd))
- 🚀 新增菜单主题配置切换功能，优化深色模式的字体色和背景色 ([13c1997](https://github.com/Kele-Bingtang/teek-design-vue3/commit/13c1997140b39155e853b2448c0066c83cbb7500))
- 🚀 新增顶部样式配置功能，ThemeDrawer 重命名为 ThemePanel，优化主题面板背景色 ([142c9d3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/142c9d320583c7643d913b49eedae5197db3c094))
- 🚀 新增分组表单组件，提取公共组合是函数和工具类，优化 ProFormItem 的 model 赋值问题，优化部分配置项格式 ([a5a3056](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a5a30567d006c2f8364d34fd7857d3ca21ce4500))
- 🚀 新增卡片、图表组件以及 Demo，引入全新 iconfont 图标，优化图表组件样式 ([dae2596](https://github.com/Kele-Bingtang/teek-design-vue3/commit/dae25964ef49aaf4deaf0bc66eb07e8a293d5759))
- 🚀 新增全局水印功能，新增新版用户头像组件，新增升级公告通知功能 ([c36fe5e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c36fe5e5a194d2422f6c12e01792a634d2d1bc09))
- 🚀 新增全新搜索框组件 ([b6b3575](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b6b357586d1943b2c7aef5ac2ae1d36611c3951c))
- 🚀 新增首页 Demo，修复滚动条靠左问题 ([a1279eb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a1279eba9684b993fdc815f32c87b2f82c40b380))
- 🚀 新增拖拽列功能，支持全局禁用/隐藏列配置抽屉内容，优化导出提示功能，删除部分未使用的配置项，优化组件引入项 ([c20230b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c20230bad0530466723161e17689c07aa7717b02))
- 🚀 样式命名空间重构 ([02e30f2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/02e30f20100f9d40a9e915bf8852e6454d525e4b))
- 🚀 优化 tabNav 命名以及切换样式 ([1af7ec2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1af7ec27a7228115c77f8c7d8040b3d70c7d616f))
- 🚀 增超级描述 ProDescriptions 组件，优化超级组件的类型格式和注释，优化字典枚举获取函数 ([d7eb081](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d7eb081da558a029e54cf6acddd85fbc79c8f705))
- 🚀 bem 新增 el-joins 的 mixin 函数并优化相关代码 ([d57078f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d57078f47a68fa401ddce4146c5e438ecbcd0a74))
- 🚀 build 文件名改为 node，类型，.d.ts 文件统一移到 types 里，删除 tailwincss ([c3c8978](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c3c89783bf69e43ad6c08406bba69b24e3f054d7))
- 🚀 dialog、drawer 优化为 pro ([1fe6ce4](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1fe6ce478ccb676bc3e1d0e3daf2e913419883b7))
- 🚀 frame 改为 iframe，优化 iframe 组件，优化 tabNav 组件 ([af4b16e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/af4b16ebce61a518be25b2741ec4050c81d8a3ca))
- 🚀 setting 命名配置改为 config，且配置项进行分层 ([4ec50dd](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4ec50ddb221e43e17cdfe61ad8b957081cad26f2))
- **权限管理:** 🚀 角色权限页面重构 ([654ea7c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/654ea7ceee119f79026b61160256ae9188064ea9))
- **component:** 🚀 优化组件功能和插槽使用 ([91ffc13](https://github.com/Kele-Bingtang/teek-design-vue3/commit/91ffc135677bae89e94be7da34242c6c15c058ac))
- **component:** 🚀 优化组件功能和交互 ([47aa923](https://github.com/Kele-Bingtang/teek-design-vue3/commit/47aa9233e7dc4c4c70c4f0abcc61bbe777bd1927))
- **component:** 🚀 重构 Pro 组件并添加新功能 ([9a67c40](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9a67c403298d72a8e1b6fe41cb6ba208d89d2a0b))
- **component:** 🚀 el 新增 PointTag 组件并优化相关功能 ([7b8421b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7b8421b049c32d9270dced4ef4f117dff135d878))
- **components:** 🚀 重构高亮组件并添加 CSS 变量支持 ([fd0c956](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fd0c956ae5035c59eb800b7d61120e51008f416d))
- **config:** 🚀 优化缓存清理和错误日志功能 ([cfb0952](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cfb0952ae04f09503f5f6543ecd5780495699ae6))
- **config:** 🚀 重构全局配置并添加新功能 ([c4c7264](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c4c72642b9ff9748126bf341b3489ac8e9056046))
- **core:** 🚀 优化版本升级和数据存储功能 ([43e4afc](https://github.com/Kele-Bingtang/teek-design-vue3/commit/43e4afc9bc7df310e21d138030911b1dd19c6f5d))
- **core:** 🚀 优化存储管理器并添加全局状态重置功能 ([1287d22](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1287d225105933cae6820be47327576a042d6ed8))
- **editor:** 🚀 优化编辑器组件并添加暗黑模式支持 ([6210a23](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6210a238a7a03092b0b90b0fbeeef669d62677b8))
- **http:** 🚀 重构 axios 请求配置并支持自定义参数序列化 ([c0f5e72](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c0f5e72eb1d5944a13984cad7f93d6c339b2c8c8))
- **layout:** 🚀 分栏布局新增隐藏文字和超级表格新增部分配置项 ([fdf4234](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fdf4234eea6f1b5ef9875fb23652e35e0f605b03))
- **layout:** 🚀 添加锁屏功能 ([fb9ebc2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fb9ebc2f7474a7348e1e0d5d5008e89eb702c537))
- **layout:** 🚀 添加页面加载动画功能 ([fd31f14](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fd31f14d33c35f80c2a2a6d9504d4e391a5fa4f4))
- **layout:** 🚀 新增菜单显示模式并优化相关功能 ([b662063](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b662063645f221f3c0eb00a465b602eaf1617299))
- **layout:** 🚀 新增顶栏显示模式并优化布局 ([25c5771](https://github.com/Kele-Bingtang/teek-design-vue3/commit/25c5771bee05b14a50c340d60e1f035cb99b7466))
- **layout:** 🚀 优化布局结构和功能 ([0f9adc2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0f9adc2432f093fd66696ff4411107b8a0a3eb37))
- **layout:** 🚀 优化布局组件功能和交互 ([32d3dc4](https://github.com/Kele-Bingtang/teek-design-vue3/commit/32d3dc49a0a37f51449259e88ac5fc56bd6223f4))
- **layout:** 🚀 优化移动端菜单和布局 ([fbfa9ac](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fbfa9acc4be77805672922e217c4a714dc93c1e2))
- **layout:** 🚀 增加菜单底部折叠触发器和用户头像 ([a20a649](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a20a64996ffaa2a81d9335ec665759bf3090262e))
- **menu:** 🚀 添加右键关闭菜单栏功能 ([157bb1e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/157bb1eaaa51ba497a323988cb6a4b478e69b4e0))
- **menu:** 🚀 新增菜单风格设置并调整菜单主题 ([f3e699f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f3e699f6aca27c738506de6b0e350d9f24a0f32b))
- **menu:** 🚀 左侧菜单支持 tag ([594fc12](https://github.com/Kele-Bingtang/teek-design-vue3/commit/594fc12a86b2df3fe89b3fb6e88c9761c7443107))
- **pro-descriptions:** 🚀 优化 API 并添加新功能 ([9339428](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9339428f2fcc3c51f0dcddfc8f9d0105dd7e4a87))
- **pro-table:** 🚀 添加控制表头栏的图标列 ([07d9889](https://github.com/Kele-Bingtang/teek-design-vue3/commit/07d98896f38a9f9b69d28548f6bb6855a0645cc9))
- **pro-table:** 🚀 优化表头设置和表格列配置 ([0bd6271](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0bd62713c825a0b40ecba56141af6423250a125f))
- **pro:** 🚀 优化 ProTable 功能并添加创建 ProPage 页面 ([cb7ad59](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cb7ad59b51392756e0c822c0f005326bad6fbb5b))
- **pro:** 🚀 优化表格过滤功能并添加前置处理 ([6d9a568](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6d9a568dbe28fbe7f1b3d12b23e316ed28b8ca5f))
- **router:** 🚀 完善路由权限控制并优化加载逻辑 ([c99825c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c99825c23f0c31be48b0ffc1c4c570c72e61a386))
- **router:** 🚀 重构路由模块 ([a384864](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a38486493b01041bcffa3e2fa534203498b55b27))
- **table:** 🚀 优化 ProTable 组件功能和性能 ([4bd71d0](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4bd71d06bd452a40333e165244f3cd27d65c1beb))
- **table:** 🚀 优化表格单元格编辑功能 ([c58df89](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c58df891ba26d3e5b1056b437161291bf59032a5))
- **table:** 🚀 优化表格列字典值获取逻辑 ([9880269](https://github.com/Kele-Bingtang/teek-design-vue3/commit/98802693175734e7f2e7ef06d60f6cda1710b9e4))
- **table:** 🚀 优化表格组件功能和性能 ([e973dc6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e973dc60850e4188a7e5b625b20cf2ba78a0cdea))
- **table:** 🚀 优化表格组件功能和样式 ([45a42cf](https://github.com/Kele-Bingtang/teek-design-vue3/commit/45a42cf6d6d0da0ca5f469e45ae9ae252bee89ef))
- **table:** 🚀 优化过滤功能并添加新特性 ([f3c0685](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f3c0685a44225ed1010f4bc5afdc26d15af85654))
- **table:** 🚀 优化过滤图标激活状态样式 ([c200bd9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c200bd91e43b5ea3ebd516b7da5ca88f7c6f8ecc))
- **table:** 🚀 增强表格列配置功能 ([a4cd381](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a4cd381fb735cf5537c43f30af487327dd6dfa8f))
- **tabNav:** 🚀 添加标签页最大数量限制功能 ([7ecfca3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7ecfca3492fa1401421565f2554decfee245cd2a))
- **tabs:** 🚀 优化操作 Tree 工具函数和标签页 Demo 功能 ([5db1e19](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5db1e19488b3172f0aa19b5829068e9660a38d44))
- **theme:** 🚀 优化主题配置并新增暗黑主题样式 ([bc647aa](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bc647aa868a2ee365820d316d18396ffab383b77))
- **todo:** 🚀 升级项目依赖和优化 IFrame 组件样式 ([7568a82](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7568a820d75a71d12fafbf2dd22623368c4b8066))
- **websocket:** 🚀 优化 WebSocket 功能并添加相关页面 ([1d84507](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1d8450756aaac9ee5ac3c6b6ddf84cd1b62ddbc2))
- **workbenches:** 🚀 优化常用链接组件并添加管理功能 ([a694b2f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a694b2f30c518e66f1ccc48858fc4a8da1a23287))
- **workbenches:** 🚀 优化会议日程功能 ([18f3c47](https://github.com/Kele-Bingtang/teek-design-vue3/commit/18f3c47c7ff7d25ecaacf7a5d6e989416a4d7d8f))
- **workbenches:** 🚀 重构工作台页面布局和组件 ([b1e9466](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b1e946667bcb03920238d9dac3ed2fee4dce0a12))

### Bug Fixes

- 🐞 删除不需要的 2 个依赖 ([d4530bb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d4530bb9da13af624988da592bdf932806b85c85))
- 🐞 修复 primaryColor 没有初始化问题 ([6dd23d5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6dd23d5dbd6e1d63b9b9e925977f26530d65c5eb))
- 🐞 修复 ProFormStep 组件的 modelValue 不更新问题 ([e012393](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e012393c5f484713fb93d0bbfd17966518998c85))
- 🐞 修复 stylelint 引起的样式语法错误导致打包失败问题 ([16272a5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/16272a58392957cb28aa66069b4aa7d9a10c04cc))
- 🐞 修复标签页切换经典模式失效问题，修复超级表格 options 和修改 props 失效问题 ([8433ce1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8433ce15f87a8b76b19613d6a17025c62ce188a2))
- 🐞 修复超级表格和超级组件的枚举失效问题，修复超级页面搜索功能失效问题，超级页面新增枚举获取和下发功能，超级表格新增表头显示或隐藏配置项 ([0e1bac8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0e1bac83ef93d1ac60cd3a87a1ba617a3d1c97ff))
- 🐞 修复超级描述编辑时，字典枚举不更新问题 ([51c8d0d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/51c8d0d7621cc6ee29c4238b0c991f4c74f34dcf))
- 🐞 修复多级表头失效问题 ([3ae2c07](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3ae2c07bbbf70cc00480e8fdfdd44a6cd1832d3f))
- 🐞 修复面包屑动画失效问题，修复布局组件 meta 影响所有组件功能问题 ([6df4683](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6df4683f0c3f8571d30290fddfc58a24bc803b70))
- 🐞 修复样式函数和 ElementPlus 的函数冲突问题，优化 stylelint 配置 ([6421812](https://github.com/Kele-Bingtang/teek-design-vue3/commit/642181210f5b011fb8758dbcb9b734de8532776e))
- 🐞 修复依赖缺失问题 ([096e5d8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/096e5d88c9218223af93a3bae5e0ecd0f8210641))
- **editor:** 🐞 修复 CodeMirror 控制台报错并优化相关功能 ([6c55118](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6c551189ef1e35ca8a0bccf4f4aca7179f3845ae))
- **icon-picker:** 🐞 优化图标选择器 ([a70e7d9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a70e7d9ae74de0ae84031e095e273531c1f7dd9e))
- **layout:** 🐞 修复横向布局菜单滚动条问题 ([a5150df](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a5150df6d04e1cf8bba1b9fe27419d14726879fc))
- **pro:** 🐞 修复 ProDialog、ProDrawer 函数式打开后，关闭无法滚动浏览器问题 ([0cdc601](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0cdc601841e71ee2ffe30dff91871b2d645b9e83))
- **pro:** 🐞 优化表格组件操作按钮功能和样式 ([dbafc0d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/dbafc0d40a73d5e802e77b8184f07347c129e1d2))
- **tinymce:** 🐞 修复页面无法访问问题 ([3a91b9b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3a91b9b92b13ca023ee8599ee6afde8f76966b60))

### Performance Improvements

- **layout:** ⚡️ 优化热重载时的 loading 状态 ([a0cd00c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a0cd00cbeca57567773459592433db730d9844e6))
- **theme:** ⚡️ 移除生成浅色系颜色的代码 ([8c8aa76](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8c8aa76bb08d96663ee58c178ac721fd238f6572))

### Docs

- 📚 更新 TODO.md ([83b995b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/83b995b79405a3bd151f1af6a3c732b55960741a))
- 📚 更新 TODO.md ([16527ff](https://github.com/Kele-Bingtang/teek-design-vue3/commit/16527ff8caafce1a66dd40d0c4b279a33d3fbead))
- **comment:** 📚 更新代码风格、新增函数注释和类型引入规范 ([6194fa8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6194fa8d082a0f741ab88affe9078aed73eaa355))
- **README:** 📚 更新项目名称和版本信息 ([d216aae](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d216aae0fba17d5cfb4535147ad24dcd2fb93282))
- **README:** 📚 更新项目文档和说明 ([62e59ef](https://github.com/Kele-Bingtang/teek-design-vue3/commit/62e59efc268d91e7ff80c3f1c9bac36a05d29a13))
- **table:** 📚 更新 ProTable 组件文档 ([8d5633c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8d5633c6e03d53c11dccbe0c4580a4b0d5e22277))

### Styling

- 🎨 文件引入顺序优化 ([23df55d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/23df55d101efd013b40e5fc218119b5b5aabb733))
- 🎨 优化卡片和图标的样式以及代码风格 ([19fb1f9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/19fb1f9ed4049e5bc262c47f402326b0149a14dd))
- 🎨 kbt-vue3-admin 改名为 teek-design-pro ([2ec0c43](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2ec0c4370cc8d12fdc1f64e8f3a30e43791ae30f))
- 🎨 mitt 使用 symbol 代替字符串 ([f42ba3f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f42ba3f3e74a303bfbae50a968aa6669ba859230))
- 🎨 teek-design-pro 改名为 teek-design-vue3 ([897fd10](https://github.com/Kele-Bingtang/teek-design-vue3/commit/897fd10f4ab6faf9e0d9b2d24daf95b09bdd2aff))
- 🎨 优化卡片样式和颜色主题 ([94f7156](https://github.com/Kele-Bingtang/teek-design-vue3/commit/94f715619b5427ae15987e5c752379260e005eee))
- **color:** 🎨 优化颜色处理函数并统一主题颜色 ([952722f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/952722f84dc3f39bd5f10a5c622d8df832a47293))
- **layout:** 🎨 优化布局样式和菜单主题 ([cc0511a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cc0511ac5cc4a67b0c1c91b4fdf3022517988ddd))
- **pro-table:** 🎨 优化表格高度设置 ([f66000a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f66000ad43915bc098025846f532d5254c2aa2b7))
- **router:** 🎨 更新路由图标和布局 ([b0b0711](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b0b0711db60dc1e25cb81845aed69325291ee7cb))

### Others

- 更新网站图标和日志 ([ab8df42](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ab8df42a47b83828b65ae816bd294c4303504d07))

### Code Refactoring

- ♻️ 布局相关组件 class 和样式转为 BEM，代码结构优化 ([ec86155](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ec86155484c5095afa6dd713e7f97040bbf25739))
- ♻️ 超级表单重构为模板风格，优化超级表单 Demo ([8c62c4a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8c62c4ade081ae7ddb81db63dc11e41fa9774ca2))
- ♻️ 超级搜索组件代码重构，适配新版超级表单组件，超级表单组件新增部分配置项 ([3a9910c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3a9910c18fae29a9f03556417b2c9d7bc17b33b6))
- ♻️ 超级组件代码采用 composables 风格进行重构 ([cb9db38](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cb9db38e14113101d35804b686ce74bc81473f95))
- ♻️ 持续优化表格过滤功能 ([9c50044](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9c50044a41b016be0830821611c8905632f5915a))
- ♻️ 持续重构 ProTable 以及相关组件 ([78e7457](https://github.com/Kele-Bingtang/teek-design-vue3/commit/78e74573d28ff49539f20dbc1452fd83a3b1435d))
- ♻️ 持续重构 ProTable 以及相关组件代码，ProTable 新增筛选功能 ([efbc16e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/efbc16ed85253e638094d0921e828d687e4e37fd))
- ♻️ 命名空间由 ns 函数代替 prefixClass，错误页面适配移动端 ([3b116da](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3b116da59eccf175e05b7f6242bf1c46b8b5bdbf))
- ♻️ 使用 useTemplateRef 重构 ref 引用 DOM 元素 ([277d9ac](https://github.com/Kele-Bingtang/teek-design-vue3/commit/277d9ac76b692b269592cbdb1ba5b364893a4488))
- ♻️ 所有布局组件样式全面重构，class 使用 bem 设计，部分样式使用 css 变量 ([73fd28c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/73fd28ca911eccb9b32f6498f0b7eb7a1d509d4f))
- ♻️ 所有文件名全部改为 KebabCase 风格 ([e68985e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e68985eba6465d8ed57b69d5f5506daed2c15498))
- ♻️ 样式大架构重构，六大布局样式重构，抽离公共样式到 base-layout.scss 文件 ([2f5ab72](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2f5ab721855f4109f9fd28c45009b8ccab2a608f))
- ♻️ 样式文件和样式目录优化，系统配置目录优化，支持不同环境变量的系统配置，优化配置项的枚举类 ([eac4dc8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/eac4dc8edfca85be564853a20feedd1f2f1d0719))
- ♻️ 移出部分样式的 !importance ([52c6bd8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/52c6bd8f55daa683d2efa3c90ea56c498d6d6935))
- ♻️ 优化 Chart 相关 composables 函数逻辑 ([4371ff4](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4371ff4ce1e705eb5fc877233db22bca3bffae39))
- ♻️ 优化 useRoute 相关函数 ([5abeea2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5abeea28a769c538309af4ef84c054720ff0acf1))
- ♻️ 优化登录组件，支持移动端 ([368a767](https://github.com/Kele-Bingtang/teek-design-vue3/commit/368a7670aeb6e7657eb67b3152a0385efaf06233))
- ♻️ 优化通知功能和我的主页页面 ([aabd0da](https://github.com/Kele-Bingtang/teek-design-vue3/commit/aabd0dabf38d64f9524f3c784a873f6003c6bab0))
- ♻️ 重构 useLayout 文件，优化 composables 核心代码，userStore 逻辑优化 ([a3eb27d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a3eb27d4a7c4a190069ca2ad1b5016981d0f4cb6))
- ♻️ 重构菜单目录结构，优化部分代码 ([c007d82](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c007d82650e689918c4961e81e1b2def3b6c9775))
- ♻️ 重构目录结构和命名，重构首页页面，新增 vite-plugin-vue-devtools 依赖和部分 alias 文件路径 ([89d261b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/89d261b96de6313bcccb660f7d457a67b6bd3d95))
- ♻️ 重新优化 ProTable 的 TableMain 相关代码 ([fa8fa5f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fa8fa5f790f518b85c7f70057949118c6f963eda))
- ♻️ 主题面板重构布局切换样式，新增主题风格切换配置，重新命名部分组件 ([449c69b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/449c69b411bdc7614993109b8c83251c1143ca2a))
- ♻️ 组件的 template 移到 script 后面，icon 组件去掉 useIcon 和 ts 相关文件 ([3793248](https://github.com/Kele-Bingtang/teek-design-vue3/commit/379324841fd7549213c15d16b6cbbe149363a379))
- ♻️ aside 采用自定义 css 变量覆盖 el 菜单 css 变量，适配暗黑模式，布局样式优化 ([1c2b565](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1c2b565b344faeae6461e28361c554c50fee07da))
- ♻️ layout 组件以及文件统一改为 KebabCase 风格 ([4e5e2d7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4e5e2d7c1ca40fa44937e20726bb2b7f94525925))
- ♻️ settings 相关代码、文件改为 setting，EP 组件尺寸切换功能移到我的设置里 ([efe55a2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/efe55a2491a6ed69f1dbca115b180974fdd061a7))
- ♻️ unref 全部去掉，改为 .value，store 属性由 computed 计算改为 storeToRef 解构 ([63b6677](https://github.com/Kele-Bingtang/teek-design-vue3/commit/63b6677fd079c017865533cb2ffc3f19249626d4))
- ♻️ 将 unknown 类型替换为 any 类型 ([2203757](https://github.com/Kele-Bingtang/teek-design-vue3/commit/220375743ddd39c3563a46e572697fbcac1760f9))
- ♻️ 为 composables 返回的变量添加 readonly 修饰符 ([98cc9ea](https://github.com/Kele-Bingtang/teek-design-vue3/commit/98cc9eaec770f67673f5ff039aacc0c992baf4bf))
- ♻️ 优化代码结构和样式 ([c80347a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c80347aa8ab261f93fd600d784a0d841284fcf20))
- ♻️ 重构 utils 目录和 Storage 和 Cache 函数 ([083354f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/083354ff23d706eca50e1e271c259f9bd3b7eece))
- **chat:** ♻️ 重构聊天组件 ([9a9979a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9a9979aeabf4d489b3874db327e2514530d51886))
- **common:** ♻️ 优化 UUID 生成逻辑 ([2cb9fb8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2cb9fb833acda73c6b98d60b85b100326e1d00fd))
- **component:** ♻️ 重构超级组件属性和方法 ([a9b8adf](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a9b8adf6a3ed94ea92597e7c13683eecaaaadd69))
- **component:** ♻️ 重构页面组件代码并优化样式 ([136ab26](https://github.com/Kele-Bingtang/teek-design-vue3/commit/136ab2657c7700cd8d4ed8c037eb15c9d7dbafac))
- **components:** ♻️ 优化 Tree 组件并添加支持 ([84277a1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/84277a1fa7148b96bf3473f37a362d7bdaf9ec34))
- **components:** ♻️ 重构卡片组件和图标组件的目录结构，升级 codeMirror ([eb9d0ee](https://github.com/Kele-Bingtang/teek-design-vue3/commit/eb9d0eea721808528db8b73bab26d4a1f3aafc2d))
- **components:** ♻️ 重构组件中的模板引用 ([2e4d015](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2e4d015e4cbc4a9aff57b77a6c24d2ecd3966491))
- **components:** ♻️ import 导入依赖和重构组件库结构与样式 ([77a546c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/77a546c76162613853247cd007b803a298a9a16e))
- **composables:** ♻️ 重构表单验证器 ([101d5e0](https://github.com/Kele-Bingtang/teek-design-vue3/commit/101d5e05d0712753b5e43a23e312e16ce7d5168e))
- **config:** ♻️ 重构配置模块并优化相关功能 ([9015c8a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9015c8ab2653d9a709aa235bcab925f109ac11bd))
- **css:** ♻️ 重构 CSS 变量使用方式 ([c60a24e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c60a24ef6222314821fdb68c73ac8db8b752a3af))
- **directives:** ♻️ 优化指令功能和代码结构 ([28134e9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/28134e950033a6a39f2e40572150f57028a40761))
- **http:** ♻️ 重构 HTTP 模块 ([2961234](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2961234471e888afd1f0184f62769ccae33feb73))
- **layout:** ♻️ 调整侧边栏样式并优化颜色处理 ([efd2d0f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/efd2d0f5709f1eb3d29a4896a1bc1a1456ee0a93))
- **layout:** ♻️ 新增工作台页面和优化 tooltip 组件使用 ([984a214](https://github.com/Kele-Bingtang/teek-design-vue3/commit/984a214b6916b62cae70450b0708ff6898c97b4d))
- **layout:** ♻️ 修改消息中心跳转路径 ([1ae435b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1ae435b7131f5b02a08e9fca806909d83ac05221))
- **layout:** ♻️ 优化 tooltip 组件使用和ProTable新增配置项 ([b4a1167](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b4a1167b67378707a01f0e9c6a424da3916667a9))
- **layout:** ♻️ 优化标签页逻辑和布局 ([b414644](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b4146441dd0324440fff352ff99847a03391b916))
- **layout:** ♻️ 优化标签页图标显示逻辑，超级组件添加注释 ([798d82b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/798d82b93e1e71ef7601be04ed045f41b2fe78b1))
- **layout:** ♻️ 优化锁屏功能并调整工作台布局 ([24c303f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/24c303f0f32f917e8e2faa9182bb5e013c9dee50))
- **layout:** ♻️ 优化锁屏组件并添加新功能 ([ad6ec3b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ad6ec3bf787e5828444820793fafa5086c3e30a7))
- **layout:** ♻️ 优化页面内容区域样式 ([e8420c0](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e8420c0a6189f0acae8cdf1b692758af3475ace1))
- **layout:** ♻️ 重构布局组件 ([2162a23](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2162a237812113e79ec4ef35aaa7fe46dde2c588))
- **page:** ♻️ 重构页面组件和编辑器组件 ([19746b1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/19746b1dea42463a0b825b36dd0caaed61b8b150))
- **pro-table:** ♻️ 优化 ProTable 组件性能和功能 ([9aa84fc](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9aa84fceacb62251794b8720aab9b6b3214bc337))
- **pro:** ♻️ 重构 Pro 组件的表单相关逻辑 ([639fd93](https://github.com/Kele-Bingtang/teek-design-vue3/commit/639fd93f0f93f79d87830fd9bc9e4d78753d828b))
- **route:** ♻️ 更新代码风格指南和国际化相关代码 ([a3e7c39](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a3e7c39cb6862c62172215b93720ecda10cfce8c))
- **router:** ♻️ 更新路由配置中的文档和外链地址 ([b16a3a3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b16a3a39174dc22c89cc839110b49eace2363932))
- **style:** ♻️ 调整暗黑主题样式和命名 ([0dfaba2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0dfaba2a08681b6110bcba1c1081f8d2cd431d3f))
- **style:** ♻️ 重构颜色生成器样式 ([55e7ace](https://github.com/Kele-Bingtang/teek-design-vue3/commit/55e7acec2d7dee3b21fbd3a221717682f725dac2))
- **style:** ♻️ 重构样式体系并调整颜色主题 ([34da6b3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/34da6b32b76cb0827dd449c82d222316b46eb708))
- **styles:** ♻️ 将 admin-namespace 重命名为 teek-namespace ([26ca9db](https://github.com/Kele-Bingtang/teek-design-vue3/commit/26ca9db3c67b1cf87477052192d0bdf9f451aec3))
- **styles:** ♻️ 重构样式体系 ([afa2ee0](https://github.com/Kele-Bingtang/teek-design-vue3/commit/afa2ee021f63d00d8adf4895f4aa627aa4da602e))
- **styles:** ♻️ 重构样式文件中的命名空间引用 ([bbb8e22](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bbb8e22dc47023e09d0cdf4b7276ae49116c020d))
- **table:** ♻️ 重构表格组件初始化 row 函数和优化文件结构 ([e4ab682](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e4ab682c49cddef98d6fec41435efb8b5051fba6))
- **table:** ♻️ 重构表格组件的数据请求和分页逻辑 ([045040a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/045040a5b39db9a4f3661303c992e6fb25af9f67))
- **theme:** ♻️ 优化主题相关功能和布局 ([22caef9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/22caef930dfa532045796ad242dbfac0c3d18c78))
- **theme:** ♻️ 重构主题配置和样式 ([da7a217](https://github.com/Kele-Bingtang/teek-design-vue3/commit/da7a2172938a326fc305438154cc021ad8c0e8bd))
- **theme:** ♻️ 重构主题配置和样式 ([608cbef](https://github.com/Kele-Bingtang/teek-design-vue3/commit/608cbef0016b283feb1eacc8a48c0b0586926404))

### [1.5.1](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.5.0...v1.5.1) (2024-12-26)

### Features

- 🚀 引入 TailWindcss 功能 ([85ba541](https://github.com/Kele-Bingtang/teek-design-vue3/commit/85ba541492e3b5451711706f5c28025bfe424190))

### Bug Fixes

- 🐞 修复部分样式 ([8d6ad07](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8d6ad070b31fc9a589c63c7f9faa9a9aae791adf))

## [1.5.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.7...v1.5.0) (2024-12-26)

### Features

- 🚀 升级 i18n 依赖，更正 persistedstate 新版的 api ([b311677](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b311677669d3fab1571992859de656d806904523))
- 🚀 依赖升级，Eslint 升级 9.17，sass 升级 1.83.0。修改文件兼容每个新版依赖 ([0ebdac8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0ebdac8bbfc4e2c1aede5df4d2f5e6b6136a484b))

### Bug Fixes

- 🐞 修复 eslint ignores 忽略指定文件失效问题 ([8e5360c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8e5360c2adca593247cf1b535ce55aa1f7e83b2b))

### [1.4.7](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.6...v1.4.7) (2024-11-23)

### Features

- 🚀 使用 mittBus 添加页面刷新功能，UseDialog 函数优化 ([e1707fb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e1707fba59487fad733aeccbda26f6ea4683d7e5))
- 🚀 新增富文本内容解析图片和附件工具 ([def84fe](https://github.com/Kele-Bingtang/teek-design-vue3/commit/def84fea606ea9f12297d85230e3f381af202713))
- 🚀 proTable 过滤支持全部数据过滤。支持取消卡片样式。支持自定义行不使用编辑和删除按钮 ([f4b1c98](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f4b1c98fe36ad0a3bd068746b2773f5404bc5c92))

### Bug Fixes

- 🐞 修复 CodeMirror 使用 fullScreen 后，值为空字符问题 ([aa17b18](https://github.com/Kele-Bingtang/teek-design-vue3/commit/aa17b18f3dfb5e93b73e698f2a2c961a6f22f6d5))
- 🐞 修复值为 0、false， valueFormat 失效问题 ([1b6a80a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1b6a80a56c941f6bacde0a382c22fde6516413f3))
- 🐞 子路由 hideInMenun 全为 false 时报错问题修复 ([324e39c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/324e39c50491e3e56b27b85ae28f63c8ccf19092))
- 🐞 proSearch useCollapsed prop 优化 ([12cdac9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/12cdac95f0fd527e963d41f412060809e85654d1))

### Styling

- 🎨 去掉不需要的引用 ([7df49a7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7df49a7184eb3be5d346641a6e376f47508ddfba))
- 🎨 去掉不需要的引用 ([9bd30f9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9bd30f9df7b986ef36de5d1f009feae759c4593a))

### [1.4.6](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.5...v1.4.6) (2024-07-21)

### Features

- 🚀 proForm 的 Schema 支持 Computed 计算 ([c88fef8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c88fef85bc040fba994462f6026c8f26d63b75a8))
- 🚀 proTable 导出功能添加可选导出列后再导出 ([d645754](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d645754ff803028326c025ffcbb601b46fe80e4b))
- 🚀 useDialog、UseDrawer 新增 maxHeight prop。Vue 组件额外添加 confirmLabel、CloseLabel prop，并添加文档说明 ([5539f1f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5539f1f6c93000a9d97958e18b5e0eaf9fb3c3b2))

### Styling

- 🎨 添加类型引入 ([ff23f30](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ff23f30a0a03d3abe280e2e423ceb116611bbd38))

### [1.4.5](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.4...v1.4.5) (2024-07-03)

### Features

- 🚀 防抖和节流指令支持指定的限制时间传入 ([fa22f98](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fa22f984e67fc23583a30111c04489a672ad5551))
- 🚀 过滤新增 CheckBoxSelect 组件代替 ElSelect 组件。ProTable 新增自定义分页信息配置项 ([e60b2e1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e60b2e1599d048a5a09fcd9981f1f4391bbe68fd))
- 🚀 新增 isEmpty 空值判断（包括数组、对象），validate.ts 文件重命名为 is.ts ([9ae9daf](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9ae9daf4814d12ed608ab780c48b51249a61a6af))
- 🚀 修改 EP 的五个主题色。ProTable 过滤功能添加选择高亮 ([59e4379](https://github.com/Kele-Bingtang/teek-design-vue3/commit/59e437934bd1e84a363ca7261278b2233a0caa9d))
- 🚀 codeMirror 新增全屏功能。ProForm 解决禁用配置项不生效问题 ([fd354f2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fd354f24ca05aec3ee2b2f87cc9938565f3e51b7))
- 🚀 proTable 添加 ElButton Link 属性渲染单元格 ([53d311d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/53d311d5cc03624c58ff14238c1dcb1fffc3ed67))

### Bug Fixes

- 🐞 公共组件优化，样式优化 ([6eb4d30](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6eb4d3032cf7ff6b16f1023f2d65a7d4d02e32d5))
- 🐞 修复 CodeMirror 全屏按钮位置错位问题 ([aa11c6e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/aa11c6e241034dab412bec9acd4984d7d0f3c34c))
- 🐞 useDialog、UseDrawer 确定和取消按钮逻辑优化 ([4422983](https://github.com/Kele-Bingtang/teek-design-vue3/commit/44229830f66568f37d0fad1d6363be23ad8cbbec))

### Code Refactoring

- ♻️ 去掉多余的重复函数 ([0b2de24](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0b2de2484e0070d7032b57965b5be321f5d34e78))

### Styling

- 🎨 useDialog、UseDrawer OnConfirm、OnClose 逻辑优化 ([b2862c5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b2862c58782230615839c4a002e883ee60f04860))

### [1.4.4](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.3...v1.4.4) (2024-06-23)

### Features

- 🚀 proForm 添加 colRow props 快捷让每一个 col 独占一行 ([9cff921](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9cff9218af30888c46972cd82fc08316660d9770))
- 🚀 proForm 新增 label 为 Computed 类型逻辑处理，ElSelect 支持 enum 里指定 disabled 实现禁用功能 ([b9f3b09](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b9f3b09fc7b750796656da1b9a2a0cbd88d30d2f))

### Bug Fixes

- 🐞 路由重置函数优化。添加 403、404、500 路由。路由加载函数优化 ([4b0cc7f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4b0cc7f82f0f0bd4bc8e3d7176bcd0ac33cc933a))
- 🐞 修复 UseDialog、UseDrawer 使用 inject 失效问题 ([f9242d3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f9242d3b0b80c9829c88ac54d7649e606017563a))

### Styling

- 🎨 添加路由配置的使用注释 ([00ef51e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/00ef51e5d263e7630495ce2f5252cded89951a39))
- 🎨 useDialog、useDrawer 的 onConfirm 和 onClose 添加 Promise<void> 返回类型 ([18c9dbd](https://github.com/Kele-Bingtang/teek-design-vue3/commit/18c9dbdd17d0e8844b738ecc562aef82c484f9ff))

### [1.4.3](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.2...v1.4.3) (2024-06-20)

### Features

- 🚀 新增 removeBatchTab 函数，优化路由初始化判断，路由配置支持菜单 render ([3763517](https://github.com/Kele-Bingtang/teek-design-vue3/commit/37635173cebd31d1e827156b0afd81019b129b4b))
- 🚀 proForm 新增 ElToopTip 提示功能，位于 label 右上角 ([20b1c0c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/20b1c0ca249010b85a14bd85ffe7c66a77bd7002))
- 🚀 useDialog、UseDrawer 的 onConfirm、onClose 函数支持 return false 阻止关闭。UseDialog 弹框全屏高度计算优化 ([2992d65](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2992d65391ce85142759846e91f3ac0fe25ea59d))

### Bug Fixes

- 🐞 useDrawer 阻止关闭判断优化 ([fe89e20](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fe89e20aa325e4a24045660931c8c02ce56c1ba0))

### Styling

- 🎨 登录逻辑移到 router beforeEach 里 ([509720f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/509720fe6a73eb5e9533fad396c3421424afcbe4))
- 🎨 主题色悬停 class 重命名 ([e7dd6bd](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e7dd6bd4bd27b2245f08f3e14fda281fffecdf53))

### [1.4.2](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.1...v1.4.2) (2024-06-16)

### Features

- 🚀 安装 @types/qs 依赖 ([a1ef5c7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a1ef5c7df01abce55db136b322049b8a47ef5045))

### Bug Fixes

- 🐞 proForm 删除的 key 由一级 key 改为具体的嵌套 key。修复 DialogForm includeModelKeys 循环处理问题 ([41f39f6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/41f39f6ea164d82c784e2f6b883fe25844aad244))

### Docs

- 📚 更新 README 文档 ([042f97b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/042f97b7364703865557e7f3b30eb47485725fbd))

### Styling

- 🎨 修改 MainContent 默认样式 ([c52b0f7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c52b0f78666774bacda604aff0cb163095eafa55))
- 🎨 mainContent padding 样式去掉 ([ee3539b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ee3539b84dc96f5a630ae5d08918c3595c74ef6a))

### [1.4.1](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.4.0...v1.4.1) (2024-06-14)

### Features

- 🚀 ProTable 添加内置按钮数组禁用 props。修复 ProTable 批量删除按钮 disabled 失效问题 ([0431572](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0431572dc3febe1ba7926de9812723f0201ce767))

### Bug Fixes

- 🐞 解决部署访问失败问题 ([298bcef](https://github.com/Kele-Bingtang/teek-design-vue3/commit/298bcefdf54b0e61933e21248fc67a8b2d6e8504))
- 🐞 修复 ProTable 和 log 类型 ([0d21148](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0d211484e32eb4cb04229ef9b548a12245b23bf0))
- 🐞 修复 ProTable 使用 enum + el-search + key 后，当 enum 为接口时重复调用两次问题 ([0b93ed4](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0b93ed48179f27d6401e7ed8df5bcb0eb33416a4))
- 🐞 dialogForm 的 handleAdd 添加 Event 判断。ProTable ProForm 接口适配直接返回数据以及 .data 里取数据。ProTable 导出优化，支持自定义导出方法 ([2c74f73](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2c74f7369e619961203f79d3335680a8f21a36e1))
- 🐞 dialogForm 的 handleEdit 添加 Event 判断 ([8cc9873](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8cc9873b1fe668ed9008265b06b56e08f50364a8))

### Styling

- 🎨 更改 settings 默认配置 ([bee3f6c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bee3f6c40de6c3771c45667f31e1443f3b199f4d))
- 🎨 去掉全局 log 打印，解决生产访问失败问题 ([8ba3e04](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8ba3e04c0cbe42238d1f0a3e10ed3442fcca84d0))
- 🎨 添加 log 打印介绍功能 ([4ff899c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4ff899c438f170c7d6ea6f38d419f34e26e62017))

## [1.4.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.3.4...v1.4.0) (2024-06-10)

### Features

- 🚀 添加全局 log 打印功能，支持 base、info、success、warning、danger、error、table、picture 函数美化输出到控制台 ([d7fc3e5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d7fc3e5158d2554e712acf8b928c02a9fc63dde0))
- 🚀 新增 WebSocket 的 Store ([397b8e4](https://github.com/Kele-Bingtang/teek-design-vue3/commit/397b8e4a11d8ca4ab2975bc735c5902060aaf15b))

### Styling

- 🎨 分页 padding 修改。ProFormItem render 传入 style ([9f78354](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9f78354dfbff47b44cf2350162a43e7b8ceb1c21))
- 🎨 dialogForm 代码格式修改 ([68b0d5a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/68b0d5a03c9d1baae9abe657c890681c805943b9))

### Docs

- 📚 更新 README.md 文档 ([94075be](https://github.com/Kele-Bingtang/teek-design-vue3/commit/94075be902f0d19caad08c6696413cea71107ff7))

### [1.3.4](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.3.3...v1.3.4) (2024-06-06)

### Features

- 🚀 proTable、ProForm 添加是否使用缓存 enum 配置项 ([7ede707](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7ede707fed690215f176d8f4f3239ca2c121e1b5))

### Bug Fixes

- 🐞 修复 ProForm 的 Select 渲染 undefined 值。添加常用的原子 class。封装 DialogForm 传给 Dialog 的 props ([c745a3e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c745a3e706a49243af479dc4c02f8b48001d00b9))
- 🐞 修复 ProTable enum 调用接口获取字典数据后，ProSearch 和 DialogForm 使用了 ProForm，导致重复获取调用接口重复获取字典数据问题 ([fc5f6a8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fc5f6a8c8fb1423176659e4d296d8e9cd6841883))

### Styling

- 🎨 iconPicker 添加 tip props。修复 IconPicker 传不存在的 icon 名字报错问题 ([b01a5fe](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b01a5fef31bfb9f3fc898951f0b0c93a41ab1b13))
- 🎨 useDialog 默认高度 400。ProForm 添加自定义组件的 style 透传。ProForm 内置 IconPicker 组件 ([d2abc0c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d2abc0c83a55ace0fded036b665ad867bfa767c4))

### [1.3.3](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.3.2...v1.3.3) (2024-06-05)

### Features

- 🚀 treeFilter 添加部分 props 功能 ([fd26055](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fd2605510f7ff2bf565fd464fa3d27e97748719b))

### Bug Fixes

- 🐞 修复静态资源找不到问题 ([7260689](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7260689b2a8939b2b167f9122917bbb5d185edf3))
- 🐞 修复类型丢失导致打包失败问题 ([8acc44d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8acc44d659629cbffa14f4fac9047d1f136c49cd))

### Styling

- 🎨 超级组件 create 函数支持在 script setup 直接使用。message 函数支持 ElMesage 的 plain 以及默认开启 plain ([e211188](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e21118847ffac4e28860a37b3b70378700d4f316))

### [1.3.2](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.3.1...v1.3.2) (2024-06-04)

### Features

- 🚀 proForm 新增 includeModelKeys prop，指定不要被自动清除的 key ([6a1f5f9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6a1f5f994c8fe921b14db8d2eb611a39126bdbee))

### Bug Fixes

- 🐞 解决部署 Vercel 后，路由刷新 404 问题 ([deb412b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/deb412bff48a595d082fb9a3628871cdddc3784e))
- 🐞 修复 ProTable 初始化重复发起请求。DialogForm 内容修复 ([cc3bb2d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cc3bb2de2555293f9b77e5ac354182eb6c90bd65))
- 🐞 重构 DialogForm 组件代码，修复部分缺陷 ([f592db6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f592db632245484a86a9b2e8139d97790950a7c2))

### Styling

- 🎨 添加 vue 引用的导入 ([37ef9b2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/37ef9b2724a54c78996d2673b3de3438e58a646b))
- 🎨 scss 样式引入位置迁移。优化部分 TS 类型 ([1bf4f2f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1bf4f2f6709eb0c91d7df4c2f3a978a13d3a4eea))
- 🎨 useDialog、UseDrawer 添加 footer 插槽 ([0ada931](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0ada9311ff52533b22b9069085e7e0ea21949692))

### [1.3.1](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.3.0...v1.3.1) (2024-06-03)

### Features

- 🚀 proTable 新增行内编辑校验必填方法。Pro 组件 create 函数支持传入 ref 或者 shallowRef 对象 ([940a92f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/940a92f6943669aa2f3715ff60c8010a9294b1c6))

### Styling

- 🎨 proTable 去除 Demo 代码 ([424eac8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/424eac8eed7cfa3838c7640fcfe8cc95b181b184))

## [1.3.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.2.0...v1.3.0) (2024-06-02)

### Features

- 🚀 新增表格自定义筛选器功能，修复 ProForm、ProSearch 问题 ([7243e17](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7243e1786849ce84b714fafe7b47aea19b740450))
- 🚀 pro 组件新增两个 create 函数来实现函数式编程，修复 Use 组件问题。统一缓存 key 的前缀。新增一个针对 Emits 转换的全局 TS 类型 ([2145876](https://github.com/Kele-Bingtang/teek-design-vue3/commit/21458765b8fd81d8452c997d5ba9503a298aed97))
- 🚀 proTable 添加点击行激活行内编辑功能，修复 ProForm 不随全局 size 变化问题。修复 ProTable 行内编辑 model 额外添加了多级 prop 问题 ([c6f7131](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c6f7131ebbf1cdab7f8adad7621dbf070887235f))
- 🚀 proTable 添加前端过滤器规则，支持 lt、gt、ge、eq、like、between、in 等规则以及自定义规则函数 ([3778f2c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3778f2c8980af62302e3718c1403a2ea60b55fe0))
- 🚀 proTable 新增行内编辑功能。修复多个 prop 时，ProForm 存储问题 ([162040c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/162040c24bd57c98f5fc1b188f7f29a9c2d3b805))

### Bug Fixes

- 🐞 处理 ProTable 的 default 为函数问题 ([7a3d8f8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7a3d8f8000ca68110f78e73eded375728db06a9c))
- 🐞 修复 ProTable 传给 ProSearch 的 Props 缺失问题。修复表格过滤器和 ProSearch 查询参数关联失效问题 ([c237789](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c2377890e912c8078a6a04a0787fd3aedeee4a50))
- 🐞 修复打包后超级组件存在循环引用问题 ([66b61d8](https://github.com/Kele-Bingtang/teek-design-vue3/commit/66b61d81f85bbc538fa73a4117a22677cdeeb559))
- 🐞 修复自定义全局 TS 类型被 eslint 认为没有被定义报错 ([13ec24d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/13ec24d8d589e536a01e73f1fc66a16ac0b99df7))
- 🐞 修复自定义筛选器和 ProSearch 关联问题，ProForm 添加 props 配置项（适配自定义筛选器） ([ecfb0c3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ecfb0c383bb14347b3fded451e9d579781ceefa7))
- 🐞 provide 的 key 采用 InjectionKey 代替字符串 ([32ca848](https://github.com/Kele-Bingtang/teek-design-vue3/commit/32ca8489a921b9ddd0cf387e680d6b267fccd533))

## [1.2.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.1.0...v1.2.0) (2024-05-30)

### Features

- 🚀 新增 createTable 函数快速创建 ProTable。修复重复依赖引入。添加两个全局 TS 类型。ProForm 新增表单组件自定义插槽功能，ProForm 通过组件名引入组件改为组件本身引入，添加 ElUpload、ElRadio、ElCheckbox 组件支持。 ([a0df495](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a0df495015b31f3f10235316ee9ffe3025cf35bb))

## [1.1.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.0.1...v1.1.0) (2024-05-29)

### Features

- 🚀 新增 codeMirror focus 样式 ([f8bf581](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f8bf581f8a2cb604692a6471bed4f5e7413b9bed))
- 🚀 新增 EP 自定义命名空间功能，优化部分组件适配命名空间样式，图片预览、视频预览添加组件式打开方式 ([24aad15](https://github.com/Kele-Bingtang/teek-design-vue3/commit/24aad15be423d16bb45fa9a813bbf7d4b07f9280))
- 🚀 新增 EP 组件、样式按需引入功能以及配置化管理 ([a00545d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a00545dbba4bd828138bb3d28e50d9eb3773da5a))
- 🚀 新增菜单手风琴配置项 ([cb24a38](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cb24a386c78f13a9b30a15c47b5a3f16f972f883))
- 🚀 重构 ProForm 的代码，用 TSX 写法完成，SearchForm 改为 ProSearch，内置使用 ProForm 实现，ProTable 的内置搜索使用 ProSearch 实现 ([08681ff](https://github.com/Kele-Bingtang/teek-design-vue3/commit/08681ff22c54d374b551fda2cd31da0401f9437a))
- 🚀 proTable 添加行拖拽功能 ([35bec55](https://github.com/Kele-Bingtang/teek-design-vue3/commit/35bec55ed5773127c600424f9531368189e6c7f6))
- 🚀 proTable、ProForm、ProSearch 添加 hooks 函数动态操作配置项、props 参数等。编写 ProForm Demo ([5536d21](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5536d213f42f2d0f0dabc193ceac2c000b4a8650))
- 🚀 provide 和 inject 使用 InjectionKey、Symbol 处理类型 ([b4bbcfd](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b4bbcfd2222f7068cc7f114f618d4853400062a0))

### Bug Fixes

- 🐞 解决 JSX 元素隐式具有类型 "any"，因为不存在接口 "JSX.IntrinsicElements" 问题 ([9884484](https://github.com/Kele-Bingtang/teek-design-vue3/commit/988448431b25c1e3ce1c64752c9ce79e6e78df25))
- 🐞 新增其他组件的 Props、Emits、Expose 说明，修复 CodeMirror 问题。修复国际化切换英文刷新自动恢复中文问题 ([3b1c709](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3b1c709c2eea409b925e9318430af0517971e9a0))
- 🐞 修复 Pro 超级组件关联问题，修复 ProSearch 动态删除 schema 后 Grid 布局不自动补全问题 ([1e3ba29](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1e3ba293a664321f35b6dd52c6dd54b78bff04de))
- 🐞 修复 Pro 组件的 hook 函数兼容问题，添加 ProTable、ProSearch 的 hook 函数 Demo。对象类型修改为 Record ([64917e3](https://github.com/Kele-Bingtang/teek-design-vue3/commit/64917e34bdde443b2741f0e0a5ac3dbef4d6609d))
- 🐞 修复打包失败问题 ([13616b7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/13616b763215f71f3959f20600bf812560521346))
- 🐞 修复打包样式丢失问题 ([539929b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/539929bb4d09aad122ba2cb730c5f9cff8036e0e))

### Docs

- 📚 更新图片预览、视频预览参数说明文档 ([cdfcc3a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cdfcc3a756e9d9507cd613885a63d184eeffba8a))

### Code Refactoring

- ♻️ 对 ProTable 的表格按钮区、表格进行组件封装，减少 index.vue 的代码复杂度 ([ccc4d26](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ccc4d268a1dc1de7f1e3899ebd7bd47be15b2cbd))
- ♻️ 样式导入重构 ([aed7871](https://github.com/Kele-Bingtang/teek-design-vue3/commit/aed7871472c46b3986cf12a3c9f39ed6863e39a1))

### Styling

- 🎨 删除 ProForm、ProSearch 1.0 的组件，正式进入 2.0 组件 ([b5f0807](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b5f0807626217b2b88b1273f52fb14178a5179d6))

### [1.0.1](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v1.0.0...v1.0.1) (2024-05-23)

### Bug Fixes

- 🐞 修复打包失败问题 ([6f2bdee](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6f2bdee0b94e6e1c97d02ad47e10671019df380c))

## [1.0.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v0.3.0...v1.0.0) (2024-05-23)

### Features

- 🚀 去掉 vue-codemirro6 组件依赖，利用 codemirror6 原生 API 搭建 codemirror 组件 ([655e8c7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/655e8c74530ff203fa46a03d95afdbce1e0132e3))
- 🚀 添加 id 生成器工具类，优化自定义 ts 类型 ([62d027d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/62d027d4193ef57daa19aaa51ac673c377ca6db2))
- 🚀 新增 v-code-diff 组件，优化 codeMirror 对比器样式以及添加部分 props ([caaa6b5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/caaa6b52c694e51f062143ab734a7ec19910d6ad))
- 🚀 优化 CodeMirror，新增代码对比的 CodeMirror 组件 ([c0d1602](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c0d1602e98c5ec90eb3a84c8978513a312644410))

### Code Refactoring

- ♻️ 热门组件 Demo 添加 Props、Emits、Expose、Slot 配置项说明 ([de7c5c4](https://github.com/Kele-Bingtang/teek-design-vue3/commit/de7c5c4283af2a03e05fc21d42bf76b9155adaa7))
- ♻️ 组件、表格、Excel、权限、工具、自定义指令、标签页操作等 Demo 的元素、样式重构，更有层次感 ([e90e202](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e90e20292386158322d25c007b5a781a575c4073))

## [0.3.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v0.2.0...v0.3.0) (2024-05-20)

### Features

- 🚀 新增 CodeMirror 代码编辑器组件（Demo 版） ([8370c7d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8370c7d3e6e74d04e29a7b2c075c5848e25b2d77))
- 🚀 新增 CodeMirror 组件，提高多种代码语言和主题 ([e2d00f5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e2d00f5f840b6a03db9229d4a8a00549b365c43b))

### Bug Fixes

- 🐞 修复打包失败 ([404e61f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/404e61f109f9b674c2b41f708acb781261e0c1a5))

## [0.2.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v0.1.0...v0.2.0) (2024-05-19)

### Features

- 🚀 新增 vue 3.4 的 defineModel 语法，优化 defineEmits 类型 ([5162f5a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/5162f5ac6010430c3626388a099dcca375a98ebd))
- 🚀 新增 WorkDrawer 组件，优化 UseDialog、UseWDrawer 函数 ([af572ac](https://github.com/Kele-Bingtang/teek-design-vue3/commit/af572ac04f6084a247dd7cc20ba626da68e63006))

### Styling

- 🎨 样式位置切换 ([64d10d1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/64d10d173c170bdfccc7383a2221d3e7f74b64ae))

### TypeScript File

- 💎 types 类型文件重构 ([2511929](https://github.com/Kele-Bingtang/teek-design-vue3/commit/2511929cbcd62a406c4232e19bc1a518fd68c8f4))

### Code Refactoring

- ♻️ 六个 Layout 布局样式重构，解决遗留样式问题，添加部分新交互样式 ([ab04528](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ab04528f1ffa71d4ec2cb45acf58445bc1c40653))
- ♻️ 重构 ThemeDrawer 全局配置组件。重构菜单、头部主题切换样式、交互。重构暗黑模式展示样式，重构面包屑样式。修复标签页第一个固定标签的右键内容显示问题 ([8152a56](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8152a56ba78efd25c52de52b131f798bad1ea927))
- ♻️ layout 样式文件重命名 ([28022ae](https://github.com/Kele-Bingtang/teek-design-vue3/commit/28022ae119e3ba6847e4fe82308ad3f402828e41))

## [0.1.0](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v0.0.2...v0.1.0) (2024-05-18)

### Features

- 支持 pnpm、新增 Icon 组件、ElementPlus Icon 去掉全局注入 ([9241b1c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9241b1c544d7818f9cac6ad2bdfbcb2038295ea2))
- 🚀 布局适配移动端，Tinymce 添加多图片上传功能 ([3e8f346](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3e8f346a25c4fd4274594931b76f0a044c8956f4))
- 🚀 分页优化 ([38632b7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/38632b721c1289a4a00b8a7f53aa57a667e88d99))
- 🚀 公共组件使用命名空间，重构所有 scss 样式规范，优化部分组件问题，按需引入 EP 组件 ([4c225e1](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4c225e19098b61917a21602fdd1f4a743849ec25))
- 🚀 升级 ProTable、ProForm 等相关组件 ([379eceb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/379eceb2c5f007f03bdc0d4aa54ce1997a0d6265))
- 🚀 添加 .versionrc 文件，支持多种 commit type 显示在 changeLog 文档，添加中文版 commit 提交提示，修复部分内容 ([e1a4ac7](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e1a4ac7579fd6f8621fdfd31b741e23a10e527d1))
- 🚀 添加 iframe 缓存 ([3eaf43b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3eaf43b851c8994c474e2a94544468bec3fc4e80))
- 🚀 添加 request 枚举类相关使用，添加部分状态码的处理 ([af35c83](https://github.com/Kele-Bingtang/teek-design-vue3/commit/af35c83b744b4536f804187ccb06859e3a031131))
- 🚀 添加 standard-version 生命周期，可配置跳过 bump 版本号、commit、tag、changelog 执行 ([777682c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/777682c213a22ec9844a9e9c7771dd79813616e3))
- 🚀 添加超级表单功能，升级依赖版本，修复布局样式 ([516c929](https://github.com/Kele-Bingtang/teek-design-vue3/commit/516c9294302678e64c63cecb0844b55eabaa4c6a))
- 🚀 添加多个环境变量。使用 vite-plugin-style-import 解决 EP 样式按需加载。解决 unplugin-auto-import/vite 问题。重构 Pinia 缓存格式。添加 useStorage、useCache，添加固定标签页配置项。自定义路由类型重构 ([fb2db2f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/fb2db2f74dbb3ca7d3e4526b293d2ad21b5ba1f6))
- 🚀 新增 Axios 避免重复请求功能，添加通过 name 查找路由功能 ([d7c69f2](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d7c69f26e47e595087d532b189c1dc31d3081aff))
- 🚀 新增 Dialog、Drawer 的函数式调用功能。Icon 组件支持自定义颜色和悬停色，添加图片预览功能 ([a4a4109](https://github.com/Kele-Bingtang/teek-design-vue3/commit/a4a41093c81e23b134e18803e4b94f9fa9a29efb))
- 🚀 新增 iframe 新窗口打开功能、支持 iframe 通信自动跳转路由，新增 ProTable 组件 ([09a8c68](https://github.com/Kele-Bingtang/teek-design-vue3/commit/09a8c68163f9cf993d4df5a75514615ba80aefd7))
- 🚀 新增 useDesign 命名空间配置 ([968af1e](https://github.com/Kele-Bingtang/teek-design-vue3/commit/968af1e21b8adb00b7d672cacdf325297f394aea))
- 🚀 新增 VITE_ROUTER_MODE 环境变量，支持 hash 和 h5 历史模式，修复 request 的 mappingUrl ([0570a6c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0570a6c6dbe91804a3e0d0dcc5448b46f5374740))
- 🚀 修复 Mixins 布局二级菜单，添加两个右键菜单组件 ([4d905f6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/4d905f6c2b23ab80f03bd9a0093e7e8ff53bc03e))
- 🚀 修复 ProTable 反复请求问题 ([8d09958](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8d099587b2013521afa75be8948cc3fbe10165b0))
- 🚀 修复 ProTable 默认值覆盖输入值 ([3258b65](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3258b65ec1ed1c1e6628dbdef4ae413ca429015a))
- 🚀 优化 proTable ([ed9885c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/ed9885c61493e338d6c5bb5f46bc547b7466f575))
- 🚀 优化 ProTable，修复异常被捕获不显示控制台问题，更新主页时间线，添加使用文档链接 ([b78aadb](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b78aadb02714baa8ec15e14884e55f96c10936d8))
- 🚀 优化超级表单 ([7bdb6cf](https://github.com/Kele-Bingtang/teek-design-vue3/commit/7bdb6cf80eec9b20818158d3b5b65471cdb827bd))
- 🚀 优化超级表格详情，修复 iframe 样式 ([d17b450](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d17b450ee6b8073f2534ec5fdef61261312c7676))
- 🚀 优化图标组件，新增图标选择器组件，优化 Vue Import，解决新版表格拽问题 ([c1e41af](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c1e41afd05ef8e9f95453d2838768c354b44f6be))
- 🚀 支持 pnpm 包管理器 ([1c25d3d](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1c25d3d69ec2839810e808459719b63f5f113d16))
- 🚀 支持 URL 传参来渲染全屏页面 ([e595f5a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/e595f5ac5b361ac8456ce31a0d7fe5351f8086dc))
- 🚀 重构工程化 import export，添加视频播放器、高亮组件、优化 useDialog、useDrawer 组件 ([29f55a9](https://github.com/Kele-Bingtang/teek-design-vue3/commit/29f55a984f516014c93ed3d38e4a70a62fc1cc42))
- 🚀 自定义顶部高度、菜单宽度。修复样式。所有依赖升级最新版 ([6a254db](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6a254db20b4deadd8296a2938c61f0fd5cb1b2c5))
- 🚀 proTable scope 支持 enum ([6a6311c](https://github.com/Kele-Bingtang/teek-design-vue3/commit/6a6311c9d4b833b82583dacd95cfdff4dd71e1c0))
- 🚀 Tootip 支持多行溢出，request 解决无法登录问题 ([16a793f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/16a793f399e71824e12b5f537584fb696bdebd5f))
- 🚀 views 组件支持非根节点，request 内容修改 ([08ab77b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/08ab77b1c2df4d12b3749b948ad100f7dfdc2429))

### Bug Fixes

- 🐞 去掉无用字符串 ([b441bd5](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b441bd5cc1b376e249d01844625112ae8962792e))
- 🐞 修复 ProTable ([346b1ec](https://github.com/Kele-Bingtang/teek-design-vue3/commit/346b1ec39160d1eeeba69392193929ab3304eb87))
- 🐞 修复 refresh 找不到警告 ([9a08594](https://github.com/Kele-Bingtang/teek-design-vue3/commit/9a08594e12e4d143b876c32b55214da2ee6ae63b))
- 🐞 修复 Tinymce 富文本无法渲染，修复 iframe 标签无法刷新问题 ([044fb62](https://github.com/Kele-Bingtang/teek-design-vue3/commit/044fb627b495403a83b87b9f62e218f23f6d1452))
- 🐞 修复 UseDialog Demo 报错问题 ([cc4ef25](https://github.com/Kele-Bingtang/teek-design-vue3/commit/cc4ef25f60e53f311e209506ff32dadb68b5e74a))
- 🐞 修复 VContextMenu 路由无法找到对应组件 ([839b122](https://github.com/Kele-Bingtang/teek-design-vue3/commit/839b122119c4fecd3d31787053269966f320dac5))
- 🐞 修复 WangEditor 重复注册自定义插件问题，组件 .value 换位 unref，优化 ProTable 分页功能 ([540119f](https://github.com/Kele-Bingtang/teek-design-vue3/commit/540119fd7b6392337732d37ad5c3e8a6afbb6669))
- 🐞 修复标签页无法缓存、Mixins 布局三级路由以上无法渲染 ([1ae8050](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1ae8050f7eb37c0b95bc9fcc96944d295644c335))
- 🐞 修复超级表单 Demo 无法渲染 el-input 组件问题 ([27cbf81](https://github.com/Kele-Bingtang/teek-design-vue3/commit/27cbf810f634e10389dec97c4fd7eb00bb7237e3))
- 🐞 修复图片路径引入错误问题 ([d9db9cf](https://github.com/Kele-Bingtang/teek-design-vue3/commit/d9db9cfc6b3e7d6fb493ac77d0cbe63ad1926fc8))
- 🐞 修复无法打包问题 ([56bf52a](https://github.com/Kele-Bingtang/teek-design-vue3/commit/56bf52a73d034f5f2c5ca19d7fd26391b7684fe1))
- 🐞 修复无法启动问题 ([3cff924](https://github.com/Kele-Bingtang/teek-design-vue3/commit/3cff924d7bac0bbf29e1b7bce926527dc6ecf036))
- 🐞 修复一些样式 ([1170f87](https://github.com/Kele-Bingtang/teek-design-vue3/commit/1170f871e25ac7e9d85963dd25fe8b4b971a7d3d))
- 🐞 wang 富文本修复全屏下被菜单栏遮住 ([62ce0be](https://github.com/Kele-Bingtang/teek-design-vue3/commit/62ce0beab111e0e6e768773e25a629e0d3efb40d))

### Others

- **release:** 0.0.2 ([f043d2b](https://github.com/Kele-Bingtang/teek-design-vue3/commit/f043d2bfcfe5b88e3b50ad989b5431e1b5d79ccd))

### Docs

- 📚 添加 Template 文档说明 ([0cec623](https://github.com/Kele-Bingtang/teek-design-vue3/commit/0cec62393a67508f5fd41f2e7aa607b3a35e4db1))

### Code Refactoring

- ♻️ 重构样式 ([bfd28f6](https://github.com/Kele-Bingtang/teek-design-vue3/commit/bfd28f6f853b31258b99b11ffe4310905af0cd76))
- ♻️ request 的 ElMessage 换成 admin 封装的 message ([b75c409](https://github.com/Kele-Bingtang/teek-design-vue3/commit/b75c4091546fec4baee5b5e68fb6839608e42ae5))

### [0.0.2](https://github.com/Kele-Bingtang/teek-design-vue3/compare/v0.1.0...v0.0.2) (2023-03-26)

## 0.0.1 (2023-03-26)

### ⚠ BREAKING CHANGES

- 新增 commit 规范

### Features

- 🚀 添加 git-cz、commitizen、commitlint，在提交 commit 时智能提示。添加 standard-version 管理版本和生成 CHANGELOG.md 文档 ([c55bf08](https://github.com/Kele-Bingtang/teek-design-vue3/commit/c55bf08b4b60951c7c84e29562e3324ddfdbbe40))
- 🚀 添加 commitlint、husky 相关配置，对 commit 进行规范化，添加 stylelint，对整个项目样式进行规范管理 ([8a4a694](https://github.com/Kele-Bingtang/teek-design-vue3/commit/8a4a69402c75d557dedecb53c642fe1e9425f55a))
