import type { MaybeRefOrGetter } from "vue";
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
  exportFile?: (data: Record<string, any>[], searchParam: Record<string, any>) => void;
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

// FeedbackForm 组件的类型

export interface FeedbackFormColumn<T = any> extends FormColumn<T> {
  destroyIn?: Array<"add" | "edit">; // 是否销毁表单，类似于 v-if
  hiddenIn?: Array<"add" | "edit">; // 是否隐藏表单，类似于 v-show
  disabledIn?: Array<"add" | "edit">; // 是否禁用表单
}

export type FeedbackStatus = "" | "edit" | "add" | "read";

export type FeedbackForm = FeedbackFormProps;

export interface FeedbackFormProps {
  type?: MaybeRef<"dialog" | "drawer">;
  form?: Omit<ProFormNamespace.Props, "columns"> & {
    columns?: MaybeRef<FeedbackFormColumn[]>;
  };
  /**
   * dialog 或 drawer 类型弹窗的属性
   */
  typeProps?: {
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
  id?: string | string[]; // 数据主键。编辑时必传，默认 id
  cache?: boolean; // 是否缓存新增、编辑后遗留的数据
  addApi?: (params: any) => Promise<any>; // 新增接口
  addCarryParams?: Record<string, any>; // 新增时，额外添加的函数
  addFilterKeys?: string[]; // 新增时，过滤的参数
  editApi?: (params: any) => Promise<any>; // 编辑接口
  editCarryParams?: Record<string, any>; // 编辑时，额外添加的参数
  editFilterKeys?: string[]; // 编辑时，过滤的参数
  removeApi?: (params: any) => Promise<any>; // 删除接口
  removeCarryParams?: Record<string, any>; // 删除时，额外添加的参数
  removeFilterKeys?: string[]; // 删除时，过滤的参数
  removeBatchCarryParams?: Record<string, any>; // 批量删除时，额外添加的参数
  removeBatchApi?: (params: any) => Promise<any>; // 批量删除接口
  apiFilterKeys?: string[]; // 新增、编辑、删除时，过滤的参数
  apiCarryParams?: Record<string, any>; // 新增、编辑、删除时，额外添加的参数
  clickAdd?: (model: Record<string, any>) => undefined | Promise<any> | any; // 点击新增按钮回调
  clickEdit?: (model: Record<string, any>) => undefined | Promise<any> | any; // 点击编辑按钮回调
  beforeAdd?: (model: Record<string, any>) => undefined | Promise<any> | any; // 新增前回调
  afterAdd?: (model: Record<string, any>, result: any) => void; // 新增后回调
  beforeEdit?: (model: Record<string, any>) => undefined | Promise<any> | any; // 编辑前回调
  afterEdit?: (model: Record<string, any>, result: any) => void; // 编辑后回调
  beforeRemove?: (model: Record<string, any>) => undefined | Promise<any> | any; // 删除前回调
  afterRemove?: (model: Record<string, any>, result: any) => void; // 删除后回调
  beforeRemoveBatch?: (model: Record<string, any>) => undefined | Promise<any> | any; // 批量删除前回调
  afterRemoveBatch?: (model: Record<string, any>, result: any) => void; // 批量删除后回调
  beforeConfirm?: (status: string) => void; // 确定按钮触发前回调
  afterConfirm?: (status: string, result: any) => void; // 确定按钮触发后回调
  disableAdd?: boolean; // 禁用新增按钮
  disableEdit?: boolean; // 禁用编辑按钮
  disableRemove?: boolean; // 禁用删除按钮
  disableRemoveBatch?: boolean; // 禁用批量删除按钮
  useAdd?: boolean; // 使用新增按钮
  useEdit?: boolean; // 使用编辑按钮
  useRemove?: boolean; // 使用删除按钮
  useRemoveBatch?: boolean; // 使用批量删除按钮
}
