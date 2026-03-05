import type { MaybeRef, MaybeRefOrGetter } from "vue";
import type { TableInstance } from "element-plus";
import type { ProTableInstance, ProTableNamespace, TableColumn } from "@/components/pro/table";
import type { SearchColumn, ProSearchEmits, ProSearchInstance, ProSearchProps } from "@/components/pro/search";
import type { BreakPoint, Responsive } from "@/components/pro/grid";
import type { ProFormDialogProps } from "@/components/pro/form-dialog";
import type { ProFormDrawerProps } from "@/components/pro/form-drawer";
import type { FormColumn, ProFormNamespace } from "@/components/pro/form";
import type ProPage from "./index.vue";

export interface PageColumn<T extends Recordable = any> extends TableColumn<T> {
  search?: {
    /**
     * 搜索事件前置处理，可以返回新的搜索值
     */
    beforeSearch?: (value: any, searchParams: Recordable, column: TableColumn) => unknown | false | undefined;
    /**
     * 搜索项所占用的列数，默认为 1 列
     */
    span?: number;
    /**
     * 搜索字段左侧偏移列数
     */
    offset?: number;
  } & Partial<SearchColumn> &
    Partial<Record<BreakPoint, Responsive>>;
}

export interface ProPageProps extends ProTableNamespace.Props {
  /**
   * 页面列配置
   */
  columns?: PageColumn[];
  /**
   * 搜索项配置
   */
  searchProps?: Omit<ProSearchProps, "columns">;
  /**
   * 初始化时是否显示搜索模块
   */
  initShowSearch?: MaybeRefOrGetter<boolean>;
  /**
   * 默认搜索参数，优先级低于 column.defaultValue
   */
  defaultValues?: Recordable;
  /**
   * feedbackForm Props
   */
  feedbackFormProps?: FeedbackFormProps;
  /**
   * 自定义导出为文件
   *
   * @param data 表格数据
   */
  exportFile?: (data: Recordable[], searchParam: Recordable) => void;
}

export interface ProPageEmits extends Omit<ProTableNamespace.Emits, "register">, Omit<ProSearchEmits, "register"> {
  /**
   * ProSearch 的注册事件
   */
  searchRegister: [proFormInstance: ProSearchInstance | null];
  /**
   * ProTable 的注册事件
   */
  tableRegister: [proTableInstance: ProTableInstance | null, elTableInstance: TableInstance | null];
}

/**
 * ProTable 组件实例
 */
export type ProPageInstance = InstanceType<typeof ProPage>;

/**
 * FeedbackForm 组件的类型
 */
export interface FeedbackFormColumn<T = any> extends FormColumn<T> {
  /**
   * 是否销毁表单，类似于 v-if
   */
  destroyIn?: Array<"add" | "edit">;
  /**
   * 是否隐藏表单，类似于 v-show
   */
  hiddenIn?: Array<"add" | "edit">;
  /**
   * 是否禁用表单
   */
  disabledIn?: Array<"add" | "edit">;
}

export type FeedbackStatus = "" | "edit" | "add" | "read";

export type FeedbackForm = FeedbackFormProps;

