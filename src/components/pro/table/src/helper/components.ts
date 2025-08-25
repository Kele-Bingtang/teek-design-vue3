import type { Component, VNode } from "vue";
import type { ElDisplayProps, TablePascalCaseComponentName } from "../types";
import { withModifiers, h, Fragment } from "vue";
import {
  ElLink,
  ElTag,
  ElCheckTag,
  ElProgress,
  ElImage,
  ElAvatar,
  dayjs,
  ElIcon,
  ElMessage,
  ElText,
} from "element-plus";
import { DocumentCopy } from "@element-plus/icons-vue";
import { isArray, isString, isEmpty } from "@/common/utils";
import { PointTag } from "@/components/core/point-tag";
import { useNamespace } from "@/composables";

export interface ElRenderParams {
  /** 未经过处理的原始值 */
  originValue: unknown;
  /** 经过处理的单元格值，如 originValue 为 0，displayValue 为男 */
  displayValue: unknown;
  /** format 函数处理后的值 */
  formatValue: unknown;
  /** 置项的 elProps */
  props: Recordable;
  /** 配置项的 options（已经处理拿到的实际值） */
  options: ElDisplayProps["options"];
  /** 配置项的 optionField */
  optionField: ElDisplayProps["optionField"];
}

export interface ComponentConfig {
  /**
   * 组件实例，与 renderEl 二选一
   */
  is?: string | Component;
  /**
   * 自定义函数渲染，与 is 二选一
   */
  renderEl?: (scope: ElRenderParams) => VNode | Component;
  /**
   * 组件默认 Props，如果外界传入相同的配置，则会覆盖默认的配置
   */
  props?: Recordable | ((scope: ElRenderParams) => Recordable);
  /**
   * 格式化单元格数据
   */
  format?: (value: unknown, props: Recordable) => unknown;
  /**
   * 是否隐藏单元格，默认不隐藏
   */
  hidden?: (value: unknown, props: Recordable) => boolean;
}

/**
 * 组件名枚举，key 要求是大写和 PascalCase 格式（自动与 componentMap 映射），value 则是 el 的字面量（使用配置项的 el 时用到）
 */
export enum TableComponentEnum {
  El_TEXT = "ElText",
  EL_TAG = "ElTag",
  EL_CHECK_TAG = "ElCheckTag",
  EL_LINK = "ElLink",
  EL_PROGRESS = "ElProgress",
  EL_IMAGE = "ElImage",
  EL_AVATAR = "ElAvatar",
  DATE = "Date",
  MONEY = "Money",
  COPY = "Copy",
  POINT_TAG = "PointTag",
}

type TableElComponentsMap = Record<
  TablePascalCaseComponentName,
  Omit<Component, keyof ComponentConfig> | ComponentConfig
>;

/**
 * 这里可以注册其他组件，先需要在 TablePascalCaseComponentName 里添加 el 名，再在这里进行组件映射
 */
const tableElComponentsMap: TableElComponentsMap = {
  // 文本
  ElText,
  // 标签
  ElTag: {
    is: ElTag,
    hidden: value => isEmpty(value),
    props: ({ originValue, options, optionField }) => {
      const option = findOption(originValue, options, optionField);
      if (!option) return {};

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
    props: ({ originValue, options, optionField }) => {
      const option = findOption(originValue, options, optionField);
      if (!option) return {};

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
  ElProgress: { is: ElProgress, props: ({ displayValue }) => ({ percentage: displayValue }) },
  // 图片
  ElImage: {
    is: ElImage,
    props: ({ displayValue }) => {
      const defaultProps: Recordable = { fit: "cover", previewTeleported: true, src: "", previewSrcList: [] };
      if (isString(displayValue)) {
        defaultProps.src = displayValue;
        defaultProps.previewSrcList = [displayValue];
      } else if (isArray(displayValue)) {
        defaultProps.src = displayValue[0];
        defaultProps.previewSrcList = displayValue;
      }
      return defaultProps;
    },
  },
  // 头像
  ElAvatar: { is: ElAvatar, props: ({ displayValue }) => ({ src: displayValue }) },
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
    renderEl: ({ displayValue, props }) =>
      h("span", {}, [
        h("span", {}, { default: () => displayValue }),
        h(
          ElIcon,
          {
            size: "16",
            ...props,
            class: props.class ? `${props.class} el-cell-copy-icon` : "el-cell-copy-icon",
            onClick: withModifiers(() => copy(displayValue + ""), ["stop"]),
          },
          { default: () => h(DocumentCopy) }
        ),
      ]),
  },
  PointTag: {
    hidden: value => isEmpty(value),
    props: ({ originValue, options, optionField }) => {
      const option = findOption(originValue, options, optionField);
      if (!option) return {};

      const { tagType, tagColor, tagSize, tagPosition, tagOffset } = option;
      return {
        type: tagType,
        color: tagColor,
        size: tagSize,
        position: tagPosition,
        offset: tagOffset,
      };
    },
    renderEl: ({ displayValue, props }) => {
      return h(Fragment, null, [
        h(PointTag, {
          ...props,
          class: props.class
            ? `${props.class} ${useNamespace().namespace}-cell-point-tag`
            : `${useNamespace().namespace}-cell-point-tag`,
        }),
        h("span", {}, { default: () => displayValue }),
      ]);
    },
  },
};

// 通过 value 对应的 option
const findOption = (value: unknown, options: ElDisplayProps["options"], optionField: ElDisplayProps["optionField"]) => {
  return options?.find(item => item[optionField?.value ?? "value"] === value);
};

// 复制图标点击事件
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
