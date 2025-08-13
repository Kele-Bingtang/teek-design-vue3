# TODO

## 特性

- 添加 IFrame Demo（门户通信）
- Element Plus 非 `primary` 功能色支持 `1 - 9` 色板生成
- 刷新按钮支持顶栏左侧 | 右侧位置切换配置
- 顶栏搜索框支持配置项选择渲染图标 | 文本框

## 优化

- ProTable 对列增加默认宽度，如果没有配置宽度，根据列名字数设置一个默认值，确保列名全部显示出来（可通过列 Label 的字符数 \* 18）
- ProTable 如果没有数据，`empty` 高度是 100%
- ProTable 分页组件固定在页面下方（配置项？）
- ProPage 添加顶部插槽
- ProForm 增加空白占位
- ProForm 的 `el-text` 支持 options
- ProForm 默认禁用表单项的标签点击事件，支持配置项打开
- ProTable 过滤功能新增 `checkbox-select` 组件使用
- ProTable 当使用 `options` 时，单元格为空不显示 `-` 而是空白，可以参考超级表格文档示例的 `options` 配置
- 常用链接弹框左下角添加灰色提示语：感叹号图标 拖拽可调整常用链接展示顺序

## Bug
