<script setup lang="ts">
import type { FormColumn, ProFormInstance } from "@/components";
import { Link, Plus } from "@element-plus/icons-vue";
import { ProDialog, ProForm, IconPicker } from "@/components";
import { useNamespace, useValidator } from "@/composables";
import { systemLinks, flowLinks, otherLinks } from "./data";

defineOptions({ name: "CommonLinks" });

interface CommonLink {
  name: string;
  desc: string;
  icon: string;
  url: string;
}

const ns = useNamespace("common-links");

const activeTab = ref("all");
const formInstance = useTemplateRef<ProFormInstance>("formInstance");

const dialogVisible = ref(false);

const { validateUrl } = useValidator();

const form = ref({
  type: "",
  name: "",
  url: "",
  icon: "",
  desc: "",
});

const tabs = ref<{ label: string; value: string; data: CommonLink[] }[]>([
  { label: "全部", value: "all", data: [...systemLinks, ...flowLinks, ...otherLinks] },
  { label: "系统链接", value: "system", data: systemLinks },
  { label: "流程链接", value: "flow", data: flowLinks },
  { label: "其他", value: "other", data: otherLinks },
]);

const rules = {
  name: [{ required: true, message: "请输入链接名称" }],
  url: [validateUrl(), { required: true, message: "请输入链接地址" }],
  type: [{ required: true, message: "请选择链接类型" }],
};

const columns: FormColumn[] = [
  {
    label: "链接类型",
    prop: "type",
    el: "el-select",
    options: tabs.value.filter(tab => tab.value !== "all").map(tab => ({ label: tab.label, value: tab.value })),
  },
  { label: "链接名称", prop: "name" },
  { label: "链接地址", prop: "url" },
  { label: "链接图标", prop: "icon" },
  { label: "链接描述", prop: "desc" },
];

const handleClick = (item: CommonLink) => {
  item.url && window.open(item.url, "_blank");
};

const handleAddLink = () => {
  dialogVisible.value = true;
};

const handleConfirm = async () => {
  const res = await formInstance.value?.submitForm();

  if (res) {
    console.log(form.value);
    tabs.value.find(tab => tab.value === form.value.type)?.data.push(form.value);
    dialogVisible.value = false;
  }
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>常用链接</h2>
      <el-button type="primary" link :icon="Plus" @click="handleAddLink">添加链接</el-button>
    </div>

    <el-tabs v-model="activeTab" tab-position="top">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value">
        <template v-if="tab.data.length">
          <div v-for="item in tab.data" :key="item.name" :class="ns.e('item')" @click="handleClick(item)">
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

    <ProDialog v-model="dialogVisible" title="添加链接" width="30%" :height="300" @confirm="handleConfirm">
      <ProForm
        ref="formInstance"
        :columns="columns"
        v-model="form"
        :rules="rules"
        :col-props="{ span: 24 }"
        :show-footer="false"
      >
        <template #icon>
          <IconPicker v-model="form.icon" style="width: 100%" />
        </template>
      </ProForm>
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

  .el-tabs {
    height: calc(100% - 27px);

    :deep(.el-tabs__content) {
      overflow: auto;

      // 滚动条隐藏
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .el-tab-pane {
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
      transition: all cssVarEl(transition-duration-fast) cssVar(easing);

      &:hover {
        color: cssVar(color-primary);
        background-color: cssVar(gray-100);

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
        color: cssVar(gray-500);

        &:hover {
          color: cssVar(color-primary);
        }
      }
    }

    @include e(icon) {
      width: 36px;
      height: 36px;
      background-color: cssVar(gray-200);
      border-radius: 50%;
    }

    @include e(empty) {
      width: 100%;
    }
  }
}
</style>
