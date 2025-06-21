import {
  render,
  getCurrentInstance,
  type Component,
  type ComponentInternalInstance,
  type VNode,
  type AppContext,
  nextTick,
  ref,
} from "vue";
import { ElDrawer, ElButton, type DrawerProps, ElConfigProvider } from "element-plus";
import { Icon } from "@/components";
import "./index.scss";
import { useNamespace } from "@/composables";
import { ConfigGlobalKey } from "@/config";

const ns = useNamespace("pro-drawer");
const blockClass = ns.b();

let id = 0;

let appContextConst: AppContext | undefined;
let layoutSize: "default" | "small" | "large" | undefined;

const getFather = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

export interface ProDrawerProps extends Partial<DrawerProps> {
  render?: () => VNode; // 内容区渲染 TSX
  headerRender?: () => VNode; // 顶部渲染 TSX
  footerRender?: (closeDrawer: () => void) => VNode; // 顶部渲染 TSX
  showFooter?: boolean; // 是否渲染顶部
  onConfirm?: (closeDrawer: () => void) => any; // 确认按钮点击事件
  onClose?: (closeDrawer: () => void) => any; // 关闭按钮点击事件
  confirmLabel?: string; // 确认按钮文字，默认 确认
  closeLabel?: string; // 关闭按钮文字，默认 关闭
  fullscreen?: boolean; // 是否默认全屏，默认 false
  fullscreenIcon?: boolean; // 是否渲染全屏图标，默认 true
}

export const closeDrawer = () => {
  const vm = document.querySelector(`#${blockClass}-${id--}`) as HTMLElement;
  vm && getFather().removeChild(vm);
};

const handleClose = async (drawerProps?: ProDrawerProps) => {
  if (!drawerProps?.onClose) return closeDrawer();

  const result = await drawerProps?.onClose(closeDrawer);
  if (result || result === 0) return closeDrawer();
};

const handleConfirm = async (drawerProps?: ProDrawerProps) => {
  if (!drawerProps?.onConfirm) return closeDrawer();

  const result = await drawerProps?.onConfirm(closeDrawer);
  if (result || result === 0) return closeDrawer();
};

/**
 * 内容渲染方式有两种
 * 方式 1：在第一个参数里写 render，即可实现 el-drawer 的内容渲染
 * 方式 2：第二个参数为组件，第三个参数为组件的 props
 *
 * 在第一个参数里写 headerRender 和 footerRender，可以自定义 el-drawer 的 header 和 footer
 */
export const showDrawer = (drawerProps: ProDrawerProps, component?: Component, componentsProps?: any) => {
  const isFullscreen = ref(false);

  const toggleFull = () => {
    const elDrawerEl = document.querySelector(
      `${`#${blockClass}-${id}`} .${blockClass}.${ns.elNamespace}-drawer`
    ) as HTMLElement;
    if (elDrawerEl) elDrawerEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !isFullscreen.value;
  };

  const vm = (
    <ElConfigProvider namespace={ns.elNamespace} size={layoutSize}>
      <ElDrawer
        modelValue
        title="弹框"
        size="30%"
        before-close={() => handleClose(drawerProps)}
        {...drawerProps}
        render
        headerRender
        footerRender
        class={blockClass}
      >
        {{
          default: () => {
            if (drawerProps.render) return drawerProps.render();
            return <component is={component} {...componentsProps}></component>;
          },
          header: () => {
            if (drawerProps.headerRender) return drawerProps.headerRender();
            return (
              <>
                <span class={`${ns.elNamespace}-drawer__title`}>{drawerProps.title}</span>
                {drawerProps.fullscreenIcon !== false && (
                  <Icon
                    icon={isFullscreen.value ? "core-fullscreen-exit" : "core-fullscreen"}
                    onClick={() => toggleFull()}
                    width="18px"
                    height="18px"
                    color={`var(--${ns.elNamespace}-color-info)`}
                    hover-color={`var(--${ns.elNamespace}-color-primary)`}
                    icon-style={{ cursor: "pointer" }}
                  />
                )}
              </>
            );
          },
          footer: () => {
            if (drawerProps.footerRender) return drawerProps.footerRender(closeDrawer);
            if (drawerProps.showFooter === false) return;
            return (
              <>
                <ElButton onClick={() => handleClose(drawerProps)}>{drawerProps.closeLabel || "取 消"}</ElButton>
                <ElButton type="primary" onClick={() => handleConfirm(drawerProps)}>
                  {drawerProps.confirmLabel || "确 定"}
                </ElButton>
              </>
            );
          },
        }}
      </ElDrawer>
    </ElConfigProvider>
  );

  vm.appContext = appContextConst;
  vm.children?.length && (vm.children[0].appContext = appContextConst);

  const container = document.createElement("div");
  container.id = `${blockClass}-${++id}`;
  getFather().appendChild(container);
  render(vm, container);

  nextTick(() => {
    if (drawerProps.fullscreen) toggleFull();
  });
};

export const initDrawer = (ctx?: ComponentInternalInstance) => {
  const { appContext } = ctx || getCurrentInstance() || {};
  appContextConst = appContext;
  layoutSize = inject(ConfigGlobalKey)?.size.value;

  return { showDrawer };
};
