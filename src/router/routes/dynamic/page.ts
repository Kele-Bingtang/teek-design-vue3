import { CreditCard, Star } from "@element-plus/icons-vue";

const pageRoutes: RouterConfigRaw = {
  path: "/page",
  name: "Page",
  meta: {
    title: "页面组件",
    icon: CreditCard,
  },
  children: [
    {
      path: "message",
      name: "MessageDemo",
      component: () => import("@/views/page/message/index.vue"),
      meta: { title: () => "消息组件", icon: Star },
    },
    {
      path: "icon",
      name: "IconDemo",
      component: () => import("@/views/page/icon/index.vue"),
      meta: { title: "图标选择", icon: Star },
    },
    {
      path: "highlight",
      name: "HighlightDemo",
      component: () => import("@/views/page/highlight/index.vue"),
      meta: { title: "文字高亮", icon: Star },
    },
    {
      path: "video-player",
      name: "VideoPlayerDemo",
      component: () => import("@/views/page/video-player/index.vue"),
      meta: { title: "视频播放器", icon: Star },
    },
    {
      path: "seamless-scroll",
      name: "SeamlessScrollDemo",
      component: () => import("@/views/page/seamless-scroll/index.vue"),
      meta: { title: "无限滚动", icon: Star },
    },
    {
      path: "count-to",
      name: "CountToDemo",
      component: () => import("@/views/page/count-to/index.vue"),
      meta: { title: "数字渐变", icon: Star },
    },
    {
      path: "images-clipper",
      name: "ClipperDemo",
      component: () => import("@/views/page/cropper/index.vue"),
      meta: { title: "图片裁剪", icon: Star },
    },
    {
      path: "drag-drawer",
      name: "DragDrawerDemo",
      component: () => import("@/views/page/drag-drawer/index.vue"),
      meta: { title: "抽屉拖拽", icon: Star },
    },
    {
      path: "org-tree",
      name: "OrgTreeDemo",
      component: () => import("@/views/page/org-tree/index.vue"),
      meta: { title: "组织结构树", icon: Star },
    },
    {
      path: "animation-mixin",
      name: "AnimationMixinDemo",
      component: () => import("@/views/page/animation-mixin/index.vue"),
      meta: { title: "动画混入", icon: Star },
    },
    {
      path: "draggable-list",
      name: "DraggableListDemo",
      component: () => import("@/views/page/draggable-list/index.vue"),
      meta: { title: "列表拖拽", icon: Star },
    },
    {
      path: "draggable-item",
      name: "DraggableItemDemo",
      component: () => import("@/views/page/draggable-item/index.vue"),
      meta: { title: "面板拖拽", icon: Star },
    },
    {
      path: "upload-images",
      name: "UploadImagesDemo",
      component: () => import("@/views/page/upload-images/index.vue"),
      meta: { title: "图片上传", icon: Star },
    },
    {
      path: "qrCode-demo",
      name: "QrCodeDemo",
      component: () => import("@/views/page/qr-code/index.vue"),
      meta: { title: "二维码", icon: Star },
    },
    {
      path: "alert-scroll",
      name: "AlertScroll",
      component: () => import("@/views/page/alert-scroll/index.vue"),
      meta: { title: "滚动提示", icon: Star, tagText: "New", tagProps: { type: "danger" } },
    },
  ],
};

export default pageRoutes;
