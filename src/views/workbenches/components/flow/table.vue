<script setup lang="ts">
import type { FlowType } from "./index.vue";
import { ProTable } from "@/components";
import { myAgentData } from "./data/my-agent";
import { myApplyData } from "./data/my-apply";
import { myDoneData } from "./data/my-done";
import { myFollowData } from "./data/my-follow";

defineOptions({ name: "FlowTable" });

const props = defineProps<{
  type?: FlowType;
}>();

const data = ref<Recordable[]>([]);

watch(
  () => props.type,
  val => {
    if (val === "myAgent") data.value = myAgentData;
    else if (val === "myApply") data.value = myApplyData;
    else if (val === "myDone") data.value = myDoneData;
    else if (val === "myFollow") data.value = myFollowData;
    else data.value = [];
  },
  { immediate: true }
);

const columns = [
  { type: "index", label: "序号", width: 60 },
  { prop: "title", label: "任务标题" },
  { prop: "system", label: "所属系统", width: 160 },
  { prop: "status", label: "任务状态", width: 160 },
  { prop: "creator", label: "创建人/提出人", width: 160 },
  { prop: "createTime", label: "创建时间", width: 160 },
  { prop: "deadline", label: "任务期限", width: 160 },
];
</script>

<template>
  <ProTable :columns :data card page-scope :page-info="{ pageSize: 10 }" />
</template>
