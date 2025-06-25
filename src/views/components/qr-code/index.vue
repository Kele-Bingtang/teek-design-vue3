<script setup lang="ts" name="QrCodeDemo">
import { ref } from "vue";
import { message } from "@/common/utils";
import { QrCode } from "@/components";

const qrCodeText = "teek-design-vue3";

const asyncTitle = ref("");
setTimeout(() => {
  asyncTitle.value = qrCodeText;
}, 3000);
const codeClick = () => {
  message("点击事件", { type: "info" });
};
const disabledClick = () => {
  message("失效", { type: "info" });
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div>
          <el-link href="https://github.com/soldair/node-qrcode" target="_blank" style="font-size: 20px">
            qrcode 二维码
          </el-link>
        </div>
      </template>
      <el-row :gutter="20" justify="space-between">
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>基础用法</div>
            <QrCode :text="qrCodeText" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>img标签</div>
            <QrCode :text="qrCodeText" tag="img" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>样式配置</div>
            <QrCode
              :text="qrCodeText"
              :options="{
                color: {
                  dark: '#55D187',
                  light: '#2d8cf0',
                },
              }"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>点击事件</div>
            <QrCode :text="qrCodeText" @click="codeClick" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>异步内容</div>
            <QrCode :text="asyncTitle" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>失效</div>
            <QrCode :text="qrCodeText" disabled @disabled-click="disabledClick" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>logo配置</div>
            <QrCode :text="qrCodeText" logo="https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>logo样式</div>
            <QrCode
              :text="qrCodeText"
              :logo="{
                src: 'https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png',
                logoSize: 0.2,
                borderSize: 0.05,
                borderRadius: 50,
                bgColor: 'blue',
              }"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="text-center">
            <div>大小配置</div>
            <QrCode :text="qrCodeText" :width="100" />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
