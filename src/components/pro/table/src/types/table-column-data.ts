import type { ComponentNameEnum } from "../helper";
import type { TableColumn, TableScope } from "./table-column";

/**
 * el 字面量，转为 PascalCase 格式
 */
export type PascalCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}${Capitalize<Lowercase<C>>}`
        : `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : Capitalize<Lowercase<K>>
    : never
  : never;

/**
 * el 字面量，转为 HyphenCase 格式
 */
export type HyphenCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Lowercase<A>}-${Lowercase<B>}-${Lowercase<C>}`
        : `${Lowercase<A>}-${Lowercase<B>}`
      : Lowercase<K>
    : never
  : never;

/**
 * el 字面量
 */
export type TableElType = PascalCaseComponentName | HyphenCaseComponentName;

export namespace TableColumnDataNamespace {
  export interface Props {
    /**
     * 列配置
     */
    column: TableColumn;
    /**
     * 字典
     */
    optionsMap?: Recordable[];
    /**
     * 是否开启编辑功能，或指定编辑功能触发方式
     */
    editable?: boolean | "click" | "dblclick";
  }

  export interface Emits {
    /**
     * 表单值改变事件
     */
    formChange: [fromValue: unknown, prop: NonNullable<TableColumn["prop"]>, scope: TableScope];
    /**
     * 过滤事件，返回输入的值以及 prop
     */
    filter: [filterModel: Recordable, filterValue: unknown, prop: string | undefined];
    /**
     * 清空事件，返回输入的 prop
     */
    filterClear: [prop: string | undefined];
    /**
     * 重置所有表单事件
     */
    filterReset: [];
  }
}