export interface FeedbackFormProps {
  /**
   * feedbackForm 类型，dialog 或 drawer
   *
   * @default "dialog"
   */
  type?: MaybeRef<"dialog" | "drawer">;
  /**
   * ProForm Props
   */
  form?: Omit<ProFormNamespace.Props, "columns"> & {
    columns?: MaybeRef<FeedbackFormColumn[]>;
  };
  /**
   * dialog 或 drawer 类型弹窗的属性
   */
  feedbackProps?: {
    /**
     * 弹窗标题，为字符串或函数
     */
    title: string | ((model: Record<string, any>, status: FeedbackStatus) => string);
    /**
     * 弹窗高度，为字符串、数字或函数
     */
    height?: string | number | ((model: Record<string, any>, status: FeedbackStatus) => string | number);
    [key: string]: any;
  } & (Omit<ProFormDialogProps["dialog"], "title" | "height"> | Omit<ProFormDrawerProps["drawer"], "title" | "height">);
  /**
   * 数据主键。编辑时必传
   *
   * @default "id"
   */
  id?: string | string[];
  /**
   * 是否缓存新增、编辑后遗留的数据
   *
   * @default false
   */
  cache?: boolean;
  /**
   * 新增保存时触发的回调
   */
  addApi?: (params: any) => Promise<any>;
  /**
   * 新增时额外添加参数
   */
  addCarryParams?: Record<string, any>;
  /**
   * 新增时需要过滤掉的参数名
   */
  addFilterKeys?: string[];
  /**
   * 编辑保存时触发的回调
   */
  editApi?: (params: any) => Promise<any>;
  /**
   * 编辑时额外添加参数
   */
  editCarryParams?: Record<string, any>;
  /**
   * 编辑时需要过滤掉的参数名
   */
  editFilterKeys?: string[];
  /**
   * 删除保存时触发的回调
   */
  removeApi?: (params: any) => Promise<any>;
  /**
   * 删除时额外添加的参数
   */
  removeCarryParams?: Record<string, any>;
  /**
   * 删除时需要过滤掉的参数名
   */
  removeFilterKeys?: string[];
  /**
   * 批量删除保存时触发的回调
   */
  removeBatchApi?: (params: any) => Promise<any>;
  /**
   * 批量删除时额外添加的参数
   */
  removeBatchCarryParams?: Record<string, any>;
  /**
   * 所有接口保存时统一需要过滤掉的参数名
   */
  apiFilterKeys?: string[];
  /**
   * 所有接口保存时统一额外添加的参数
   */
  apiCarryParams?: Record<string, any>;
  /**
   * 点击新增按钮时触发的回调
   */
  clickAdd?: (model: Record<string, any>) => undefined | Promise<any> | any;
  /**
   * 新增时点击保存按钮时触发的回调，在 addApi 触发前
   */
  beforeAdd?: (model: Record<string, any>) => undefined | Promise<any> | any;
  /**
   * 新增时点击保存按钮时触发的回调，在 addApi 触发后
   */
  afterAdd?: (model: Record<string, any>, result: any) => void;
  /**
   * 点击编辑按钮时触发的回调
   */
  clickEdit?: (model: Record<string, any>) => undefined | Promise<any> | any;
  /**
   * 编辑时点击保存按钮时触发的回调，在 editApi 触发前
   */
  beforeEdit?: (model: Record<string, any>) => undefined | Promise<any> | any;
  /**
   * 编辑时点击保存按钮时触发的回调，在 editApi 触发后
   */
  afterEdit?: (model: Record<string, any>, result: any) => void;
  /**
   * 删除时点击保存按钮时触发的回调，在 removeApi 触发前
   */
  beforeRemove?: (model: Record<string, any>) => undefined | Promise<any> | any;
  /**
   * 删除时点击保存按钮时触发的回调，在 removeApi 触发后
   */
  afterRemove?: (model: Record<string, any>, result: any) => void;
  /**
   * 批量删除时点击保存按钮时触发的回调，在 removeBatchApi 触发前
   */
  beforeRemoveBatch?: (model: Record<string, any>) => undefined | Promise<any> | any;
  /**
   * 批量删除时点击保存按钮时触发的回调，在 removeBatchApi 触发后
   */
  afterRemoveBatch?: (model: Record<string, any>, result: any) => void;
  /**
   * 点击保存按钮时触发的回调，在 addApi、editApi、removeApi、removeBatchApi 触发前
   */
  beforeConfirm?: (status: string) => void;
  /**
   * 点击保存按钮时触发的回调，在 addApi、editApi、removeApi、removeBatchApi 触发后
   */
  afterConfirm?: (status: string, result: any) => void;
  /**
   * 禁用新增按钮
   *
   * @default false
   */
  disableAdd?: boolean;
  /**
   * 禁用编辑按钮
   *
   * @default false
   */
  disableEdit?: boolean;
  /**
   * 禁用删除按钮
   *
   * @default false
   */
  disableRemove?: boolean;
  /**
   * 禁用批量删除按钮
   *
   * @default false
   */
  disableRemoveBatch?: boolean;
  /**
   * 是否使用新增功能，如果 addApi 存在则默认为 true，否则默认为 false
   */
  useAdd?: boolean;
  /**
   * 是否使用编辑功能，如果 editApi 存在则默认为 true，否则默认为 false
   */
  useEdit?: boolean;
  /**
   * 是否使用删除功能，如果 removeApi 存在则默认为 true，否则默认为 false
   */
  useRemove?: boolean;
  /**
   * 是否使用批量删除功能，如果 removeBatchApi 存在则默认为 true，否则默认为 false
   */
  useRemoveBatch?: boolean;
}
