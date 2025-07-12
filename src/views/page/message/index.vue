<script setup lang="ts" name="MessageDemo">
import { h } from "vue";
import { Check } from "@element-plus/icons-vue";
import { message, closeAllMessage } from "@/common/utils";

onMounted(() => {
  message.success("欢迎回来：message.success('欢迎回来')");
  message("欢迎回来: message('欢迎回来', { type: 'info' })", {
    type: "info",
    mode: "antd",
  });
  message({
    message: "欢迎回来：message({ message: '欢迎回来', type: 'warning'});",
    type: "warning",
  });
});
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="Message 提示" class="tk-card-minimal">
      <h4>element-plus 的消息提示，点击弹出提示信息</h4>

      <el-space wrap>
        <el-button type="info" @click="message('Info 类型消息')">Info</el-button>
        <el-button type="success" @click="message({ message: 'Success 类型消息', type: 'success' })">Success</el-button>
        <el-button type="warning" @click="message({ message: 'Warning 类型消息', type: 'warning' })">Warning</el-button>
        <el-button type="danger" @click="message({ message: 'Error 类型消息', type: 'error' })">Error</el-button>
        <el-button @click="message({ message: '可关闭消息', showClose: true })">可关闭</el-button>
        <el-button
          @click="
            message({
              message: '分组消息合并',
              type: 'success',
              grouping: true,
            })
          "
        >
          分组消息合并
        </el-button>
        <el-button
          @click="
            message({
              message: '自定义消息图标',
              icon: Check,
            })
          "
        >
          自定义图标
        </el-button>
        <el-button
          @click="
            message({
              message: '3 秒后关闭',
              duration: 3000,
              onClose: () => message({ message: '消息已关闭', type: 'success' }),
            })
          "
        >
          自定义延时关闭时间并设置关闭后其他操作
        </el-button>
        <el-button
          @click="
            message(h('p', null, [h('span', null, 'Message can be '), h('i', { style: 'color: teal' }, 'VNode')]))
          "
        >
          自定义内容
        </el-button>
        <el-button
          @click="
            message({
              message: '<strong>This is <i>HTML</i> string</strong>',
              dangerouslyUseHTMLString: true,
            })
          "
        >
          HTML 片段作为正文内容
        </el-button>
      </el-space>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <h4>
        类似 Ant Design 风格的消息提示，点击弹出提示信息（基于 ElMessage 样式改版，不会影响 ElMessage
        原本样式，使用和打包大小成本极低并适配暗黑模式），需要加上 mode: antd
      </h4>

      <el-space wrap>
        <el-button type="info" @click="message({ message: 'Info 类型消息', mode: 'antd' })">Info</el-button>
        <el-button type="success" @click="message({ message: 'Success 类型消息', mode: 'antd', type: 'success' })">
          Success
        </el-button>
        <el-button type="warning" @click="message({ message: 'Warning 类型消息', mode: 'antd', type: 'warning' })">
          Warning
        </el-button>
        <el-button type="danger" @click="message({ message: 'Error 类型消息', mode: 'antd', type: 'error' })">
          Error
        </el-button>
        <el-button @click="message({ message: '可关闭消息', mode: 'antd', showClose: true })">可关闭</el-button>
        <el-button @click="message({ message: '分组消息合并', mode: 'antd', type: 'success', grouping: true })">
          分组消息合并
        </el-button>
        <el-button
          @click="
            message({
              message: '自定义消息图标',
              mode: 'antd',
              icon: Check,
            })
          "
        >
          自定义图标
        </el-button>
        <el-button
          @click="
            message({
              message: '3 秒后关闭',
              mode: 'antd',
              duration: 3000,
              onClose: () => message({ message: '消息已关闭', mode: 'antd', type: 'success' }),
            })
          "
        >
          自定义延时关闭时间并设置关闭后其他操作
        </el-button>
        <el-button
          @click="
            message({
              message: h('p', null, [h('span', null, 'Message can be '), h('i', { style: 'color: teal' }, 'VNode')]),
              mode: 'antd',
            })
          "
        >
          自定义内容
        </el-button>
        <el-button
          @click="
            message({
              message: '<strong>This is <i>HTML</i> string</strong>',
              mode: 'antd',
              dangerouslyUseHTMLString: true,
            })
          "
        >
          HTML 片段作为正文内容
        </el-button>
      </el-space>

      <el-divider />

      <el-button @click="closeAllMessage">关闭所有消息提示</el-button>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
h4 {
  margin-bottom: 20px;
}
</style>
