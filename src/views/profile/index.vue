<script setup lang="ts" name="Profile">
import EditorInfo from "./components/editorInfo/index.vue";
import Account from "./components/account/index.vue";
import UserInfo from "./components/user-info/index.vue";
import UserAvatar from "./components/user-avatar/index.vue";
import Timeline from "./components/timeline/index.vue";
import { useUserStore } from "@/pinia";

const userStore = useUserStore();
const activeTab = ref("timeline");

const { userInfo } = storeToRefs(userStore);
</script>

<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <UserInfo :user="userInfo">
          <UserAvatar :user="userInfo" />
        </UserInfo>
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card shadow="never" class="tk-card-minimal">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="时间线" name="timeline">
              <Timeline />
            </el-tab-pane>
            <el-tab-pane label="资料编辑" name="editorUserInfo">
              <EditorInfo :user="userInfo" />
            </el-tab-pane>
            <el-tab-pane label="密码修改" name="updatePassword">
              <Account />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
