import type { MaybeRef, MaybeRefOrGetter } from "vue";
import type { TabPaneProps } from "element-plus";
import type { RenderTypes } from "@/components/pro/form-item";

export interface TabColumn extends Partial<TabPaneProps> {
  /**
   * tab 唯一标识，等价于 ElTabPane 的 name
   */
  prop?: string;
  /**
   * Tab 内容（组件）
   */
  el?: RenderTypes;
  /**
   * el 组件的 Props
   */
  elProps?: MaybeRef<Record<string, any>>;
  /**
   * el 组件的插槽
   */
  elSlots?: {
    [slotName: string]: (data: Record<string, any>) => RenderTypes;
  };
  /**
   * 是否销毁 ElTabPane，true 销毁，false 不销毁，类似于 v-if
   *
   * @default false
   */
  destroy?: MaybeRefOrGetter<boolean>;
  /**
   * 是否隐藏 ElTabPane，true 隐藏，false 不隐藏，类似于 v-show
   *
   * @default false
   */
  hidden?: MaybeRefOrGetter<boolean>;
  /**
   * 自定义 ElTabPane 内容渲染（支持 h、tsx 语法）
   */
  render?: () => RenderTypes;
  /**
   * 自定义 ElTabPane 标题渲染（支持 h、tsx 语法）
   */
  renderLabel?: () => RenderTypes;
}

export interface ProTabsProps {
  /**
   * Tabs 列配置
   */
  columns?: TabColumn[];
  /**
   * 是否使用 card 样式
   *
   * @default false
   */
  card?: boolean;
}
