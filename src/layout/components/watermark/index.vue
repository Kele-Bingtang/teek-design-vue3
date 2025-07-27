<script setup lang="ts">
import { serviceConfig } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

import "./index.scss";

defineOptions({ name: "Watermark" });

const ns = useNamespace("watermark");
const settingStore = useSettingStore();

const { layout } = storeToRefs(settingStore);

const watermark = serviceConfig.layout.name;
</script>

<template>
  <div v-if="layout.watermark" :class="ns.b()">
    <el-watermark :content="watermark">
      <div style="height: 100vh"></div>
    </el-watermark>
  </div>
</template>
