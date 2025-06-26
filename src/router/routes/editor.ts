import { Edit, StarFilled } from "@element-plus/icons-vue";

const editorRoutes: RouterConfigRaw = {
  path: "/editor",
  name: "EditorComponents",
  meta: {
    title: "编辑器组件",
    icon: Edit,
  },
  children: [
    {
      path: "tinymce",
      name: "Tinymce",
      component: () => import("@/views/editor/tinymce/index.vue"),
      meta: { title: "Tinymce 富文本", icon: StarFilled },
    },
    {
      path: "wang-editor",
      name: "WangEditor",
      component: () => import("@/views/editor/wang-editor/index.vue"),
      meta: { title: "Wang 富文本", icon: StarFilled },
    },
    {
      path: "code-mirror",
      name: "CodeMirror",
      component: () => import("@/views/editor/code-mirror/index.vue"),
      meta: { title: "代码编辑器", icon: StarFilled },
    },
    {
      path: "code-diff-editor",
      name: "CodeDiffEditor",
      component: () => import("@/views/editor/code-diff-editor/index.vue"),
      meta: { title: "代码对比器", icon: StarFilled },
    },
  ],
};

export default editorRoutes;
