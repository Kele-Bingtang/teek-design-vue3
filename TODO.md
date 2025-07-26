# TODO

## 特性

- 新增纯黑的暗黑模式风格变量

## 优化

- 菜单支持切换深色/浅色主题
- ProTable 添加 PointTag 组件
- ModelBaseValueType 替换 unknown
- unknown 改为 any
- 路由结构优化：核心路由、静态路由、角色路由、动态路由
- 加强 toValue 和 MaybeRefOrGetter，所有对应的配置项支持 Promise 类型
- composables 返回的变量添加 readonly（尤其 Pro 组件）
- axios 重构 `type: multi`，支持更多数组转换，如 `ids[]=1&ids[]=2&ids[]=3`，并支持数据返回方式配置（raw、body、data）

- ProTable 传入 API 后，自动显示 `refresh` 按钮

## Bug
