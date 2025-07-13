<script setup lang="ts">
import type { TableColumnProps } from "../interface";
import { inject } from "vue";
import { ElDrawer, ElSwitch, ElTable, ElTableColumn } from "element-plus";
import { proTablePrefixClassKey } from "../interface";

defineOptions({ name: "ColSetting" });

const prefixClass = inject(proTablePrefixClassKey);

defineProps<{ colSetting: TableColumnProps[] }>();

const drawerVisible = defineModel({ default: false });

const openColSetting = () => {
  drawerVisible.value = true;
};

defineExpose({
  openColSetting,
});
</script>

<template>
  <!-- 列设置 -->
  <el-drawer v-model="drawerVisible" title="列设置" size="450px">
    <div :class="`${prefixClass}__main`">
      <el-table
        :data="colSetting"
        :border="true"
        row-key="prop"
        default-expand-all
        :tree-props="{ children: '_children' }"
      >
        <el-table-column prop="label" align="center" label="列名" />
        <el-table-column v-slot="{ row }" prop="isShow" align="center" label="显示">
          <el-switch v-model="row.isShow"></el-switch>
        </el-table-column>
        <el-table-column v-slot="{ row }" prop="sortable" align="center" label="排序">
          <el-switch v-model="row.sortable"></el-switch>
        </el-table-column>
        <el-table-column v-slot="{ row }" prop="sortable" align="center" label="筛选">
          <el-switch v-model="row.filterConfig.enabled"></el-switch>
        </el-table-column>
        <template #empty>
          <div :class="`${prefixClass}__empty`">
            <img src="@/common/assets/images/notData.png" alt="notData" />
            <div>暂无可配置列</div>
          </div>
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>
