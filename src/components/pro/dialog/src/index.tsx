import type { Component, ComponentInternalInstance, AppContext, ComputedRef } from "vue";
import type { DialogProps } from "element-plus";
import type { ProDialogProps } from "./types";
import { render, getCurrentInstance, nextTick, ref, computed, watch, inject } from "vue";
import { ElDialog, ElButton, ElScrollbar, ElConfigProvider } from "element-plus";
import { addUnit, isArray } from "@/common/utils";
import { useNamespace } from "@/composables";
import { GlobalConfigKey } from "@/common/config";
import { Icon } from "@/components/core/icon";

import "./index.scss";

export type ProUseDialogProps = ProDialogProps & Partial<DialogProps>;

const ns = useNamespace("pro-dialog");
const blockClass = ns.b();
let appContextConst: AppContext | null;
let layoutSize: ComputedRef<"default" | "small" | "large" | undefined>;
let id = 0;

/**
 * 获取上一级元素，插入 Dialog 时用到
 */
const getFatherDom = (): Element => {
  const fullScreenDom = document.querySelector(":not(:root):fullscreen");
  if (fullScreenDom) return fullScreenDom;
  return document.querySelector("body") as HTMLBodyElement;
};

/**
 * 关闭弹框
 */
export const closeDialog = () => {
  const vm = document.querySelector(`#${blockClass}-${id--}`) as HTMLElement;
  vm && getFatherDom().removeChild(vm);
};

/**
 * 点击确认按钮回调
 */
const handleConfirm = async (dialogProps: ProUseDialogProps) => {
  if (!dialogProps.onConfirm) return closeDialog();

  const result = await dialogProps.onConfirm(closeDialog);
  if (result !== false) closeDialog();
};

/**
 * 点击取消按钮回调
 */
const handleCancel = async (dialogProps: ProUseDialogProps) => {
  if (!dialogProps.onCancel) return closeDialog();

  const result = await dialogProps.onCancel(closeDialog);
  if (result !== false) closeDialog();
};

/**
 * 内容渲染方式有两种
 * 方式 1：在第一个参数里写 render，即可实现 el-dialog 的内容渲染
 * 方式 2：第二个参数为组件，第三个参数为组件的 props
 *
 * 在第一个参数里写 headerRender 和 footerRender，可以自定义 el-dialog 的 header 和 footer
 */
export const showDialog = (
  dialogProps: ProUseDialogProps = {},
  component?: Component,
  componentsProps?: { [slotName: string]: (scope?: unknown) => unknown }
) => {
  const isFullscreen = ref(dialogProps.fullscreen ?? false);
  const contentHeight = ref(addUnit(dialogProps.height ?? 400));

  const footerStyle = computed(() => ({
    justifyContent:
      dialogProps.footerAlign === "left" ? "flex-start" : dialogProps.footerAlign === "center" ? "center" : "flex-end",
  }));

  watch(
    isFullscreen,
    async val => {
      await nextTick();

      if (val) {
        const windowHeight = document.documentElement.offsetHeight;
        // 弹框整体 padding 上下各 16，头部高度 47，内容区整体 padding 上下各 25，底部存在时高度 52
        contentHeight.value = `${windowHeight - 32 - 47 - 50 - (dialogProps.showFooter !== false ? 52 : 0) - (dialogProps.heightOffsetInFullscreen ?? 0)}px`;
      } else contentHeight.value = addUnit(dialogProps.height ?? 400);
    },
    { immediate: true }
  );

  const toggleFullscreen = () => {
    const elDialogEl = document.querySelector(
      `${`#${blockClass}-${id}`} .${blockClass}.${ns.elNamespace}-dialog`
    ) as HTMLElement;

    if (elDialogEl) elDialogEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !isFullscreen.value;

    dialogProps.onFullscreen?.(isFullscreen.value);
  };

  const finalDialogProps = {
    ...dialogProps,
    onConfirm: undefined,
    onCancel: undefined,
    render: undefined,
    headerRender: undefined,
    footerRender: undefined,
  };

  const vm = (
    <ElConfigProvider namespace={ns.elNamespace} size={layoutSize.value}>
      <ElDialog
        modelValue
        title="弹框"
        top="10vh"
        width="50%"
        close-on-click-modal={false}
        draggable
        before-close={() => handleCancel(dialogProps)}
        {...finalDialogProps}
        class={blockClass}
      >
        {{
          default: () => {
            return (
              <ElScrollbar height={contentHeight.value} maxHeight={dialogProps.maxHeight}>
                {dialogProps.render ? dialogProps.render() : <component is={component} {...componentsProps} />}
              </ElScrollbar>
            );
          },
          header: (scope: unknown) => {
            if (dialogProps.headerRender) return dialogProps.headerRender(scope);
            return (
              <div style="display: flex">
                <span class={`${ns.elNamespace}-dialog__title`} style="flex: 1">
                  {dialogProps.title}
                </span>
                {dialogProps.fullscreenIcon !== false && (
                  <Icon
                    icon={isFullscreen.value ? "core-fullscreen-exit" : "core-fullscreen"}
                    size="15px"
                    color={ns.cssVarEl("color-info")}
                    hover
                    hover-color={ns.cssVarEl("color-primary")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    class="fullscreen-icon"
                    {...{ onClick: () => toggleFullscreen() }}
                  />
                )}
              </div>
            );
          },
          footer: dialogProps.showFooter
            ? () => {
                if (dialogProps.footerRender) return dialogProps.footerRender(closeDialog);
                return (
                  <>
                    {dialogProps.footerTopRender && <component is={dialogProps.footerTopRender} />}

                    <div class={ns.e("footer")} style={footerStyle.value}>
                      <ElButton onClick={() => handleCancel(dialogProps)}>{dialogProps.cancelText || "取消"}</ElButton>
                      <ElButton
                        type="primary"
                        loading={dialogProps.confirmLoading}
                        onClick={() => handleConfirm(dialogProps)}
                      >
                        {dialogProps.confirmText || "确定"}
                      </ElButton>
                    </div>
                  </>
                );
              }
            : undefined,
        }}
      </ElDialog>
    </ElConfigProvider>
  );

  vm.appContext = appContextConst;
  if (isArray(vm.children) && vm.children.length) (vm.children[0] as any).appContext = appContextConst;

  const container = document.createElement("div");
  container.id = `${blockClass}-${++id}`;
  getFatherDom().appendChild(container);
  render(vm, container);
};

export const initDialog = (ctx?: ComponentInternalInstance) => {
  const { appContext = null } = ctx || getCurrentInstance() || {};
  appContextConst = appContext;

  const globalConfig = inject(GlobalConfigKey);
  layoutSize = computed(() => globalConfig?.size.value ?? "default");

  return { showDialog };
};
