<script setup lang="ts">
import { HOME_NAME } from "@/common/config";

const toPage = () => {
  // 向父窗口发送消息，请求打开已注册的路由
  window.parent.postMessage(
    {
      action: "open",
      name: HOME_NAME,
    },
    "*"
  );
};

const openNewIFramePage = () => {
  // 向父窗口发送消息，请求打开新的iframe页面
  window.parent.postMessage(
    {
      action: "add",
      routes: [
        {
          path: "/wait-register",
          name: "WaitRegister",
          component: "/iframe/wait-register",
          meta: {
            title: "IFrame 新增页面",
            useI18n: false,
          },
        },
      ],
    },
    "*"
  );
};

const closePage = () => {
  // 向父窗口发送消息，请求关闭当前页面
  window.parent.postMessage(
    {
      action: "close",
      name: "WaitRegister", // 如果是数组则支持关闭多个页面
    },
    "*"
  );
};

const refreshPage = () => {
  // 向父窗口发送消息，请求刷新当前页面
  window.parent.postMessage(
    {
      action: "refresh",
      name: "IFramePage",
    },
    "*"
  );
};
</script>

<template>
  <el-space fill>
    <el-card header="嵌入页面与主应用通信">
      <p>这是一个被嵌入的页面，可以通过 postMessage 与主应用通信，当前通信规则支持打开、新增、关闭、刷新路由</p>
      <p class="no-space">
        通信逻辑文件路径位于
        <span style="font-weight: 600; color: var(--tk-color-primary)">src/layout/components/iframe/use-iframe.ts</span>
        ，你可以在该文件里新增更多的通信规则
      </p>
    </el-card>

    <el-card header="打开路由">
      <p>点击按钮通知主应用打开已注册的路由</p>
      <el-button type="primary" @click="toPage">打开工作台页面</el-button>
    </el-card>

    <el-card header="新增并打开路由">
      <p>点击按钮通知主应用新增并打开一个路由</p>
      <el-button type="success" @click="openNewIFramePage">新增打开新的路由</el-button>
    </el-card>

    <el-card header="关闭路由（支持多个）">
      <p>
        点击按钮通知主应用关闭一个路由（这里模拟关闭的是上方「新增的路由」，因此使用该功能前，请先点击上方的「新增打开新的路由」按钮）
      </p>
      <el-button type="success" @click="closePage">关闭 IFrame 新增页面</el-button>
    </el-card>

    <el-card header="刷新路由">
      <p>点击按钮通知主应用刷新当前嵌入的页面</p>
      <el-button type="warning" @click="refreshPage">刷新当前页面</el-button>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
p:not(.no-space) {
  margin-bottom: 16px;
}
</style>
