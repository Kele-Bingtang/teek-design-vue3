import type { MaybeRef, MaybeRefOrGetter } from "vue";
import type { AvatarProps, ImageProps, LinkProps, ProgressProps, TagProps } from "element-plus";
import type { ElOption, ElOptionField } from "@/components/pro/form-item";
import type { TableComponentEnum } from "../helper";
import type { TableRow } from "./table-column";
import type { OperationNamespace } from "./table-column-operation";

/**
 * el 字面量，转为 PascalCase 格式
 */
export type TablePascalCaseComponentName = keyof typeof TableComponentEnum extends infer K
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
export type TableHyphenCaseComponentName = keyof typeof TableComponentEnum extends infer K
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
export type TableElType = TablePascalCaseComponentName | TableHyphenCaseComponentName;

/**
 * el 组件 Props
 */
export type TableElProps = LinkProps | TagProps | ProgressProps | ImageProps | AvatarProps | Recordable;

export interface ElDisplayProps<T extends Recordable = any> {
  /**
   * 没有经过格式化的原始数据
   */
  originValue?: unknown;
  /**
   * 格式化后的数据，用于显示
   */
  displayValue?: unknown;
  /**
   * 指定组件进行修饰
   */
  el?: MaybeRefOrGetter<TableElType> | OperationNamespace.ExtraProp["el"];
  /**
   * 指定 el 组件的 Props，即会透传到 el 组件
   */
  elProps?: MaybeRef<TableElProps> | ((row: TableRow<T>) => TableElProps);
  /**
   * 指定 el 组件的 options
   */
  options?: ElOption[];
  /**
   * 自定义字典的 key
   */
  optionField?: ElOptionField;
}
