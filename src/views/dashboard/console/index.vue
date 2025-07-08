<template>
  <div class="console" :class="route.meta.isFull ? 'full' : ''">
    <el-button v-if="route.meta.isFull" @click="router.go(-1)">返回上一页</el-button>

    <CardList></CardList>

    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="10">
        <ActiveUser />
      </el-col>
      <el-col :sm="24" :md="12" :lg="14">
        <SalesOverview />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="12">
        <NewUser />
      </el-col>
      <el-col :sm="24" :md="12" :lg="6">
        <Dynamic />
      </el-col>
      <el-col :sm="24" :md="12" :lg="6">
        <TodoList />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CardList from "./components/card-list.vue";
import ActiveUser from "./components/active-user.vue";
import SalesOverview from "./components/sales-overview.vue";
import NewUser from "./components/new-user.vue";
import Dynamic from "./components/dynamic.vue";
import TodoList from "./components/todo-list.vue";
import { Tooltip } from "@/components";

defineOptions({ name: "Console" });

const route = useRoute();
const router = useRouter();

onMounted(() => {
  window.scrollTo({ top: 0 });
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
