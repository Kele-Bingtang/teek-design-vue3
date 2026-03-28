<!-- Update From https://github.com/Kele-Bingtang/teek-design-vue3/pull/73 -->
<script setup lang="ts">
import { computed } from "vue";
import { ElButton } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useTabNav } from "../use-tab-nav";
import ClassicTabNav from "../tab-nav-classic/index.vue";

import "./index.scss";

defineOptions({ name: "StorageTabNav" });

const ns = useNamespace("storage-tabs-nav");

const { tabNavList } = useTabNav();
const storageTabNavInstance = useTemplateRef("storageTabNavInstance");

// 计算当前激活的标签数量
const tabCount = computed(() => tabNavList.value.length);

// 计算弹出框的宽度
const popoverWidth = computed(() =>
  storageTabNavInstance.value?.offsetWidth ? storageTabNavInstance.value.offsetWidth - 30 : "85%"
);
</script>

<template>
  <div ref="storageTabNavInstance" :class="ns.b()" class="flx-align-center tab-nav">
    <el-popover trigger="click" placement="bottom-start" :popper-class="ns.b()" :width="popoverWidth">
      <template #reference>
        <el-button plain size="small">
          <span class="el-icon--right">{{ $t("_tabNav.storageBin") }}</span>
          <span :class="ns.e('count')">{{ tabCount }}</span>
          <Icon class="el-icon--right"><ArrowDown /></Icon>
        </el-button>
      </template>

      <ClassicTabNav />
    </el-popover>
  </div>
</template>
