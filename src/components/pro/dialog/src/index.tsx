import {
  render,
  getCurrentInstance,
  type Component,
  type ComponentInternalInstance,
  type VNode,
  type AppContext,
  nextTick,
  ref,
  watch,
} from "vue";
import { ElDialog, ElButton, type DialogProps, ElScrollbar, ElConfigProvider } from "element-plus";
import { addUnit } from "@/utils";
import { Icon } from "@/components";
import "./index.scss";
import { useNamespace } from "@/composables";
import { ConfigGlobalKey } from "@/config";

const ns = useNamespace("pro-dialog");
const blockClass = ns.b();

let id = 0;

let appContextConst: AppContext | undefined;
let layoutSize: "default" | "small" | "large" | undefined;

const getFather = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

export interface ProDialogProps extends Partial<DialogProps> {
  render?: () => VNode; // 内容渲染 TSX
  headerRender?: (scope: any) => VNode; // 头部渲染 TSX
  footerRender?: (closeDialog: () => void) => VNode; // 底部渲染 TSX
  showFooter?: boolean; // 是否渲染底部，默认 true
  onConfirm?: (closeDialog: () => void) => any; // 确认按钮点击事件
  onClose?: (closeDialog: () => void) => any; // 关闭按钮点击事件
  confirmLabel?: string; // 确认按钮文字，默认 确 认
  closeLabel?: string; // 关闭按钮文字，默认 关 闭
  fullscreen?: boolean; // 是否默认全屏，默认 false
  fullscreenIcon?: boolean; // 是否渲染全屏图标，默认 true
  height?: string | number; // 内容高度，默认 400px
  maxHeight?: string | number; // 内容最大高度
}

/**
 * @description 关闭弹框
 */
export const closeDialog = () => {
  const vm = document.querySelector(`#${blockClass}-${id--}`) as HTMLElement;
  vm && getFather().removeChild(vm);
};

const handleClose = async (dialogProps?: ProDialogProps) => {
  if (!dialogProps?.onClose) return closeDialog();

  const result = await dialogProps?.onClose(closeDialog);
  if (result || result === 0) return closeDialog();
};

const handleConfirm = async (dialogProps?: ProDialogProps) => {
  if (!dialogProps?.onConfirm) return closeDialog();

  const result = await dialogProps?.onConfirm(closeDialog);
  if (result || result === 0) return closeDialog();
};

/**
 * 内容渲染方式有两种
 * 方式 1：在第一个参数里写 render，即可实现 el-dialog 的内容渲染
 * 方式 2：第二个参数为组件，第三个参数为组件的 props
 *
 * 在第一个参数里写 headerRender 和 footerRender，可以自定义 el-dialog 的 header 和 footer
 */
export const showDialog = (dialogProps: ProDialogProps, component?: Component, componentsProps?: any) => {
  const isFullscreen = ref(dialogProps.fullscreen || false);

  const toggleFull = () => {
    const elDialogEl = document.querySelector(
      `${`#${blockClass}-${id}`} .${blockClass}.${ns.elNamespace}-dialog`
    ) as HTMLElement;
    if (elDialogEl) elDialogEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !isFullscreen.value;
  };

  const contentHeight = ref(addUnit(dialogProps.height || 400));

  watch(
    () => isFullscreen.value,
    async (val: boolean) => {
      await nextTick();
      if (val) {
        const windowHeight = document.documentElement.offsetHeight;
        // 头部高度 41px，顶部 padding-bottom 16px，内容区 padding 上下各 15，底部高度 49px，顶部 padding-top 16px
        contentHeight.value = `${windowHeight - 41 - 16 - 30 - 49 - 16 - (dialogProps.footerRender ? 63 : 0)}px`;
      } else {
        contentHeight.value = addUnit(dialogProps.height || 400);
      }
    },
    {
      immediate: true,
    }
  );

  const vm = (
    <ElConfigProvider namespace={ns.elNamespace} size={layoutSize}>
      <ElDialog
        modelValue
        title="弹框"
        top="2vh"
        width="50%"
        before-close={() => handleClose(dialogProps)}
        close-on-click-modal={false}
        draggable
        {...dialogProps}
        class={blockClass}
      >
        {{
          default: () => {
            if (dialogProps.render) {
              return (
                <ElScrollbar height={contentHeight.value} maxHeight={dialogProps.maxHeight}>
                  {dialogProps.render()}
                </ElScrollbar>
              );
            }
            return (
              <ElScrollbar height={contentHeight.value} maxHeight={dialogProps.maxHeight}>
                <component is={component} {...componentsProps}></component>
              </ElScrollbar>
            );
          },
          header: (scope: any) => {
            if (dialogProps?.headerRender) return dialogProps.headerRender(scope);
            return (
              <div style="display: flex">
                <span class={`${ns.elNamespace}-dialog__title`} style="flex: 1">
                  {dialogProps.title}
                </span>
                {dialogProps.fullscreenIcon !== false && (
                  <Icon
                    icon={isFullscreen.value ? "core-fullscreen-exit" : "core-fullscreen"}
                    onClick={() => toggleFull()}
                    width="15px"
                    height="15px"
                    color={`var(--${ns.elNamespace}-color-info)`}
                    hover-color={`var(--${ns.elNamespace}-color-primary)`}
                    icon-style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            );
          },
          footer: () => {
            if (dialogProps.footerRender) return dialogProps.footerRender(closeDialog);
            if (dialogProps.showFooter === false) return;
            return (
              <>
                <ElButton onClick={() => handleClose(dialogProps)}>{dialogProps.closeLabel || "取 消"}</ElButton>
                <ElButton type="primary" onClick={() => handleConfirm(dialogProps)}>
                  {dialogProps.confirmLabel || "确 定"}
                </ElButton>
              </>
            );
          },
        }}
      </ElDialog>
    </ElConfigProvider>
  );

  vm.appContext = appContextConst;
  vm.children?.length && (vm.children[0].appContext = appContextConst);

  const container = document.createElement("div");
  container.id = `${blockClass}-${++id}`;
  getFather().appendChild(container);
  render(vm, container);
};

export const initDialog = (ctx?: ComponentInternalInstance) => {
  const { appContext } = ctx || getCurrentInstance() || {};
  appContextConst = appContext;
  layoutSize = inject(ConfigGlobalKey)?.size.value;

  return { showDialog };
};
