import type { AppContext, Component, MaybeRef, MaybeRefOrGetter } from "vue";
import type {
  ButtonProps,
  ElMessageBoxOptions,
  ElTooltipProps,
  IconProps,
  LinkProps,
  PopconfirmProps,
} from "element-plus";
import type { TableColumn, TableRow, TableScope } from "./table-column";
import type { OperationConfirmEl, OperationEl } from "../helper";

/**
 * 操作按钮属性的类型
 */
export type ButtonRowProps = Partial<ButtonProps & LinkProps & IconProps & Recordable>;

/**
 * el 字面量，转为 HyphenCase 格式
 */
export type OperationElName = keyof typeof OperationEl extends infer K
  ? K extends string
    ? K extends `El${infer B}`
      ? `el-${Uncapitalize<B>}`
      : Lowercase<K>
    : never
  : never;

/**
 * confirm el 字面量，转为 HyphenCase 格式
 */
export type OperationConformElName = keyof typeof OperationConfirmEl extends infer K
  ? K extends string
    ? K extends `El${infer B}`
      ? `el-${Uncapitalize<B>}`
      : Lowercase<K>
    : never
  : never;

/**
 * 操作按钮组件字面量
 */
export type ButtonEl = OperationElName | OperationEl | `${OperationEl}`;

/**
 * 二次操作按钮组件字面量
 */
export type ConformEl = OperationConformElName | OperationConfirmEl | `${OperationConfirmEl}`;

export namespace OperationNamespace {
  /**
   * 操作按钮独有 Props，会给 TableColumn 用
   */
  export interface ExtraProp {
    /**
     * 操作按钮集合
     */
    buttons?: MaybeRefOrGetter<ButtonRaw[]>;
    /**
     * 操作按钮类型
     *
     * @default 'ElLink'
     */
    el?: MaybeRefOrGetter<ButtonEl>;
    /**
     * 显示出来的按钮个数
     *
     * @default 3
     */
    showNumber?: number | ((row: TableRow, index: number) => number);
    /**
     * 二次确认配置
     */
    confirm?:
      | boolean
      | Record<string, any>
      | Confirm<OperationConfirmEl.ElPopconfirm | `${OperationConfirmEl.ElPopconfirm}`>
      | Confirm<OperationConfirmEl.ElMessageBox | `${OperationConfirmEl.ElMessageBox}`>;
  }

  export type Props = Omit<Partial<TableColumn>, "children" | "renderCell"> & ExtraProp;

  export interface Emits {
    /**
     * 操作按钮点击时触发
     */
    buttonClick: [params: OperationNamespace.ButtonsCallBackParams];
    /**
     * 二次确认的确定按钮点击时触发
     */
    buttonConfirm: [params: OperationNamespace.ButtonsCallBackParams];
    /**
     * 二次确认的取消按钮点击时触发
     */
    buttonCancel: [params: OperationNamespace.ButtonsCallBackParams];
  }

  /**
   * 二次确认组件配置项
   */
  export type Confirm<T extends keyof ConfirmProps> = {
    /**
     * 组件名称
     *
     * @default ElMessageBox
     */
    el?: MaybeRefOrGetter<ConformEl>;
    /**
     * 组件 props 属性
     */
    props?: ConfirmProps[T];
  };

  export type ConfirmProps = {
    ElPopconfirm: Partial<PopconfirmProps>;
    ElMessageBox: {
      /**
       * ElMessageBox.confirm 的 title
       *
       * @default '提示'
       */
      title?: string | ((data: ButtonsCallBackParams) => string);
      /**
       * ElMessageBox.confirm 的 message
       *
       * @default '确定执行本次操作'
       */
      message?: string | ((data: ButtonsCallBackParams) => string);
      /**
       * ElMessageBox.confirm 的 options
       */
      options?: ElMessageBoxOptions;
      /**
       * ElMessageBox.confirm 的 appContext
       */
      appContext?: AppContext | null;
    };
  };

