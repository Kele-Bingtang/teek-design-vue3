<script setup lang="ts" name="PdfPreview">
import { ref, useTemplateRef } from "vue";
import { Refresh, Printer } from "@element-plus/icons-vue";
import VuePdfEmbed from "vue-pdf-embed";

const pdfRef = useTemplateRef<any>("pdfRef");
const pageCount = ref(1);
const loading = ref(true);
const currentPage = ref<number>(1);
const currentRotation = ref(0);
const showAllPages = ref(false);
const rotations = [0, 90, 180, 270];

const source = "https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/index/Nginx_day01.pdf";

const handleDocumentRender = () => {
  loading.value = false;
  pageCount.value = pdfRef.value.pageCount;
};

const showAllPagesChange = () => {
  currentPage.value = (showAllPages.value ? null : 1) as number;
};

const onPrint = () => {
  pdfRef.value?.print();
};
</script>

<template>
  <el-space fill style="width: 100%">
    <el-card shadow="never" class="pdf-preview-container tk-card-minimal">
      <template #header>
        <div>
          <el-link
            href="https://github.com/hrynko/vue-pdf-embed"
            target="_blank"
            style="margin: 0 5px 4px 0; font-size: 20px"
          >
            PDF 预览
          </el-link>
        </div>
      </template>
      <div v-loading="loading" element-loading-text="加载中 ..." class="pdf-box">
        <div class="pdf-header">
          <div v-if="showAllPages">共{{ pageCount }}页</div>
          <div v-else>
            <el-pagination
              background
              layout="prev, slot, next"
              v-model:current-page="currentPage"
              :page-size="1"
              :total="pageCount"
            >
              {{ currentPage }} / {{ pageCount }}
            </el-pagination>
          </div>
          <div class="header-content">
            <el-checkbox v-model="showAllPages" @change="showAllPagesChange">显示所有页面</el-checkbox>
            <el-tooltip effect="dark" :content="`翻转（当前角度 ${rotations[currentRotation]} 度）`" placement="top">
              <el-icon @click="currentRotation === 3 ? (currentRotation = 0) : (currentRotation += 1)">
                <Refresh />
              </el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="打印" placement="top">
              <el-icon @click="onPrint"><Printer /></el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-scrollbar>
          <vue-pdf-embed
            ref="pdfRef"
            :rotation="rotations[currentRotation]"
            :page="currentPage"
            :source="source"
            @rendered="handleDocumentRender"
          />
        </el-scrollbar>
      </div>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
.pdf-preview-container {
  .pdf-box {
    height: calc(100vh - 230px);

    .pdf-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 170px;
      }
    }
  }
}
</style>
