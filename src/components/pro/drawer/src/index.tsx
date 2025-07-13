import type { Component, ComponentInternalInstance, AppContext, ComputedRef } from "vue";
import type { ProDrawerProps } from "./types";
import type { DrawerProps } from "element-plus";
import { render, getCurrentInstance, nextTick, ref, computed, inject } from "vue";
import { ElDrawer, ElButton, ElConfigProvider } from "element-plus";
import { useNamespace } from "@/composables";
import { isArray } from "@/common/utils";
import { GlobalConfigKey } from "@/common/config";
import { Icon } from "@/components/core/icon";

import "./index.scss";

export type ProUseDrawerProps = ProDrawerProps & Partial<DrawerProps>;

const ns = useNamespace("pro-drawer");
const blockClass = ns.b();
let appContextConst: AppContext | null;
let layoutSize: ComputedRef<"default" | "small" | "large" | undefined>;
let id = 0;

/**
 * 获取上一级元素，插入 Dialog 时用到
 */
const getFatherDom = (): Element => {
  const fullScreen = document.querySelector(":not(:root):fullscreen");
  if (fullScreen) return fullScreen;
  return document.querySelector("body") as HTMLBodyElement;
};

export const closeDrawer = () => {
  const vm = document.querySelector(`#${blockClass}-${id--}`) as HTMLElement;
  vm && getFatherDom().removeChild(vm);
};

const handleConfirm = async (drawerProps: ProUseDrawerProps) => {
  if (!drawerProps.onConfirm) return closeDrawer();

  const result = await drawerProps.onConfirm(closeDrawer);
  if (result !== false) return closeDrawer();
};

const handleCancel = async (drawerProps: ProUseDrawerProps) => {
  if (!drawerProps.onCancel) return closeDrawer();

  const result = await drawerProps.onCancel(closeDrawer);
  if (result !== false) return closeDrawer();
};

/**
 * 内容渲染方式有两种
 * 方式 1：在第一个参数里写 render，即可实现 el-drawer 的内容渲染
 * 方式 2：第二个参数为组件，第三个参数为组件的 props
 *
 * 在第一个参数里写 headerRender 和 footerRender，可以自定义 el-drawer 的 header 和 footer
 */
export const showDrawer = (
  drawerProps: ProUseDrawerProps = {},
  component?: Component,
  componentsProps?: { [slotName: string]: (scope?: unknown) => unknown }
) => {
  const isFullscreen = ref(false);

  const footerStyle = computed(() => ({
    justifyContent:
      drawerProps.footerAlign === "left" ? "flex-start" : drawerProps.footerAlign === "center" ? "center" : "flex-end",
  }));

  const toggleFullscreen = () => {
    const elDrawerEl = document.querySelector(
      `${`#${blockClass}-${id}`} .${blockClass}.${ns.elNamespace}-drawer`
    ) as HTMLElement;

    if (elDrawerEl) elDrawerEl.classList.toggle("is-fullscreen");
    isFullscreen.value = !isFullscreen.value;

    drawerProps.onFullscreen?.(isFullscreen.value);
  };

  const vm = (
    <ElConfigProvider namespace={ns.elNamespace} size={layoutSize.value}>
      <ElDrawer
        modelValue
        title="抽屉"
        size="30%"
        close-on-click-modal={false}
        before-close={() => handleCancel(drawerProps)}
        {...drawerProps}
        class={blockClass}
      >
        {{
          default: () => {
            if (drawerProps.render) return drawerProps.render();
            return <component is={component} {...componentsProps}></component>;
          },
          header: (scope: unknown) => {
            if (drawerProps.headerRender) return drawerProps.headerRender(scope);
            return (
              <>
                <span class={`${ns.elNamespace}-drawer__title`}>{drawerProps.title}</span>
                {drawerProps.fullscreenIcon !== false && (
                  <Icon
                    icon={isFullscreen.value ? "core-fullscreen-exit" : "core-fullscreen"}
                    size="15px"
                    color={ns.cssVarEl("color-info")}
                    hover
                    hover-color={ns.cssVarEl("color-primary")}
                    style={{ cursor: "pointer", userSelect: "none", marginRight: "5px" }}
                    {...{ onClick: () => toggleFullscreen() }}
                  />
                )}
              </>
            );
          },
          footer: drawerProps.showFooter
            ? () => {
                if (drawerProps.footerRender) return drawerProps.footerRender(closeDrawer);
                return (
                  <div class={ns.e("footer")} style={footerStyle.value}>
                    <ElButton onClick={() => handleCancel(drawerProps)}>{drawerProps.cancelText || "取消"}</ElButton>
                    <ElButton
                      type="primary"
                      loading={drawerProps.confirmLoading}
                      onClick={() => handleConfirm(drawerProps)}
                    >
                      {drawerProps.confirmText || "确定"}
                    </ElButton>
                  </div>
                );
              }
            : undefined,
        }}
      </ElDrawer>
    </ElConfigProvider>
  );

  vm.appContext = appContextConst;
  if (isArray(vm.children) && vm.children.length) (vm.children[0] as any).appContext = appContextConst;

  const container = document.createElement("div");
  container.id = `${blockClass}-${++id}`;
  getFatherDom().appendChild(container);
  render(vm, container);

  nextTick(() => {
    if (drawerProps.fullscreen) toggleFullscreen();
  });
};

export const initDrawer = (ctx?: ComponentInternalInstance) => {
  const { appContext = null } = ctx || getCurrentInstance() || {};
  appContextConst = appContext;

  const globalConfig = inject(GlobalConfigKey);
  layoutSize = computed(() => globalConfig?.size.value ?? "default");

  return { showDrawer };
};