  /**
   * 操作栏按钮配置项
   */
  export interface ButtonRaw {
    /**
     * 操作文本
     */
    text: MaybeRef<string> | ((row: TableRow, index: number, button: ButtonRowProps) => MaybeRef<string>);
    /**
     * 操作按钮唯一 code，可用来判断按钮类型
     */
    code?: string | number;
    /**
     * 操作按钮类型
     *
     * @default 'ElLink'
     */
    el?: MaybeRefOrGetter<ButtonEl>;
    /**
     * `@element-plus/icons-vue` 的图标名称，对 ElButton、ElLink、ElIcon 组件同时生效
     */
    icon?: Component;
    /**
     * ElButton、ElLink、ElIcon 组件对应的 props
     */
    elProps?: MaybeRef<ButtonRowProps> | ((row: TableRow, index: number, button: ButtonRaw) => ButtonRowProps);
    /**
     * ElTooltip 组件的 props， type 为 icon 时生效
     */
    tooltipProps?: Partial<ElTooltipProps>;
    /**
     * 按钮显示的逻辑 默认 true 显示，不需要显示给 false
     */
    show?: MaybeRef<boolean> | ((row: TableRow, index: number, button: ButtonRaw) => MaybeRef<boolean>);
    /**
     * 二次确认配置
     */
    confirm?: Props["confirm"];
    /**
     * 点击当前按钮时触发，可与PlusTable的事件 `clickAction` 同时触发； * 操作需要二次确认时：PlusTable的事件 `clickAction`会在确认时触发，而当前的onClick是在点击时触发
     */
    onClick?: (params: ButtonsCallBackParams) => void;
    /**
     * 操作需要二次确认时，点击确认时触发
     */
    onConfirm?: (params: ButtonsCallBackParams) => void;
    /**
     * 操作需要二次确认时，点击取消时触发， 可与PlusTable的事件 `clickActionConfirmCancel` 同时触发
     */
    onCancel?: (params: ButtonsCallBackParams) => void;
  }

  /**
   * 点击按钮回调的参数的类型
   */
  export interface ButtonsCallBackParams extends TableScope {
    /**
     * 点击按钮数据
     */
    buttonRaw: ButtonRaw;
    /**
     * 解析后的按钮数据中的 text
     */
    text: string;
    /**
     * 按钮点击事件数据
     */
    event: MouseEvent;
  }
}

export interface ElMessageBoxProps {
  /**
   * ElMessageBox.confirm 的 title
   *
   * @default '提示'
   */
  title?: string;
  /**
   * ElMessageBox.confirm 的 message
   *
   * @default '确定执行本次操作'
   */
  message?: string;
  /**
   * ElMessageBox.confirm 的 options
   */
  options?: ElMessageBoxOptions;
  /**
   * ElMessageBox.confirm 的 appContext
   */
  appContext?: AppContext | null;
}

export interface OperationButtonProps {
  /**
   * 按钮文字
   */
  text?: string;
  /**
   * 按钮类型
   */
  el?: MaybeRefOrGetter<ButtonEl>;
  /**
   * 按钮组件 props
   */
  elProps?: Recordable;
  /**
   * 按钮图标，仅当 el 为 ElIcon 时有效
   */
  icon?: Component;
  /**
   * ElTooltipProps props
   */
  tooltipProps?: Partial<ElTooltipProps>;
  /**
   * 二次确认组件
   */
  confirmEl?: MaybeRefOrGetter<ConformEl>;
  /**
   * 二次确认组件 props
   */
  confirmProps?: Partial<PopconfirmProps> | ElMessageBoxProps;
}

export interface OperationButtonEmits {
  /** 按钮点击事件，包含二次确认按钮的点击事件 */
  click: [event: MouseEvent];
  /** 二次确认点击事件 */
  confirm: [event: MouseEvent];
  /** 二次确认取消点击事件 */
  cancel: [event: MouseEvent];
}
