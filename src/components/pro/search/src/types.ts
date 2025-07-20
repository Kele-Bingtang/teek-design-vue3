import type { FormItemProp } from "element-plus";
import type { GridItemProps, GridProps } from "@/components/pro/grid";
import type { FormColumn, ProFormNamespace } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type ProSearch from "./index.vue";

/**
 * 按钮位置
 */
export type ActionPosition = "left" | "right" | "block-left" | "block-center" | "block-right";

export type ProSearchColumnProps = FormColumn & {
  /**
   * GridItem props
   */
  grid?: Partial<GridItemProps>;
};

export interface ProSearchProps {
  /**
   * 搜索配置列
   */
  columns?: ProSearchColumnProps[];
  /**
   * Action 位置，block 代表换行
   *
   * @default right
   */
  position?: ActionPosition;
  /**
   * 是否展示操作按钮
   *
   * @default true
   */
  showAction?: boolean;
  /**
   * 是否展示搜索按钮
   *
   * @default true
   */
  showSearch?: boolean;
  /**
   * 是否展示重置按钮
   *
   * @default true
   */
  showReset?: boolean;
  /**
   * 是否展示折叠功能
   *
   * @default true
   */
  showCollapse?: boolean;
  /**
   * 搜索按钮的文字
   *
   * @default '搜索'
   */
  searchText?: string;
  /**
   * 重置按钮的文字
   *
   * @default '重置'
   */
  resetText?: string;
  /**
   * 展开按钮的文字
   *
   * @default '展开'
   */
  collapseText?: string;
  /**
   * 折叠按钮的文字
   *
   * @default '折叠'
   */
  expandText?: string;
  /**
   * 搜索按钮的 loading
   *
   * @default false
   */
  searchLoading?: boolean;
  /**
   * 重置按钮的 loading
   *
   * @default false
   */
  resetLoading?: boolean;
  /**
   * 响应式布局
   *
   * @default '{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }'
   */
  searchCols?: GridProps["cols"];
  /**
   * 行和列间距
   *
   * @default '[20, 0]''
   */
  gap?: GridProps["gap"];
  /**
   * 是否默认折叠搜索项
   *
   * @default true
   */
  collapse?: GridProps["collapse"];
  /**
   * 超出指定行数后折叠
   *
   * @default 1
   */
  showRow?: GridProps["showRow"];
  /**
   * 是否自动去除表单数据的空值项
   *
   * @default true
   */
  removeNoValue?: boolean;
  /**
   * 是否校验表单组件
   *
   * @default true
   */
  validate?: boolean;
  /**
   * 是否显示 label，优先级低于 FormItemColumnProps["showLabel"]
   *
   * @default true
   */
  showLabel?: ProFormNamespace.Props["showLabel"];
  /**
   * ProForm 组件 Props
   */
  form?: ProFormNamespace.Props;
}

export type ProSearchEmits = {
  /**
   * 搜索事件
   */
  search: [model: Recordable];
  /**
   * 重置事件
   */
  reset: [model: Recordable];
  /**
   * 注册事件
   */
  register: [proSearchInstance: any];
  /**
   * ElForm 验证触发事件
   */
  validate: [prop: FormItemProp, isValid: boolean, message: string];
  /**
   * 表单值改变事件
   */
  change: [value: unknown, model: Recordable, column: FormItemColumnProps];
};

/**
 * 将 ProSearchEmits 类型的 key 变为 on{Key} 的形式
 *
 * @example 返回 { onSearch: (params: Recordable) => void }
 */
export type ProSearchOnEmits = keyOnPrefix<ProSearchEmits>;

/**
 * ProSearch 组件实例
 */
export type ProSearchInstance = InstanceType<typeof ProSearch>;
