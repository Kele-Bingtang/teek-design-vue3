<script setup lang="ts">
import type { PageColumn } from "@/components";
import { ProPage } from "@/components";
import { ElMessage } from "element-plus";

defineProps<{ userId: string }>();

const getTableData = (searchParams: Recordable) => {
  Object.keys(searchParams).length && ElMessage.primary("查询参数：" + JSON.stringify(searchParams));

  // 模拟数据生成
  const data = [];
  for (let i = 1; i <= 30; i++) {
    const item: Recordable = {
      groupName: `用户组${i}`,
      groupId: `Group_${i.toString().padStart(3, "0")}`,
      groupType: i % 2 === 0 ? 1 : 2,
      validFrom: `2023-${String((i % 12) + 1).padStart(2, "0")}-01`,
      expireOn: `2024-${String((i % 12) + 1).padStart(2, "0")}-01`,
      ownerId: `Owner_${i.toString().padStart(3, "0")}`,
      ownerName: `负责人${i}`,
      status: i % 3 === 0 ? "0" : "1",
    };
    data.push(item);
  }

  return Promise.resolve({
    code: 200,
    data,
    message: "success",
    timestamp: Date.now(),
  });
};

// 表格列配置项
const columns: PageColumn[] = [
  { type: "selection", width: 60 },
  { type: "index", label: "序号", width: 60 },
  { prop: "groupName", label: "群组名", minWidth: 120, search: { el: "el-input" } },
  { prop: "groupId", label: "群组编码", minWidth: 120, search: { el: "el-input" } },
  {
    prop: "groupType",
    label: "群组类型",
    el: "el-tag",
    width: 100,
    search: { el: "el-select" },
    options: [
      { value: 1, label: "公有", tagType: "success" },
      { value: 2, label: "私有", tagType: "primary" },
    ],
  },
  { prop: "validFrom", label: "生效时间", minWidth: 120 },
  { prop: "expireOn", label: "过期时间", minWidth: 120 },
  {
    prop: "ownerId",
    label: "负责人",
    minWidth: 160,
    formatValue: (_, { row }) => `${row.ownerName} ${row.ownerId}`,
  },
  {
    prop: "status",
    label: "状态",
    el: "point-tag",
    options: () => [
      { value: "1", label: "启用", tagType: "success" },
      { value: "0", label: "禁用", tagType: "info" },
    ],
    search: { el: "el-select" },
  },
];
</script>

<template>
  <ProPage
    :title="`我是一个单独的页面，我的用户 ID 是 ${userId}`"
    :request-api="getTableData"
    :columns
    row-key="groupId"
  ></ProPage>
</template>
