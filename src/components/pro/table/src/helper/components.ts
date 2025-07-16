import type { Component, VNode } from "vue";
import type { ElDisplayProps, TablePascalCaseComponentName } from "../types";
import { withModifiers, h } from "vue";
import { ElLink, ElTag, ElCheckTag, ElProgress, ElImage, ElAvatar, dayjs, ElIcon, ElMessage } from "element-plus";
import { DocumentCopy } from "@element-plus/icons-vue";
import { isArray, isString, isEmpty } from "@/common/utils";

export interface ComponentConfig {
  /**
   * 组件实例，与 renderEl 二选一
   */
  is?: string | Component;
  /**
   * 自定义函数渲染，与 is 二选一
   */
  renderEl?: (value: unknown, props: Record<string, any>, formatValue: unknown) => VNode | Component;
  /**
   * 组件默认 Props，如果外界传入相同的配置，则会覆盖默认的配置
   */
  props?:
    | Record<string, any>
    | ((value: unknown, formatValue: unknown, options: ElDisplayProps["options"] | undefined) => Record<string, any>);
  /**
   * 格式化单元格数据
   */
  format?: (value: unknown, props: Record<string, any>) => unknown;
  /**
   * 是否隐藏单元格，默认不隐藏
   */
  hidden?: (value: unknown, props: Record<string, any>) => boolean;
}

/**
 * 组件名枚举，key 要求是大写和 PascalCase 格式（自动与 componentMap 映射），value 则是 el 的字面量（使用配置项的 el 时用到）
 */
export enum TableComponentEnum {
  EL_TAG = "ElTag",
  EL_CHECK_TAG = "ElCheckTag",
  EL_LINK = "ElLink",
  EL_PROGRESS = "ElProgress",
  EL_IMAGE = "ElImage",
  EL_AVATAR = "ElAvatar",
  Date = "Date",
  Money = "Money",
  Copy = "Copy",
}

/**
 * 这里可以注册其他组件，先需要在 TablePascalCaseComponentName 里添加 el 名，再在这里进行组件映射
 */
const tableElComponentsMap: Record<
  TablePascalCaseComponentName,
  Omit<Component, keyof ComponentConfig> | ComponentConfig
> = {
  // 标签
  ElTag: {
    is: ElTag,
    hidden: value => isEmpty(value),
    props: (value, _, options) => {
      const option = options?.find(item => item.label === value) || {};
      const { tagType, tagEffect, tagColor, tagSize, tagRound, tagHit } = option;

      return {
        type: tagType,
        effect: tagEffect,
        color: tagColor,
        size: tagSize,
        round: tagRound,
        hit: tagHit,
      };
    },
  },
  // 复选标签
  ElCheckTag: {
    is: ElCheckTag,
    hidden: value => isEmpty(value),
    props: (value, _, options) => {
      const option = options?.find(item => item.label === value) || {};
      const { tagType, tagDisabled } = option;

      return {
        type: tagType,
        disabled: tagDisabled,
      };
    },
  },
  // Link
  ElLink: { is: ElLink, hidden: value => isEmpty(value), props: { type: "primary" } },
  // 进度条
  ElProgress: { is: ElProgress, props: value => ({ percentage: value }) },
  // 图片
  ElImage: {
    is: ElImage,
    props: value => {
      const defaultProps: Record<string, any> = { fit: "cover", previewTeleported: true, src: "", previewSrcList: [] };
      if (isString(value)) {
        defaultProps.src = value;
        defaultProps.previewSrcList = [value];
      } else if (isArray(value)) {
        defaultProps.src = value[0];
        defaultProps.previewSrcList = value;
      }
      return defaultProps;
    },
  },
  // 头像
  ElAvatar: { is: ElAvatar, props: value => ({ src: value }) },
  // 日期
  Date: {
    is: "span",
    hidden: value => isEmpty(value),
    format: (value, props) => {
      if (!value) return "";
      const { format = "YYYY-MM-DD HH:mm:ss" } = props;
      return dayjs((value as string) || new Date()).format(format);
    },
  },
  // 金钱
  Money: {
    is: "span",
    hidden: value => isEmpty(value),
    format: (value, props) => {
      if (!value) return "";
      const { format = "￥", decimal = 2 } = props;
      return `${format}${Number(value).toFixed(decimal)}`;
    },
  },
  // 值复制
  Copy: {
    hidden: value => isEmpty(value),
    renderEl: (value, props) =>
      h("span", {}, [
        h("span", {}, { default: () => value }),
        h(
          ElIcon,
          {
            size: "16",
            ...props,
            class: props.class ? `${props.class} el-copy-icon` : "el-copy-icon",
            onClick: withModifiers(() => copy(value + ""), ["stop"]),
          },
          { default: () => h(DocumentCopy) }
        ),
      ]),
  },
};

const copy = async (str: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(str);
  } else {
    const input = document.createElement("input");
    input.setAttribute("readonly", "readonly");
    input.setAttribute("value", str);
    document.body.appendChild(input);
    input.select();
    if (document.execCommand("copy")) document.execCommand("copy");
    document.body.removeChild(input);
  }

  ElMessage.success("复制成功");
};

export { tableElComponentsMap };
