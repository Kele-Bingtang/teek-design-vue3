<script setup lang="ts">
import type { OperationNamespace, TableRow } from "../types";
import { toValue, ref, unref } from "vue";
import { ElTableColumn, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from "element-plus";
import { ArrowDownBold } from "@element-plus/icons-vue";
import { isFunction } from "@/common/utils";
import { toCamelCase, lastProp } from "@/components/pro/helper";
import { useNamespace } from "@/composables";
import { OperationConfirmEl, OperationEl } from "../helper";
import OperationButton from "../plugins/table-column-operation-button.vue";

import "../styles/table-column-operation.scss";

defineOptions({ name: "TableColumnOperation" });

const props = withDefaults(defineProps<OperationNamespace.Props>(), {
  buttons: () => [],
  el: OperationEl.ElLink,
  label: "操作栏",
  fixed: "right",
  width: 200,
  prop: "operation",
  showNumber: 3,
  confirm: false,
});

const ns = useNamespace("pro-table-operation");

const { getButtons, getText, getButtonEl, getButtonElProps } = useOperationButtonPropsGet();
const { hideOnClick, getCallbackParams, handleButtonClick, handleConfirm, handleCancel } = useOperationButtonEvent();
const { getConfirmEl, getConfirmProps } = useOperationConfirmPropsGet();

/**
 * 操作按钮相关信息获取
 */
function useOperationButtonPropsGet() {
  /**
   * 获取需要渲染的按钮和隐藏的按钮信息
   */
  const getButtons = (row: TableRow, index: number) => {
    const { buttons, showNumber } = props;

    const data = toValue(buttons).filter(item => {
      if (!isFunction(item.show)) return unref(item.show) !== false;
      const isShow = item.show(row, index, item);
      return unref(isShow) !== false;
    });

    const showNumberConst = isFunction(showNumber) ? showNumber(row, index) : showNumber;
    const showMore = data.length > showNumberConst;

    if (!showMore) return { showMore, showButtons: data, hideButtons: [] };
    return { showMore, showButtons: data.slice(0, showNumberConst), hideButtons: data.slice(showNumberConst) };
  };

  /**
   * 获取文本
   */
  const getText = (buttonRaw: OperationNamespace.ButtonRaw, row: TableRow, index: number) => {
    return isFunction(buttonRaw.text)
      ? unref(buttonRaw.text(row, index, { ...buttonRaw, text: undefined }))
      : unref(buttonRaw.text);
  };

  const getButtonEl = (buttonRaw: OperationNamespace.ButtonRaw) =>
    toCamelCase(toValue(buttonRaw.el || props.el)) as OperationEl;
  /**
   * 获取按钮相关组件的 Props
   */
  const getButtonElProps = (buttonRaw: OperationNamespace.ButtonRaw, row: TableRow, index: number) => {
    return isFunction(buttonRaw.elProps)
      ? buttonRaw.elProps(row, index, { ...buttonRaw, elProps: undefined })
      : unref(buttonRaw.elProps);
  };

  return { getButtons, getText, getButtonEl, getButtonElProps };
}

/**
 * 二次确认组件相关信息获取
 */
function useOperationConfirmPropsGet() {
  /**
   * 获取 confirm 弹窗组件
   */
  const getConfirmEl = (buttonRaw: OperationNamespace.ButtonRaw) => {
    // 优先计算按钮级别的 confirmEl
    if (buttonRaw.confirm === false) return;
    if (buttonRaw.confirm === true) return OperationConfirmEl.ElPopconfirm;
    if (buttonRaw.confirm?.el) return toValue(buttonRaw.confirm.el);
    if (buttonRaw.confirm) return OperationConfirmEl.ElPopconfirm;

    if (!props.confirm) return;
    if (props.confirm === true) return OperationConfirmEl.ElPopconfirm;
    return toValue(props.confirm.el) ?? "ElMessageBox"; // 默认使用 ElMessageBox
  };

  /**
   * 获取 confirm 弹窗组件 props
   */
  const getConfirmProps = (buttonRaw: OperationNamespace.ButtonRaw, scope: Recordable) => {
    const confirmEl = getConfirmEl(buttonRaw);
    const confirm = buttonRaw.confirm ?? props.confirm;

    if (!confirmEl) return;
    if (confirmEl === OperationConfirmEl.ElPopconfirm) {
      return (confirm as OperationNamespace.Confirm<OperationConfirmEl.ElPopconfirm>).props;
    }

    const callbackParams = getCallbackParams(buttonRaw, scope);

    const elMessageBoxConfirm = confirm as OperationNamespace.Confirm<OperationConfirmEl.ElMessageBox>;

    const title = isFunction(elMessageBoxConfirm?.props?.title)
      ? elMessageBoxConfirm.props.title(callbackParams)
      : elMessageBoxConfirm?.props?.title;

    const message = isFunction(elMessageBoxConfirm?.props?.message)
      ? elMessageBoxConfirm?.props.message(callbackParams)
      : elMessageBoxConfirm?.props?.message;

    return {
      ...elMessageBoxConfirm?.props,
      title,
      message,
    };
  };

  return { getConfirmEl, getConfirmProps };
}

const emits = defineEmits<OperationNamespace.Emits>();

/**
 * 操作按钮相关事件（包含事件触发后执行 emit）
 */
function useOperationButtonEvent() {
  // 控制下拉不隐藏，防止气泡定位异常
  const hideOnClick = ref(true);

  /**
   * 获取 emits 返回的参数信息
   */
  const getCallbackParams = (buttonRaw: OperationNamespace.ButtonRaw, scope: Recordable, event?: MouseEvent) => {
    const { row, $index } = scope;
    const text = getText(buttonRaw, row, $index);

    return {
      ...scope,
      text,
      rowIndex: $index,
      buttonRaw,
      event,
    } as OperationNamespace.ButtonsCallBackParams;
  };

  /**
   * 点击按钮事件
   */
  const handleButtonClick = (buttonRaw: OperationNamespace.ButtonRaw, scope: Recordable, event: MouseEvent) => {
    hideOnClick.value = true;
    const callbackParams = getCallbackParams(buttonRaw, scope, event);
    if (isFunction(buttonRaw.onClick)) buttonRaw.onClick(callbackParams);

    emits("buttonClick", callbackParams);
  };

  /**
   * 点击确认按钮事件
   */
  const handleConfirm = (buttonRaw: OperationNamespace.ButtonRaw, scope: Recordable, event: MouseEvent) => {
    const callbackParams = getCallbackParams(buttonRaw, scope, event);

    if (isFunction(buttonRaw.onConfirm)) buttonRaw.onConfirm(callbackParams);
    emits("buttonConfirm", callbackParams);
  };

  /**
   * 点击取消按钮事件
   */
  const handleCancel = (buttonRaw: OperationNamespace.ButtonRaw, scope: Recordable, event: MouseEvent) => {
    const callbackParams = getCallbackParams(buttonRaw, scope, event);

    if (isFunction(buttonRaw.onCancel)) buttonRaw.onCancel(callbackParams);
    emits("buttonCancel", callbackParams);
  };

  return { hideOnClick, getCallbackParams, handleButtonClick, handleConfirm, handleCancel };
}
</script>

<template>
  <el-table-column
    v-bind="{ ...$attrs, ...props, buttons: undefined, el: undefined, showNumber: undefined, confirm: undefined }"
    :label="toValue(label)"
    :width="toValue(width)"
    :class-name="className ? className : '' + ns.b()"
  >
    <!-- 表头插槽 - 表头内容 -->
    <template #header="scope">
      <component v-if="renderHeader" :is="renderHeader(scope)" />
      <slot v-else :name="`${lastProp(prop)}-header`" v-bind="scope">{{ scope.column.label }}</slot>
    </template>

    <!-- 默认插槽 - 单元格内容 -->
    <template #default="scope">
      <component v-if="render" :is="render(scope)" />
      <slot v-else-if="$slots[lastProp(prop)]" :name="lastProp(prop)" v-bind="scope" />

      <template v-else>
        <slot name="operation-before" v-bind="scope" />
        <!-- 显示出来的按钮 -->
        <template v-for="button in getButtons(scope.row, scope.$index).showButtons" :key="button.text">
          <OperationButton
            :text="getText(button, scope.row, scope.$index)"
            :el="getButtonEl(button)"
            :el-props="getButtonElProps(button, scope.row, scope.$index)"
            :icon="button.icon"
            :tooltip-props="button.tooltipProps"
            :confirm-el="getConfirmEl(button)"
            :confirm-props="getConfirmProps(button, scope)"
            @click="e => handleButtonClick(button, scope, e)"
            @confirm="e => handleConfirm(button, scope, e)"
            @cancel="e => handleCancel(button, scope, e)"
          />
        </template>

        <slot name="operation-after" v-bind="scope" />

        <!-- 隐藏的按钮 -->
        <el-dropdown v-if="getButtons(scope.row, scope.$index).showMore" trigger="click" :hide-on-click="hideOnClick">
          <span :class="ns.e('more')">
            <span :class="ns.em('more', 'text')">更多</span>
            <slot name="operation-more-icon">
              <el-icon><ArrowDownBold /></el-icon>
            </slot>
          </span>

          <!-- 下拉按钮 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="button in getButtons(scope.row, scope.$index).hideButtons"
                :key="getText(button, scope.row, scope.$index)"
              >
                <OperationButton
                  :text="getText(button, scope.row, scope.$index)"
                  :el="getButtonEl(button)"
                  :el-props="getButtonElProps(button, scope.row, scope.$index)"
                  :icon="button.icon"
                  :tooltip-props="button.tooltipProps"
                  :confirm-el="getConfirmEl(button)"
                  :confirm-props="getConfirmProps(button, scope)"
                  @click="e => handleButtonClick(button, scope, e)"
                  @confirm="e => handleConfirm(button, scope, e)"
                  @cancel="e => handleCancel(button, scope, e)"
                />
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </template>
  </el-table-column>
</template>
