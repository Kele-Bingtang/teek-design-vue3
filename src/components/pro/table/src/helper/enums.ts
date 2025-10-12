// 表格列类型
export enum TableColumnTypeEnum {
  Index = "index",
  Selection = "selection",
  Radio = "radio",
  Expand = "expand",
  Sort = "sort",
}

// 表格大小样式
export enum TableSizeEnum {
  Large = "large",
  Default = "default",
  Small = "small",
  Mini = "mini",
}

// 表格工具栏按钮
export enum ToolButtonEnum {
  Refresh = "refresh",
  Size = "size",
  Export = "export",
  ColumnSetting = "columnSetting",
  BaseSetting = "baseSetting",
  Search = "search",
}

// 导出时列配置项
export enum ExportKey {
  DataKey = "dataKey",
  Label = "label",
  Prop = "prop",
}

// 环境
export enum Environment {
  Client = "client",
  Server = "server",
}

// 操作列组件类型
export enum OperationEl {
  ElLink = "ElLink",
  ElIcon = "ElIcon",
  ElButton = "ElButton",
}

// 二次确认组件类型
export enum OperationConfirmEl {
  ElPopconfirm = "ElPopconfirm",
  ElMessageBox = "ElMessageBox",
}
