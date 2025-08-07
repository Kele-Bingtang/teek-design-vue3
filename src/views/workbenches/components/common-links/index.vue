<script setup lang="ts">
import type { CommonLink, CommonLinkTab } from "./types";
import { ref } from "vue";
import { Link, Edit } from "@element-plus/icons-vue";
import { ProDialog } from "@/components";
import { useNamespace } from "@/composables";
import { systemLinks, flowLinks, otherLinks } from "./data";
import CommonLinksDetails from "./details.vue";
import { ElMessage } from "element-plus";

defineOptions({ name: "CommonLinks" });

const ns = useNamespace("common-links");

const activeTab = ref("all");

const dialogVisible = ref(false);

const commonLinksDetailsInstance =
  useTemplateRef<InstanceType<typeof CommonLinksDetails>>("commonLinksDetailsInstance");

const tabs = ref<CommonLinkTab[]>([
  { label: "全部", value: "all", data: [...systemLinks, ...flowLinks, ...otherLinks] },
  { label: "系统链接", value: "system", data: systemLinks },
  { label: "流程链接", value: "flow", data: flowLinks },
  { label: "其他", value: "other", data: otherLinks },
]);

const handleClick = (item: CommonLink) => {
  item.url && window.open(item.url, "_blank");
};

const handleAddLink = () => {
  dialogVisible.value = true;
};

const handleConfirm = () => {
  const newTabs = commonLinksDetailsInstance.value?.tabs;
  // 实际请请求接口获取更新后的的常用链接
  if (newTabs) {
    tabs.value = newTabs;
    ElMessage.success("更新成功！");
  }
  dialogVisible.value = false;
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal">
    <div :class="ns.e('header')" class="flx-align-center-between">
      <h2>常用链接</h2>
      <el-button type="primary" link :icon="Edit" @click="handleAddLink">管理常用链接</el-button>
    </div>

    <el-tabs v-model="activeTab" tab-position="top">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value">
        <template v-if="tab.data.length">
          <div
            v-for="item in tab.data.filter(item => item.selected)"
            :key="item.name"
            :class="ns.e('item')"
            @click="handleClick(item)"
          >
            <div :class="ns.e('icon')" class="flx-center">
              <Icon :icon="item.icon || Link" :size="36" />
            </div>
            <div class="flx-column" :class="ns.e('item-content')">
              <div class="name sle">{{ item.name }}</div>
              <div class="desc sle">{{ item.desc }}</div>
            </div>
          </div>
        </template>

        <el-empty
          v-else
          description="暂无内容，快来添加吧"
          :image-size="100"
          :class="ns.e('empty')"
          class="flx-center"
        />
      </el-tab-pane>
    </el-tabs>

    <ProDialog
      v-model="dialogVisible"
      title="添加常用链接"
      top="2vh"
      width="74%"
      height="70vh"
      @confirm="handleConfirm"
    >
      <CommonLinksDetails ref="commonLinksDetailsInstance" />
    </ProDialog>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(common-links) {
  height: 600px;
  overflow: hidden;

  @include e(header) {
    margin-bottom: 16px;

    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .#{$el-namespace}-tabs {
    height: calc(100% - 27px);

    :deep(.#{$el-namespace}-tabs__content) {
      overflow: auto;

      // 滚动条隐藏
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .#{$el-namespace}-tab-pane {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-bottom: 20px;
    overflow: auto;

    @include e(item) {
      display: inline-flex;
      gap: 10px;
      width: 300px;
      padding: 10px;
      cursor: pointer;
      border-radius: 8px;
      transition: all cssVar(transition-duration-fast) cssVar(easing);

      &:hover {
        color: cssVar(color-primary);
        background-color: cssVar(gray-200);

        @include e(icon) {
          color: cssVar(color-primary);
        }

        .desc {
          color: cssVar(color-primary) !important;
        }
      }
    }

    @include e(item-content) {
      width: 230px;

      .name {
        font-weight: 600;
      }

      .desc {
        font-size: 12px;
        color: cssVar(text-gray-500);

        &:hover {
          color: cssVar(color-primary);
        }
      }
    }

    @include e(icon) {
      width: 36px;
      height: 36px;
      background-color: cssVar(gray-300);
      border-radius: 50%;
    }

    @include e(empty) {
      width: 100%;
    }
  }
}
</style>
