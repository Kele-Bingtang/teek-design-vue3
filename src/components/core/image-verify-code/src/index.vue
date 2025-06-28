<script setup lang="ts">
import { watch } from "vue";
import { useImageVerify } from "./use-image-verify";

defineOptions({ name: "ImageVerifyCode" });

const { domInstance, imgCode, setImgCode, getImgCode } = useImageVerify();

const code = defineModel<string>({ required: true });

watch(code, newValue => {
  setImgCode(newValue);
});

watch(imgCode, newValue => {
  code.value = newValue;
});

defineExpose({ getImgCode });
</script>

<template>
  <canvas ref="domInstance" width="120" height="40" class="cursor-pointer" @click="getImgCode" />
</template>
