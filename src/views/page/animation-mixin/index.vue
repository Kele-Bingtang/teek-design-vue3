<script setup lang="ts" name="AnimationMixin">
import { MaterialInput, TextHoverEffect } from "@/components";
import Button from "./button.vue";
import { Search } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

const ns = useNamespace("animation-mixin");

const demo = reactive({
  title: "",
});
const validateLength = (rule: any, value: string, callback: (e?: Error) => void) => {
  if (value.length !== 6) {
    callback(new Error("请输入六个字符"));
  } else {
    callback();
  }
};

const demoRules = {
  title: [{ validator: validateLength, trigger: "change" }],
};
</script>

<template>
  <div :class="ns.b()">
    <el-card class="box-card">
      <template #header>
        <span>按钮</span>
      </template>
      <el-row>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center mixin-col">
          <button class="animation-btn blue-btn">Documentation</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn light-blue-btn">Icons</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn pink-btn">Excel</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn green-btn">Table</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn tiffany-btn">Form</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn yellow-btn">Theme</button>
        </el-col>
      </el-row>
      <el-row>
        <Button />
      </el-row>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>Material Design 的 input</span>
          </template>
          <div style="height: 100px">
            <el-form :model="demo" :rules="demoRules">
              <el-form-item prop="title">
                <MaterialInput v-model="demo.title" :icon="Search" name="title" placeholder="输入标题">
                  标题
                </MaterialInput>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>水波纹 waves</span>
          </template>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
            <el-button v-waves type="success">水波纹效果</el-button>
            <el-button v-waves type="warning">水波纹效果</el-button>
            <el-button v-waves type="danger" style="margin-top: 10px">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>悬停文本</span>
          </template>
          <div class="component-item">
            <TextHoverEffect
              init-color="#4dd9d5"
              :hover-color="`var(--${ns.elNamespace}-color-primary)`"
              text="Teek Design Pro"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

$blue: #007bff;
$light-blue: #409eff;
$red: #e65d6e;
$pink: #ff4081;
$green: #43a047;
$tiffany: #00c9b7;
$yellow: #ffb350;

@mixin color-btn($color) {
  background: $color;

  &:hover {
    color: $color;

    &::before,
    &::after {
      background: $color;
    }
  }
}

@include b(animation-mixin) {
  height: 100%;

  .mixin-col {
    margin-bottom: 15px;
  }

  .blue-btn {
    @include color-btn($blue);
  }

  .light-blue-btn {
    @include color-btn($light-blue);
  }

  .red-btn {
    @include color-btn($red);
  }

  .pink-btn {
    @include color-btn($pink);
  }

  .green-btn {
    @include color-btn($green);
  }

  .tiffany-btn {
    @include color-btn($tiffany);
  }

  .yellow-btn {
    @include color-btn($yellow);
  }

  .animation-btn {
    position: relative;
    display: inline-block;
    padding: 14px 36px;
    font-size: 14px;
    color: #ffffff;
    outline: none;
    border: none;
    border-radius: 8px;
    transition: 600ms ease all;

    &:hover {
      background: #ffffff;

      &::before,
      &::after {
        width: 100%;
        transition: 600ms ease all;
      }
    }

    &::before,
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 2px;
      content: "";
      transition: 400ms ease all;
    }

    &::after {
      top: inherit;
      right: inherit;
      bottom: 0;
      left: 0;
    }
  }

  .component-item {
    min-height: 100px;
  }
}
</style>
