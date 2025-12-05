import type { TreeKey } from "element-plus";
import TreeFilter from "./index.vue";

export interface TreeFilterProps {
  /**
   * 树形数据，如果传入该配置项且有数据，则不会执行 api 请求
   */
  data?: Recordable[];
  /**
   * 请求数据的 api
   */
  requestApi?: (data?: Recordable) => Promise<any>;
  /**
   * 默认请求参数
   */
  defaultRequestParams?: Recordable;
  /**
   * 是否立即执行请求
   *
   * @default true
   */
  requestImmediate?: boolean;
  /**
   * 对请求成功的数据进行处理
   */
  transformData?: (data: Recordable[], result?: any) => any;
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
  defaultValue?: TreeKey | TreeKey[];
  /**
   * 是否默认选中第一个选项
   *
   * @default false
   */
  defaultFirst?: boolean;
  /**
   * 是否显示全部选项
   *
   * @default false
   */
  showTotal?: boolean;
  /**
   * 是否显示更多按钮
   *
   * @default false
   */
  showMore?: boolean;
  /**
   * 是否显示数量，仅显示一级节点数量
   *
   * @default false
   */
  showNum?: boolean;
  /**
   * 是否使用卡片样式
   *
   * @default true
   */
  card?: boolean;
}

export type FilterEmits = {
  change: [value: string | TreeKey[], data?: Recordable];
};

export type TreeFilterInstance = InstanceType<typeof TreeFilter>;
