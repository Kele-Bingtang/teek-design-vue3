import TreeFilter from "./index.vue";

export interface TreeFilterProps {
  /**
   * 请求分类数据的 api
   */
  requestApi?: (data?: any) => Promise<any>;
  /**
   * 分类数据，如果有分类数据，则不会执行 api 请求
   */
  data?: Record<string, any>[];
  /**
   * treeFilter 标题
   */
  title?: string;
  /**
   * 选择的 id
   *
   * @default 'id'
   */
  id?: string;
  /**
   * 显示的 label
   *
   * @default 'label'
   */
  label?: string;
  /**
   * 是否为多选
   *
   * @default false
   */
  multiple?: boolean;
  /**
   * 默认选中的值
   */
  defaultValue?: unknown;
  /**
   * 是否显示 全部 选项
   */
  enableTotal?: boolean;
  /**
   * 是否默认选中第一个选项
   */
  defaultFirst?: boolean;
}

export type FilterEmits = {
  change: [value: unknown, data?: Recordable];
};

export type TreeFilterInstance = InstanceType<typeof TreeFilter>;
