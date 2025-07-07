<script setup lang="ts">
import { ElButton, ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { read, utils } from "xlsx";
import { useNamespace } from "@/composables";
import type { UploadExcelProps } from "./types";

defineOptions({ name: "UploadExcel" });

const ns = useNamespace("excel-upload");

const props = withDefaults(defineProps<UploadExcelProps>(), {
  drag: false,
});

const loading = ref(false);
const excelData = reactive({
  header: [],
  results: null,
});

const excelUploadInputInstance = useTemplateRef("excelUploadInputInstance");

/**
 * 拖拽事件
 * @param e 事件
 */
const handleDrop = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (loading.value) return;
  if (!e.dataTransfer) return;
  const files = e.dataTransfer.files;
  if (files.length !== 1) {
    ElMessage.error("只支持加载一个文件!");
    return;
  }
  const rawFile = files[0];

  if (!isExcel(rawFile)) {
    ElMessage.error("只支持 .xlsx, .xls, .csv 结尾的文件");
    return false;
  }

  upload(rawFile);

  e.stopPropagation();
  e.preventDefault();
};

/**
 * 拖拽事件
 * @param e 事件
 */
const handleDragover = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
};

/**
 * 点击按钮事件
 */
const handleUpload = () => {
  excelUploadInputInstance.value?.click();
};

/**
 * 上传文件确认事件
 */
const handleUploadChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    const rawFile = files[0];
    upload(rawFile);
  }
};

/**
 * 上传 Excel 文件
 * @param rawFile 文件
 */
const upload = (rawFile: File) => {
  if (excelUploadInputInstance.value) excelUploadInputInstance.value.value = ""; // 上传新的 excel 前，清空当前表格的数据，如果追加数据，则可以去掉
  if (!props.beforeUpload) {
    readerData(rawFile);
    return;
  }
  const before = props.beforeUpload(rawFile);
  if (before) readerData(rawFile);
};

/**
 * 生成数据
 * @param header 表头
 * @param results 数据
 */
const generateData = (header: any, results: any) => {
  excelData.header = header;
  excelData.results = results;
  props.onSuccess && props.onSuccess(excelData);
};

/**
 * 读取 Excel 数据
 */
const readerData = (rawFile: File) => {
  loading.value = true;
  const reader = new FileReader();
  reader.onload = e => {
    const data = (e.target as FileReader).result;
    const workbook = read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const header = getHeaderRow(worksheet);
    const results = utils.sheet_to_json(worksheet);
    generateData(header, results);
    loading.value = false;
  };
  reader.readAsArrayBuffer(rawFile);
};

/**
 * 获取 Excel 表头
 * @param sheet 表
 * @returns 表头
 */
const getHeaderRow = (sheet: Recordable) => {
  const headers: string[] = [];
  const range = utils.decode_range(sheet["!ref"]);
  const R = range.s.r;
  // 从第一行开始
  for (let C = range.s.c; C <= range.e.c; ++C) {
    // 遍历范围内的每一列
    const cell = sheet[utils.encode_cell({ c: C, r: R })];
    // 查找第一行中的单元格
    let hdr = "";
    if (cell && cell.t) hdr = utils.format_cell(cell);
    if (hdr === "") {
      hdr = "UNKNOWN " + C; // 替换为所需的默认值
    }
    headers.push(hdr);
  }
  return headers;
};

/**
 * 判断是否为 Excel 文件
 * @param file 文件
 * @returns 是否为 Excel 文件
 */
const isExcel = (file: File) => {
  return /\.(xlsx|xls|csv)$/.test(file.name);
};
</script>

<template>
  <div :class="ns.b()">
    <input
      ref="excelUploadInputInstance"
      :class="ns.e('input')"
      type="file"
      accept=".xlsx, .xls"
      @change="handleUploadChange"
    />
    <div v-if="drag" :class="ns.e('drop')" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      拖拽 Excel 文件到此处
      <el-button :loading="loading" style="margin-left: 16px" type="primary" @click="handleUpload">预览</el-button>
    </div>

    <el-button v-else :loading="loading" style="margin-left: 16px" type="primary" @click="handleUpload">
      导入 Excel
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(excel-upload) {
  @include e(input) {
    z-index: -9999;
    display: none;
  }

  @include e(drop) {
    position: relative;
    width: 600px;
    height: 160px;
    margin: 0 auto;
    font-size: 24px;
    line-height: 160px;
    color: #bbbbbb;
    text-align: center;
    border: 2px dashed #bbbbbb;
    border-radius: 5px;
  }
}
</style>
