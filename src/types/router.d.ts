import type { Component, TransitionProps, VNode } from "vue";
import type { RouteRecordRaw, RouteLocationNormalizedLoaded, RouteComponent } from "vue-router";
import type { TagProps } from "element-plus";
import type { IconifyIcon } from "@iconify/vue";
import type { PointTagProps } from "@/components";

export {};

type MetaNeedKey = "_fullPath" | "_dynamic";

declare module "vue-router" {
  // 扩展路由 Meta 类型
  interface RouteMeta extends RequiredKey<MetaProps, MetaNeedKey> {
    [key: string]: unknown;
  }
}

// 全局配置，无需引入即可使用
declare global {
  // 路由表配置类型
  type RouterConfigRaw = Omit<RouteRecordRaw, "meta" | "component" | "children"> & {
    meta?: MetaProps;
    component?: string | RouteComponent | (() => Promise<RouteComponent>);
    children?: RouterConfigRaw[];
  };

  // 路由表加工后的类型
  type RouterConfig = Omit<RouterConfigRaw, "meta" | "children"> & {
    meta: RequiredKey<MetaProps, MetaNeedKey>;
    children?: RouterConfig[];
  };

  // 路由 Meta 类型
  interface MetaProps {
    /**
     * 路由的完整路径，在编译阶段自动生成
     */
    _fullPath?: string;
    /**
     * 是否是动态路由，在编译阶段自动生成
     */
    _dynamic?: boolean;
    /**
     * 可访问该页面的权限数组，当前路由设置的权限会影响子路由
     */
    roles?: string[];
    /**
     * 路由内的按钮权限
     */
    auths?: string[];
    /**
     * 显示在侧边栏、面包屑和标签栏的文字，使用 '{{ 多语言字段 }}' 形式结合「多语言」使用，可以传入一个回调函数，参数是当前路由对象 to
     */
    title?: string | number | ((route: RouteLocationNormalizedLoaded) => string);
    /**
     * 菜单图标，该页面在左侧菜单、面包屑显示的图标
     */
    icon?: string | IconifyIcon | Component;
    /**
     * 是否允许点击面包屑，如果为 true，则该路由无法在面包屑中被点击
     *
     * @default false
     */
    notClickBread?: boolean;
    /**
     * 是否不添加到面包屑，如果为 true，则该路由将不会出现在面包屑中
     *
     * @default false
     */
    hideInBread?: boolean;
    /**
     * 是否不添加到菜单，如果为 true，则该路由不会显示在左侧菜单
     *
     * @default false
     */
    hideInMenu?: boolean;
    /**
     * 是否总是渲染为菜单，如果为 false 且某一级路由下只有一个二级路由，则左侧菜单直接显示该二级路由，如果为 true，则总会让一级菜单作为下拉菜单
     *
     * @default false
     */
    alwaysShowRoot?: boolean;
    /**
     * 是否缓存，如果为 true，该路由在切换标签后不会缓存，如果需要缓存，则「必须」设置页面组件 name 属性（class 名）和路由配置的 name 一致
     *
     * @default false
     */
    isKeepAlive?: boolean;
    /**
     * 是否固定在 tabs nav，如果为 true，则该路由按照路由表顺序依次标签固定在标签栏
     *
     * @default false
     */
    isAffix?: boolean | number;
    /**
     * 是否全屏，不渲染 Layout 布局，只渲染当前路由组件
     */
    isFull?: boolean;
    /**
     * Restful 路由搭配使用，当前路由为详情页时，需要高亮的菜单
     */
    activeMenu?: string;
    /**
     * 关闭路由前的回调，如果返回 false 则不关闭当前标签页
     */
    beforeClose?: (route: RouteLocationNormalizedLoaded) => Promise<boolean>;
    /**
     * 关闭路由前的回调，如果设置该字段，则在关闭标签页前会去 @/router/before-close.js 里寻找该字段名「对应」的方法，作为关闭前的钩子函数
     */
    beforeCloseName?: string;
    /**
     * 路由在左侧菜单的排序，rank 值越高越靠后，当 rank 不存在时，根据顺序自动创建，首页路由永远在第一位，当 rank 存在时，可以插入指定的菜单位置
     */
    rank?: number;
    /**
     * IFrame 链接，填写后该路由将打开 IFrame 指定的链接
     */
    iframeSrc?: string;
    /**
     * IFrame 页是否开启首次加载动画
     *
     * @default true
     */
    iframeLoading?: boolean;
    /**
     * IFrame 页是否开启缓（默认 false）
     *
     * @default false
     */
    iframeKeepAlive?: boolean;
    /**
     * IFrame 页是否开新标签栏打开（默认 false）
     *
     * @default false
     */
    iframeOpen?: boolean;
    /**
     * 页面加载动画，即 Transition 组件的 Props（有两种形式，一种直接采用 vue 内置的 transitions 动画，另一种是使用 animate.css 写进、离场动画）
     */
    transitionProps?: TransitionProps;
    /**
     * 是否不添加到标签栏
     *
     * @default false
     */
    hideInTab?: boolean;
    /**
     * 动态路由可打开的最大数量
     */
    dynamicLevel?: number;
    /**
     * 是否开启 i18n，默认读取全局的 routeUseI18n（src/config/base-config.ts）
     */
    useI18n?: boolean;
    /**
     * 菜单的文字超出后，是否使用 el-toolTip 提示，默认读取全局的 routeUseTooltip（src/config/base-config.ts）
     */
    useTooltip?: boolean;
    /**
     * 自定义 Render 菜单元素（TSX 语法）
     */
    render?: () => string | VNode | Component;
    /**
     * 菜单标签，使用 ElTag 组件
     */
    tagText?: string;
    /**
     * 菜单标签的属性，即 ElTag 组件的 props
     */
    tagProps?: Partial<TagProps>;
    /**
     * 是否显示点标记
     *
     * @default false
     */
    pointTag?: boolean;
    /**
     * 点标记的属性，即 PointTag 组件的 props
     */
    pointTagProps?: PointTagProps;
  }
}
