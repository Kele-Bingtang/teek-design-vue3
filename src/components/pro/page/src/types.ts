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

export interface FeedbackFormProps<T extends Recordable = any> {
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
    title: string | ((model: T, status: FeedbackStatus) => string);
    /**
     * 弹窗高度，为字符串、数字或函数
     */
    height?: string | number | ((model: T, status: FeedbackStatus) => string | number);
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
   * 新增 API 请求
   */
  addApi?: (params: T) => Promise<any>;
  /**
   * 调用 addApi 时额外传入的参数
   */
  addCarryParams?: Recordable;
  /**
   * 调用 addApi 时过滤掉的参数
   */
  addFilterKeys?: string[];
  /**
   * 编辑 API 请求
   */
  editApi?: (params: T) => Promise<any>;
  /**
   * 调用 editApi 时额外传入的参数
   */
  editCarryParams?: Recordable;
  /**
   * 调用 editApi 时过滤掉的参数
   */
  editFilterKeys?: string[];
  /**
   * 删除 API 请求
   */
  removeApi?: (params: T) => Promise<any>;
  /**
   * 调用 removeApi 时额外传入的参数
   */
  removeCarryParams?: Recordable;
  /**
   * 调用 removeApi 时过滤掉的参数
   */
  removeFilterKeys?: string[];
  /**
   * 批量删除 API 请求
   */
  removeBatchApi?: (params: T) => Promise<any>;
  /**
   * 调用 removeBatchApi 时额外传入的参数
   */
  removeBatchCarryParams?: Recordable;
  /**
   * 调用所有 API 接口时额外传入的参数
   */
  apiFilterKeys?: string[];
  /**
   * 调用所有 API 接口时过滤掉的参数
   */
  apiCarryParams?: Recordable;
  /**
   * 请求失败回调
   */
  requestFailed?: (error: any, model: T) => void;
  /**
   * 点击新增按钮回调，可以返回一个对象覆盖表单数据，也可以传入 false 取消打开新增弹窗
   */
  clickAdd?: (model: T) => any | Promise<any> | false | undefined;
  /**
   * 点击编辑按钮回调，可以返回一个对象覆盖表单数据，也可以传入 false 取消打开编辑弹窗
   */
  clickEdit?: (model: T) => any | Promise<any> | false | undefined;
  /**
   * 点击删除按钮回调
   */
  clickRemove?: (model: T) => void;
  /**
   * 点击批量删除按回调，可以返回一个对象覆盖表单数据，也可以传入 false 取消打开批量删除弹窗
   */
  clickRemoveBatch?: (data: T) => any | Promise<any> | false | undefined;
  /**
   * 新增点击保存按钮回调，将自定义新增逻辑，覆盖 addApi 逻辑，当两者同时存在时，onAdd 优先级高
   */
  onAdd?: (model: T) => void;
  /**
   * 编辑点击保存按钮回调，将自定义新增逻辑，覆盖 editApi 逻辑，当两者同时存在时，onEdit 优先级高
   */
  onEdit?: (model: T) => void;
  /**
   * 删除点击保存按钮回调，将自定义新增逻辑，覆盖removeApi 逻辑，当两者同时存在时，onRemove 优先级高）
   */
  onRemove?: (model: T) => void;
  /**
   * 批量删除点击保存按钮回调，将自定义新增逻辑，覆盖 removeBatchApi 逻辑，当两者同时存在时，onRemoveBatch 优先级高）
   */
  onRemoveBatch?: (model: T) => void;
  /**
   * 操作完成后的回调
   */
  afterConfirm?: (status: string, result: boolean) => void;
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
