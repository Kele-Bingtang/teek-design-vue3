<script setup lang="tsx" name="UseDrawerDemo">
import { ref } from "vue";
import { useDrawer, ProDrawer } from "@/components";

const visible = ref(false);

const { open } = useDrawer();

const openDrawer = () => {
  open({
    title: "ProDrawer 弹框",
    render: () => <el-button onClick={() => againOpenDrawer()}>使用函数打开 Drawer</el-button>,
  });
};

const againOpenDrawer = () => {
  open({
    title: "ProDrawer 弹框",
    size: "60%",
    render: () => <div>我被函数再次打开</div>,
  });
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="ProDrawer 组件" class="tk-card-minimal">
      <el-button @click="openDrawer()">函数式打开 Drawer</el-button>

      <el-button @Click="visible = true">组件式打开 Drawer 组件</el-button>

      <ProDrawer v-model="visible">我是通过 modelValue 打开的 Drawer 组件</ProDrawer>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="ProDrawer 函数配置项 📚" :column="1" border>
        <el-descriptions-item label="open">
          打开 Drawer 的函数，需要传入参数，详情请看「open 函数配置项 」
        </el-descriptions-item>
        <el-descriptions-item label="close">关闭 Drawer 函数</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="open 函数配置项 📚" :column="1" border style="margin-top: 10px">
        <el-descriptions-item label="drawerProps">
          基于 ElDrawer 的配置项进行扩展，详见下面「drawerProps 配置」
        </el-descriptions-item>
        <el-descriptions-item label="component">
          如果第一个参数 drawerProps 不传入 render，则该参数需要手动传入组件。`Component` 类型
        </el-descriptions-item>
        <el-descriptions-item label="componentsProps">
          组件的 props，将会透传给第二个参数的组件。对象类型
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="drawerProps 独有配置 📚" :column="1" border style="margin-top: 10px">
        <el-descriptions-item label="render">内容区渲染 TSX。`() => VNode` 类型，默认 undefined</el-descriptions-item>
        <el-descriptions-item label="renderHeader">
          头部渲染 TSX，`(scope: any) => VNode` 类型，默认 undefined
        </el-descriptions-item>
        <el-descriptions-item label="renderFooterBefore">
          底部渲染 TSX。`(scope: DrawerRenderParams) => VNode` 类型，默认 undefined
        </el-descriptions-item>
        <el-descriptions-item label="renderFooter">
          底部渲染 TSX。`(scope: DrawerRenderParams) => VNode` 类型，默认 undefined
        </el-descriptions-item>
        <el-descriptions-item label="renderFooterAfter">
          底部渲染 TSX。`(scope: DrawerRenderParams) => VNode` 类型，默认 undefined
        </el-descriptions-item>
        <el-descriptions-item label="onConfirm">
          点击确认按钮回调。`(closeDrawer: () => void) => void` 类型，默认 undefined。其中 closeDrawer
          为函数，触发后关闭 Drawer
        </el-descriptions-item>
        <el-descriptions-item label="onClose">
          点击关闭按钮回调。`(closeDrawer: () => void) => void` 类型，默认 undefined。其中 closeDrawer
          为函数，触发后关闭 Drawer
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="ProDrawer 组件 && drawerProps 配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model">是否显示 Drawer。`boolean` 类型，必穿</el-descriptions-item>
        <el-descriptions-item label="title">Drawer 标题。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="fullscreen">
          是否以全屏进入 Drawer。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="fullscreenIcon">
          是否渲染全屏图标。`boolean` 类型，默认 `true`
        </el-descriptions-item>
        <el-descriptions-item label="showFooter">是否渲染底部。`boolean` 类型，默认 `true`</el-descriptions-item>
        <el-descriptions-item label="confirmLoading">
          确认按钮 loading。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="confirmLabel">确认按钮文字。`string` 类型，默认 确认</el-descriptions-item>
        <el-descriptions-item label="cancelLabel">关闭按钮文字。`string` 类型，默认 关闭</el-descriptions-item>
        <el-descriptions-item label="...">`el-drawer` 更多配置项</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="ProDrawer 组件插槽 📚" :column="1" border>
        <el-descriptions-item label="cancel">取消按钮点击事件。`function`</el-descriptions-item>
        <el-descriptions-item label="confirm">确认按钮点击事件。`function`</el-descriptions-item>
        <el-descriptions-item label="fullscreen">全屏切换事件。`function`</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="ProDrawer 组件插槽 📚" :column="1" border>
        <el-descriptions-item label="header">自定义头部</el-descriptions-item>
        <el-descriptions-item label="header-title">自定义头部标题</el-descriptions-item>
        <el-descriptions-item label="fullscreen-icon">全屏切换事件</el-descriptions-item>
        <el-descriptions-item label="footer-before">自定义底部前</el-descriptions-item>
        <el-descriptions-item label="footer">自定义底部</el-descriptions-item>
        <el-descriptions-item label="footer-after">自定义底部后</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
