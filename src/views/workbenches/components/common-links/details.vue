<script setup lang="ts">
import type { FormColumn, ProFormInstance } from "@/components";
import type { CommonLink, CommonLinkTab } from "./types";
import { ref, onMounted } from "vue";
import { Plus, Link } from "@element-plus/icons-vue";
import Sortable from "sortablejs";
import { ProDialog, ProForm, IconPicker } from "@/components";
import { useNamespace, useValidator } from "@/composables";
import { systemLinks, flowLinks, otherLinks } from "./data";

const emits = defineEmits<{
  select: [item: CommonLink, data: CommonLink[]];
}>();

const ns = useNamespace("common-links-details");
const formInstance = useTemplateRef<ProFormInstance>("formInstance");

// 实际请调用接口初始化数据
const tabs = ref<CommonLinkTab[]>([
  { label: "全部", value: "all", data: [...systemLinks, ...flowLinks, ...otherLinks] },
  { label: "系统链接", value: "system", data: systemLinks },
  { label: "流程链接", value: "flow", data: flowLinks },
  { label: "其他", value: "other", data: otherLinks },
]);

const { validateUrl } = useValidator();

const dialogVisible = ref(false);
const activeTab = ref<CommonLinkTab>(tabs.value[0]);
const commonLinksContentInstance = useTemplateRef<HTMLElement>("commonLinksContentInstance");

const form = ref({
  type: "",
  name: "",
  url: "",
  icon: "",
  desc: "",
});

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

const handleAddLink = () => {
  dialogVisible.value = true;
};

const handleConfirm = async () => {
  const res = await formInstance.value?.submitForm();

  if (res) {
    const newItem = { ...form.value, selected: true, sort: 99 };
    const tab = tabs.value.find(tab => tab.value === form.value.type);
    if (tab) {
      tab.data.push(newItem);
      emits("select", newItem, tab.data);
    }
    dialogVisible.value = false;
  }
};

const handleClick = (button: CommonLinkTab) => {
  activeTab.value = button;
};

const handleSelect = (item: CommonLink) => {
  item.selected = !item.selected;
  emits("select", item, activeTab.value.data);
};

/**
 * 拖拽排序
 */
const dragSort = () => {
  if (!commonLinksContentInstance.value) return;

  Sortable.create(commonLinksContentInstance.value, {
    handle: ".drag-sort-icon",
    animation: 300,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    onEnd({ newIndex, oldIndex }) {
      if (newIndex !== undefined && oldIndex !== undefined) {
        const [removeItem] = activeTab.value.data.splice(oldIndex, 1);
        activeTab.value.data.splice(newIndex, 0, removeItem);
      }
    },
  });
};

onMounted(() => {
  dragSort();
});

defineExpose({
  tabs,
});
</script>

<template>
  <div ref="commonLinksInstance" :class="ns.b()">
    <div :class="ns.e('header')" class="flx-align-center-between">
      <div class="flx gap-10">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          @click="handleClick(tab)"
          :class="[ns.e('tab-item'), ns.is('active', tab.value === activeTab.value)]"
        >
          {{ tab.label }}
        </div>
      </div>
      <el-button type="primary" link :icon="Plus" @click="handleAddLink">添加链接</el-button>
    </div>

    <div ref="commonLinksContentInstance" :class="ns.e('content')" class="flx flx-wrap gap-20">
      <template v-if="activeTab.data.length">
        <div v-for="item in activeTab.data" :key="item.name" :class="ns.e('item')" @click="handleSelect(item)">
          <span ref="dragSortIconInstance" class="drag-sort-icon" @click.stop>☷</span>

          <div :class="ns.e('icon')" class="flx-center">
            <Icon :icon="item.icon || Link" :size="36" />
          </div>

          <div class="flx-column" :class="ns.e('item-content')">
            <div class="name sle">{{ item.name }}</div>
            <div class="desc sle">{{ item.desc }}</div>
          </div>

          <el-checkbox v-model="item.selected" class="checkbox" @click.stop />
        </div>
      </template>

      <el-empty v-else description="暂无内容，快来添加吧" :image-size="100" :class="ns.e('empty')" class="flx-center" />
    </div>

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

@include b(common-links-details) {
  padding: 0 20px;
  @include e(header) {
    margin-bottom: 16px;

    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  @include e(tab-item) {
    display: inline-block;
    padding: 6px 14px;
    cursor: pointer;
    border-radius: 16px;
    transition: all cssVarEl(transition-duration-fast) cssVar(easing);

    &:hover {
      color: #ffffff;
      background-color: cssVar(color-primary);
    }

    @include is(active) {
      color: #ffffff;
      background-color: cssVar(color-primary);
    }
  }

  @include e(item) {
    position: relative;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    width: 300px;
    padding: 10px;
    cursor: pointer;
    background-color: cssVar(gray-100);
    border-radius: 8px;
    transition: all cssVarEl(transition-duration-fast) cssVar(easing);

    .drag-sort-icon {
      cursor: move;
    }

    .checkbox {
      position: absolute;
      top: 0;
      right: 10px;
    }
  }

  @include e(item-content) {
    gap: 10px;
    width: 215px;

    .name {
      font-weight: 600;
    }

    .desc {
      font-size: 12px;
      color: cssVar(gray-500);
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
</style>
