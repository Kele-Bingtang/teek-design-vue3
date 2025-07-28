<script setup lang="ts">
import { OpenSearchDialogKey } from "@/common/config";
import { mittBus } from "@/common/utils";
import { useNamespace } from "@/composables";

import "./input.scss";

defineOptions({ name: "GlobalSearchInput" });

const ns = useNamespace("global-search-input");

const isWindows = navigator.userAgent.includes("Windows");

const openSearchDialog = () => {
  mittBus.emit(OpenSearchDialogKey);
};
</script>

<template>
  <div :class="ns.b()" class="customize">
    <div :class="ns.e('input')" @click="openSearchDialog">
      <div :class="ns.e('content')" class="flx-align-center">
        <Icon icon="core-search" :size="17" />
        <span>{{ $t("_headerBar.search") }}</span>
      </div>

      <div :class="ns.e('keydown')">
        <span v-if="isWindows">Crtl</span>
        <Icon v-else icon="core-command" :size="13"></Icon>
        <span>K</span>
      </div>
    </div>
  </div>
</template>
