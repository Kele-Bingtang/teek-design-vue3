<script setup lang="ts">
import type { TableColumn } from "@/components/pro/table";
import { toValue } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { ProTable } from "@/components/pro/table";
import { useNamespace } from "@/composables";

const ns = useNamespace();

// 压测配置
const config = reactive({
  dataLength: 1000,
  columnsLength: 20,
});

// 压测结果
const testResult = reactive({
  proTableTime: 0,
  elTableTime: 0,
});

// 加载状态
const loading = reactive({
  proTable: false,
  elTable: false,
});

const data = ref<Recordable[]>([]);
const columns = ref<TableColumn[]>([]);
const proTableData = ref<Recordable[]>([]);
const elTableData = ref<Recordable[]>([]);

const proTablePageScope = ref(false);
const tableType = ref<"proTable" | "elTable">("proTable");

// 使用函数生成数据，避免阻塞主线程
const generateData = () => {
  const startTime = performance.now();

  const newData: Recordable[] = [];
  for (let i = 0; i < config.dataLength; i++) {
    const row: Recordable = {
      id: i + 1,
    };

    for (let j = 0; j < config.columnsLength; j++) {
      row[`field${j}`] = `数据${i}-${j}`;
    }
    newData.push(row);
  }
  data.value = newData;

  return performance.now() - startTime;
};

// 为每个表格生成独立的数据副本
const generateTableData = () => {
  if (tableType.value === "proTable") proTableData.value = JSON.parse(JSON.stringify(data.value));
  else if (tableType.value === "elTable") elTableData.value = JSON.parse(JSON.stringify(data.value));
};

// 列生成
const generateColumns = () => {
  const newColumns: TableColumn[] = Array.from({ length: config.columnsLength }, (_, index) => ({
    prop: `field${index}`,
    label: `字段${index}`,
    width: 100,
  }));

  newColumns.unshift({
    type: "index",
    width: 60,
    label: "#",
  });

  columns.value = newColumns;
};

// 等待表格渲染完成
const waitForTableRender = (selector: string): Promise<void> => {
  return new Promise(resolve => {
    const checkRender = () => {
      const tableElement = document.querySelector(selector);
      if (tableElement && tableElement.querySelectorAll("table")) {
        // 使用 requestAnimationFrame 确保渲染完全完成
        requestAnimationFrame(() => {
          resolve();
        });
      } else {
        requestAnimationFrame(checkRender);
      }
    };
    checkRender();
  });
};

// 开始压测
const startTest = async () => {
  data.value = [];
  columns.value = [];
  proTableData.value = [];
  elTableData.value = [];

  // 显示加载状态
  if (tableType.value === "proTable") loading.proTable = true;
  else if (tableType.value === "elTable") loading.elTable = true;

  // 重置结果
  if (tableType.value === "proTable") testResult.proTableTime = 0;
  else if (tableType.value === "elTable") testResult.elTableTime = 0;

  setTimeout(async () => {
    // 计时
    const startTime = performance.now();

    // 生成数据和列
    generateColumns();
    const dataGenTime = generateData();
    generateTableData();

    // 等待 DOM 更新
    await nextTick();

    // 测试 ProTable 渲染时间
    if (tableType.value === "proTable") {
      waitForTableRender(".pro-table-class")
        .then(() => {
          testResult.proTableTime = performance.now() - startTime + dataGenTime;
          loading.proTable = false;
        })
        .catch(() => {
          // fallback
          testResult.proTableTime = performance.now() - startTime + dataGenTime;
          loading.proTable = false;
        });
    }

    // 测试 ElTable 渲染时间
    else if (tableType.value === "elTable") {
      waitForTableRender(`.${ns.elNamespace}-table`)
        .then(() => {
          testResult.elTableTime = performance.now() - startTime + dataGenTime;
          loading.elTable = false;
        })
        .catch(() => {
          // fallback
          testResult.elTableTime = performance.now() - startTime + dataGenTime;
          loading.elTable = false;
        });
    }
  }, 300);
};
</script>

<template>
  <el-space fill>
    <!-- 配置区域 -->
    <el-card shadow="never" header="压测配置" class="tk-card-minimal">
      <div class="flx-align-center gap-20">
        <div class="flx-center gap-10">
          <span>数据行数</span>
          <el-input-number v-model="config.dataLength" :min="1" :max="10000" style="width: 120px" />
        </div>

        <div class="flx-center gap-10">
          <span>列数</span>
          <el-input-number v-model="config.columnsLength" :min="1" :max="500" style="width: 120px" />
        </div>

        <div class="flx-center gap-10">
          <span>测试组件</span>
          <div>
            <el-radio-group v-model="tableType">
              <el-radio-button label="ProTable" value="proTable" />
              <el-radio-button label="ElTable" value="elTable" />
            </el-radio-group>
          </div>
        </div>

        <el-checkbox v-model="proTablePageScope" label="超级组件使用分页提高渲染速度" />

        <el-button type="primary" @click="startTest">开始压测</el-button>
      </div>
    </el-card>

    <!-- 结果展示 -->
    <el-card shadow="never" header="压测结果" class="tk-card-minimal">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>ProTable 渲染时间: {{ testResult.proTableTime.toFixed(2) }} ms</div>
        </el-col>
        <el-col :span="8">
          <div>ElTable 渲染时间: {{ testResult.elTableTime.toFixed(2) }} ms</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格展示区域 -->
    <el-card shadow="never" header="表格展示" class="tk-card-minimal">
      <!-- ProTable -->
      <ProTable
        v-if="tableType === 'proTable'"
        :columns="columns"
        :data="proTableData"
        v-loading="loading.proTable"
        title="ProTable"
        :page-scope="proTablePageScope"
        border
        height="calc(100vh - 136px - 121px - 58px - 20px - 34px - 170px)"
        class="pro-table-class"
      />

      <!-- ElTable -->
      <div v-else-if="tableType === 'elTable'">
        <h4 style="margin-bottom: 11px">ElTable</h4>
        <el-table
          :data="elTableData"
          v-loading="loading.elTable"
          border
          height="calc(100vh - 136px - 121px - 58px - 20px - 34px - 170px)"
        >
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :prop="column.prop"
            :type="column.type"
            :label="toValue(column.label)"
            :width="toValue(column.width)"
          />
        </el-table>
      </div>
    </el-card>
  </el-space>
</template>
