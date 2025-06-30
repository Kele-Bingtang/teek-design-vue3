<script setup lang="ts" name="Tabs">
import { appendFieldById, deleteChildren, getNodeById } from "@/common/utils";
import { useLayoutStore } from "@/pinia";
import { useMenu } from "@/composables";
import { copyObj } from "@/common/utils";
import { formatTitle } from "@/router/helper";
import { useDetail } from "./use-tabs";

const { toDetail, router } = useDetail();
const layoutStore = useLayoutStore();
const { menuList } = useMenu();
const routesTreeData = copyObj(menuList.value);

const treeData = computed(() => {
  return appendFieldById(deleteChildren(routesTreeData), 0, {
    disabled: true,
  });
});

const currentValues = ref<string[]>([]);

const { tabNavList } = storeToRefs(layoutStore);

function onCloseTags() {
  if (currentValues.value.length === 0) return;
  currentValues.value.forEach(id => {
    const currentPath =
      getNodeById(treeData.value, id).redirect ??
      getNodeById(treeData.value, id).meta?._fullPath ??
      getNodeById(treeData.value, id).path;
    layoutStore.removeTab({ path: currentPath } as any);
    if (currentPath === "/tabs") router.push(tabNavList.value[(tabNavList as any).value.length - 1].path);
  });
}
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="Query 传参模式">
      <el-button v-for="index in 6" :key="index" @click="toDetail(index, 'query')">打开{{ index }}详情页</el-button>
      <el-button @click="toDetail(7, 'query', true)">打开 7 详情页（关闭前校验拦截，观察 URL 参数）</el-button>
    </el-card>

    <el-card shadow="never" header="Params 传参模式">
      <el-button v-for="index in 6" :key="index" @click="toDetail(index, 'params')">打开{{ index }}详情页</el-button>
      <el-button @click="toDetail(7, 'params', true)">打开 7 详情页（关闭前校验拦截，观察 URL 参数）</el-button>
    </el-card>

    <el-card shadow="never" header="标签页关闭">
      <el-tree-select
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
        :data="treeData"
        v-model="currentValues"
        style="width: 240px"
      >
        <template #default="{ data }">
          <span>{{ formatTitle(data) }}</span>
        </template>
      </el-tree-select>
      <el-button @click="onCloseTags" style="margin-left: 10px">关闭标签</el-button>
    </el-card>

    <el-card shadow="never" header="路由跳转">
      <el-button @click="$router.push({ name: 'Menu1-3-1' })">跳转页内菜单（传 name 对象，优先推荐）</el-button>
      <el-button @click="$router.push('/nested/menu1/menu1-3/menu1-3-2')">跳转页内菜单（直接传要跳转的路径）</el-button>
      <el-button @click="$router.push({ path: '/nested/menu1/menu1-3/menu1-3-2' })">
        跳转页内菜单（传 path 对象）
      </el-button>
    </el-card>

    <el-card shadow="never" header="带参数路由跳转">
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
    <el-card shadow="never">
      <el-link
        href="https://router.vuejs.org/zh/guide/essentials/navigation.html#%E5%AF%BC%E8%88%AA%E5%88%B0%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE"
        target="_blank"
      >
        点击查看更多跳转方式
      </el-link>
    </el-card>
  </el-space>
</template>
