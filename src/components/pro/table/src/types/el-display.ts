import type { AvatarProps, ImageProps, LinkProps, ProgressProps, TagProps } from "element-plus";
import type { TableComponentEnum } from "../helper";

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

export interface ElDisplayProps {
  /**
   * 指定组件进行修饰
   */
  el?: TableElType;
  /**
   * 指定 el 组件的 Props，即会透传到 el 组件
   */
  elProps?: MaybeRefOrGetter<LinkProps | TagProps | ProgressProps | ImageProps | AvatarProps | Recordable>;
  /**
   * 显示的数据
   */
  value: unknown;
}
