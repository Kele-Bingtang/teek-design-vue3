<script setup lang="ts" name="SwitchPermission">
import { computed } from "vue";
import { useCommon, usePermission } from "@/composables";
import { useUserStore } from "@/pinia";

const userStore = useUserStore();
const { getRoleList, hasRole, hasAuth } = usePermission();
const { refreshPage } = useCommon();

const { userInfo } = storeToRefs(userStore);

const roleList = computed(() => getRoleList());

const roleInfoList = computed(() => [
  {
    title: "管理员",
    desc: "拥有管理权限，可以访问所有功能模块，包括编辑权限模块",
    username: "Admin",
    role: "admin",
  },
  { title: "普通用户", desc: "普通用户权限，可以访问基础功能模块", username: "User", role: "user" },
]);
const handleSwitchRole = (role: string) => {
  userStore.changeRoles([role]).then(() => {
    refreshPage();
  });
};
</script>

<template>
  <el-space fill style="width: 100%">
    <el-card class="tk-card-minimal">
      <template #header>当前用户信息</template>
      <el-descriptions :column="1">
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag v-for="role in getRoleList()" :key="role" size="small">{{ role }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="tk-card-minimal">
      <template #header>Roles 角色切换</template>
      <div class="card-container">
        <div
          v-for="roleInfo in roleInfoList"
          :key="roleInfo.role"
          :class="{ active: roleList.includes(roleInfo.role) }"
          class="card"
        >
          <h2 class="card-title">{{ roleInfo.title }}</h2>
          <p class="card-description">{{ roleInfo.desc }}</p>
          <div class="user-info">
            <p class="username">用户名：{{ roleInfo.username }}</p>
            <p class="role">角色：{{ roleInfo.role }}</p>
          </div>
          <div class="action">
            <span v-if="roleList.includes(roleInfo.role)" class="current-role">当前角色</span>
            <el-button v-else type="primary" @click="handleSwitchRole(roleInfo.role)">切换到此角色</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal" header="Roles 切换效果查看">
      <el-space fill>
        <Role :value="['admin']">
          <el-card shadow="never" header="组件方式判断权限" class="tk-card-minimal">
            只有
            <el-tag>admin</el-tag>
            有权限看
            <el-tag type="info">使用 Role 组件包起来</el-tag>
          </el-card>
        </Role>

        <Role :value="['user']">
          <el-card shadow="never" header="组件方式判断权限" class="tk-card-minimal">
            <span>
              只有
              <el-tag>user</el-tag>
              有权限看
            </span>
            <el-tag type="info">使用 Role 组件包起来</el-tag>
          </el-card>
        </Role>

        <el-card
          shadow="never"
          v-role="['admin', 'user']"
          header="指令方式判断权限（该方式不能动态修改权限）"
          class="tk-card-minimal"
        >
          <el-tag>admin</el-tag>
          和
          <el-tag>user</el-tag>
          都有权限看
          <el-tag type="info">v-role="['admin','user']"</el-tag>
        </el-card>

        <el-card shadow="never" header="函数方式判断权限" class="tk-card-minimal">
          <el-tabs type="border-card">
            <el-tab-pane v-if="hasRole(['admin'])" label="admin">
              只有 admin 有权限看
              <el-tag type="info">v-if="hasRole(['admin'])"</el-tag>
            </el-tab-pane>

            <el-tab-pane v-if="hasRole(['user'])" label="user">
              只有 user 有权限看
              <el-tag type="info">v-if="hasRole(['user'])"</el-tag>
            </el-tab-pane>

            <el-tab-pane v-if="hasRole(['admin', 'user'])" label="admin 和 user">
              admin 和 user 都有权限看
              <el-tag type="info">v-if="hasRole(['admin','user'])"</el-tag>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-space>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal" header="Auths 切换效果查看">
      <el-space fill>
        <p>请修改手动当前路由的 meta.auths 来切换权限。</p>

        <el-card shadow="never" header="组件方式判断权限" class="tk-card-minimal">
          <Auth value="btn_add">
            <el-button type="success">拥有 ['btn_add'] 权限可见</el-button>
          </Auth>
          <Auth :value="['btn_edit']">
            <el-button type="primary">拥有 ['btn_edit'] 权限可见</el-button>
          </Auth>
          <Auth :value="['btn_add', 'btn_edit', 'btn_delete']">
            <el-button type="danger">拥有 ['btn_add', 'btn_edit', 'btn_delete'] 权限可见</el-button>
          </Auth>
          <el-tag type="info" style="margin-left: 12px">使用 Auth 组件包起来</el-tag>
        </el-card>

        <el-card shadow="never" header="函数方式判断权限" class="tk-card-minimal">
          <el-button type="success" v-if="hasAuth('btn_add')">拥有 'btn_add' 权限可见</el-button>
          <el-button type="primary" v-if="hasAuth(['btn_edit'])">拥有 ['btn_edit'] 权限可见</el-button>
          <el-button type="danger" v-if="hasAuth(['btn_add', 'btn_edit', 'btn_delete'])">
            拥有 ['btn_add', 'btn_edit', 'btn_delete'] 权限可见
          </el-button>
          <el-tag type="info" style="margin-left: 12px">v-if="hasAuth(['btn_add', 'btn_edit', 'btn_delete'])"</el-tag>
        </el-card>

        <el-card shadow="never" header="指令方式判断权限（该方式不能动态修改权限）" class="tk-card-minimal">
          <el-button type="success" v-auth="'btn_add'">拥有 'btn_add' 权限可见</el-button>
          <el-button type="primary" v-auth="['btn_edit']">拥有 ['btn_edit'] 权限可见</el-button>
          <el-button type="danger" v-auth="['btn_add', 'btn_edit', 'btn_delete']">
            拥有 ['btn_add', 'btn_edit', 'btn_delete'] 权限可见
          </el-button>

          <el-tag type="info" style="margin-left: 12px">v-auth="['btn_add', 'btn_edit', 'btn_delete']"</el-tag>
        </el-card>
      </el-space>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;

  .card {
    flex: 1;
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    box-shadow: cssVar(root-card-box-shadow);
    transition: all 0.3s ease;

    &.active {
      background-color: var(--el-color-primary-light-8);
    }

    .card-title {
      font-size: 18px;
      font-weight: bold;
    }

    .card-description {
      margin: 10px 0;
      font-size: 14px;
      color: cssVar(text-gray-700);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      font-size: 15px;
      color: cssVar(text-gray-800);
    }

    .action {
      text-align: right;

      .current-role {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }
  }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .card-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
