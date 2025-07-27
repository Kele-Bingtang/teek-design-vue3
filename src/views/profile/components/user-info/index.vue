<script setup lang="ts" name="UserCard">
import type { UserInfo } from "@/pinia";
import { computed } from "vue";
import { serviceConfig } from "@/common/config";
import { useNamespace } from "@/composables";

const ns = useNamespace("user-info");

const { user } = defineProps<{ user: UserInfo }>();

const userInfo = computed(() => [
  { label: "用户邮箱", value: user.email },
  { label: "联系方式", value: user.phone },
  { label: "用户性别", value: user.sex },
  { label: "工作职位", value: user.job },
  { label: "所在部门", value: user.dept },
  { label: "注册时间", value: user.registerTime },
  { label: "系统角色", value: user.roles?.join("/") },
]);

const skills = ["HTML", "CSS", "JavaScript", "Vue", "React", "TypeScript", "Java", "SQL", "Docker"];

const hobby = ["躺平", "专注开发", "热爱学习", "旅游"];
</script>

<template>
  <el-card shadow="never" :class="[ns.b(), 'tk-card-minimal']">
    <div :class="ns.e('head')">
      <slot>
        <el-image :src="user.avatar" :class="ns.m('avatar')" alt="头像">
          <template #error>
            <el-image :src="serviceConfig.layout.avatar" :class="ns.m('avatar')" alt="头像" />
          </template>
        </el-image>
      </slot>

      <p :class="ns.em('head', 'name')">{{ user.username }}</p>
      <p :class="ns.em('head', 'desc')">{{ user.signature }}</p>
    </div>

    <div :class="ns.e('info')">
      <ul class="flx-column gap-10">
        <li v-for="item in userInfo" :key="item.label" class="flx-align-center-between">
          <span>{{ item.label }}</span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </div>

    <div :class="ns.e('tag')">
      <p>标签</p>
      <span v-for="item in hobby" :key="item">{{ item }}</span>
    </div>

    <div :class="ns.e('tag')">
      <p>技术栈</p>
      <span v-for="item in skills" :key="item">{{ item }}</span>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
