<script setup lang="ts" name="Tabs">
import type { TabProps } from "@/pinia";
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { appendFieldById, deleteChildren, getNodeById, copyObj } from "@/common/utils";
import { useMenu } from "@/composables";
import { useLayoutStore } from "@/pinia";
import { formatTitle } from "@/router/helper";
import { useDetail } from "./use-tabs";

const { toDetail, router, route } = useDetail();
const layoutStore = useLayoutStore();
const { menuList } = useMenu();

const newTabTitle = ref("");

// 深拷贝菜单
const routesTreeData = copyObj(menuList.value);

const treeData = computed(() => {
  // 删除 children 并给根节点添加 disabled 字段
  return appendFieldById(deleteChildren(routesTreeData), 0, {
    disabled: true,
  });
});

const currentValues = ref<string[]>([]);

const { tabNavList } = storeToRefs(layoutStore);

/**
 * 关闭标签页
 */
const closeSelectedTabs = () => {
  if (currentValues.value.length === 0) return;

  currentValues.value.forEach(id => {
    const node = getNodeById(treeData.value, id);
    const currentPath = node?.redirect ?? node?.meta?._fullPath ?? node?.path;

    layoutStore.removeTab(currentPath);

    const tabNavListValue = tabNavList.value;
    // 如果关闭的是当前页
    if (currentPath === route.path) router.push(tabNavListValue[tabNavListValue.length - 1].path);
  });
};

/**
 * 关闭当前标签页
 */
const handleCloseCurrentTab = () => {
  layoutStore.removeTab(route.path);
  const tabNavListValue = tabNavList.value;

  router.push(tabNavListValue[tabNavListValue.length - 1].path);
};

/**
 * 关闭其他标签页
 */
const handleCloseOthersTab = () => {
  layoutStore.removeOtherTabs(route as unknown as TabProps);
};

/**
 * 关闭所有标签页
 */
const handleCloseAllTab = () => {
  layoutStore.removeAllTabs();
  router.push("/");
};

/**
 * 更新标签页标题
 */
const handleUpdateTabTitle = () => {
  layoutStore.updateTab({ title: newTabTitle.value, path: route.path });
};

/**
 * 重置标签页标题
 */
const handleResetTabTitle = () => {
  layoutStore.updateTab({ title: formatTitle(route), path: route.path });
  newTabTitle.value = "";
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="Query 传参模式" class="tk-card-minimal">
      <el-button v-for="index in 6" :key="index" @click="toDetail(index, 'query')">打开{{ index }}详情页</el-button>
      <el-button @click="toDetail(7, 'query', true)">打开 7 详情页（关闭前校验拦截，观察 URL 参数）</el-button>
    </el-card>

    <el-card shadow="never" header="Params 传参模式" class="tk-card-minimal">
      <el-button v-for="index in 6" :key="index" @click="toDetail(index, 'params')">打开{{ index }}详情页</el-button>
      <el-button @click="toDetail(7, 'params', true)">打开 7 详情页（关闭前校验拦截，观察 URL 参数）</el-button>
    </el-card>

    <el-card shadow="never" header="标签页关闭" class="tk-card-minimal">
      <el-input v-model="newTabTitle" placeholder="请输入新的标签页标题" clearable style="width: 300px" />

      <el-button type="primary" @click="handleUpdateTabTitle" :disabled="!newTabTitle.trim()" style="margin-left: 10px">
        修改
      </el-button>
      <el-button @click="handleResetTabTitle" style="margin-right: 10px">重置</el-button>

      <el-tree-select
        v-model="currentValues"
        :data="treeData"
        node-key="id"
        placeholder="请选择要关闭的标签"
        clearable
        multiple
        filterable
        default-expand-all
        :props="{
          label: (data: any) => formatTitle(data),
          value: 'id',
          children: 'children',
          disabled: 'disabled',
        }"
        style="width: 240px"
      >
        <template #default="{ data }">
          <span>{{ formatTitle(data) }}</span>
        </template>
      </el-tree-select>
      <el-button type="primary" plain @click="closeSelectedTabs" style="margin-left: 10px">关闭选择标签</el-button>

      <el-button type="success" plain @click="handleCloseCurrentTab">关闭当前标签</el-button>
      <el-button type="warning" plain @click="handleCloseOthersTab">关闭其他标签</el-button>
      <el-button type="danger" plain @click="handleCloseAllTab">关闭所有标签</el-button>
    </el-card>

    <el-card shadow="never" header="路由跳转" class="tk-card-minimal">
      <el-button @click="$router.push({ name: 'Menu1-3-1' })">跳转页内菜单（传 name 对象，优先推荐）</el-button>
      <el-button @click="$router.push('/nested/menu1/menu1-3/menu1-3-2')">跳转页内菜单（直接传要跳转的路径）</el-button>
      <el-button @click="$router.push({ path: '/nested/menu1/menu1-3/menu1-3-2' })">
        跳转页内菜单（传 path 对象）
      </el-button>
    </el-card>

    <el-card shadow="never" header="带参数路由跳转" class="tk-card-minimal">
      <el-button
        @click="
          $router.push({
            name: 'Menu1-3-1',
            query: { text: '传 name 对象，优先推荐' },
          })
        "
      >
        携参跳转页内菜单（传name对象，优先推荐）
      </el-button>
      <el-button
        @click="
          $router.push({
            path: '/nested/menu1/menu1-3/menu1-3-2',
            query: { text: '传 path 对象' },
          })
        "
      >
        携参跳转页内菜单（传path对象）
      </el-button>

      <el-button @click="$router.push('/console-full')">跳转无 Layout 的全屏页</el-button>
    </el-card>
    <el-card shadow="never" class="tk-card-minimal">
      <el-link
        href="https://router.vuejs.org/zh/guide/essentials/navigation.html#%E5%AF%BC%E8%88%AA%E5%88%B0%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE"
        target="_blank"
      >
        点击查看更多跳转方式
      </el-link>
    </el-card>
  </el-space>
</template>
