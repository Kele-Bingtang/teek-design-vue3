<script setup lang="ts">
import { serviceConfig } from "@/common/config";
import { AlertScroll } from "@/components";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "PageAlertScroll" });

const settingStore = useSettingStore();

const globalAlert = serviceConfig.layout.globalAlert || {};

/**
 * 判断当前时间是否在指定范围
 */
const isDateInRange = (startDate?: string, endDate?: string): boolean => {
  if (!startDate && !endDate) return true;

  const current = new Date();
  current.setHours(0, 0, 0, 0);

  let start = startDate ? new Date(startDate) : null;
  let end = endDate ? new Date(endDate) : null;

  // 设置时间范围
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);
  else if (start) end = new Date(startDate!); // 只有开始时间时，结束时间为同一天

  // 只有结束时间时，开始时间为最早时间
  if (end && !start) start = new Date(0);
  // 如果结束时间小于开始时间，则取开始时间
  if (start && end && end < start) end = new Date(start);

  return (!start || current >= start) && (!end || current <= end);
};

const handleClose = () => {
  settingStore.$patch({ layout: { globalAlertEnabled: false } });
};
</script>

<template>
  <AlertScroll
    v-if="isDateInRange(globalAlert?.startDate, globalAlert?.endDate)"
    :text="globalAlert?.text"
    :type="globalAlert?.type"
    :closable="globalAlert?.closable"
    :show-icon="globalAlert?.showIcon"
    @close="handleClose"
    style="margin-bottom: 12px"
  />
</template>

<style lang="scss" scoped></style>
