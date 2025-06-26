<script setup lang="ts" name="SwitchPermission">
import { useUserStore } from "@/pinia";
import { usePermission } from "@/composables";
import { RefreshPageKey } from "@/common/config";

const userStore = useUserStore();
const { getRoleList, getAuthList, hasRole, hasAuth } = usePermission();
const refreshCurrentPage = inject(RefreshPageKey, (value?: boolean) => value);

const roleList = computed(() => getRoleList());
const switchRole = computed({
  get() {
    return roleList.value[0];
  },
  set(value: string) {
    const roles = [value];
    userStore.changeRoles(roles).then(() => {
      refreshCurrentPage();
    });
  },
});
</script>

<template>
  <el-card class="switch-permission-container">
    <div shadow="never" class="left-container">
      <el-card shadow="never">
        <template #header>角色切换</template>
        <el-radio-group v-model="switchRole">
          <el-radio-button label="admin" />
          <el-radio-button label="visitor" />
        </el-radio-group>
      </el-card>

      <el-tag size="large" effect="dark">当前拥有的角色列表： {{ roleList }}</el-tag>

      <Role :value="['admin']">
        <el-card shadow="never">
          <template #header>组件方式判断权限</template>
          <span class="permission-alert">
            只有
            <el-tag class="permission-tag" size="small">admin</el-tag>
            有权限看
          </span>
          <el-tag class="permission-sourceCode" type="info">v-role="['admin']"</el-tag>
        </el-card>
      </Role>

      <Role :value="['visitor']">
        <el-card shadow="never">
          <template #header>组件方式判断权限</template>
          <span class="permission-alert">
            只有
            <el-tag class="permission-tag" size="small">visitor</el-tag>
            有权限看
          </span>
          <el-tag class="permission-sourceCode" type="info">v-role="['visitor']"</el-tag>
        </el-card>
      </Role>

      <el-card shadow="never" v-role="['admin', 'visitor']">
        <template #header>指令方式判断权限（该方式不能动态修改权限）</template>
        <span class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag>
          和
          <el-tag class="permission-tag" size="small">visitor</el-tag>
          都有权限看
        </span>
        <el-tag class="permission-sourceCode" type="info">v-role="['admin','visitor']"</el-tag>
      </el-card>

      <el-card shadow="never">
        <template #header>函数方式判断权限</template>
        <el-tabs type="border-card">
          <el-tab-pane v-if="hasRole(['admin'])" label="admin">
            只有 admin 有权限看
            <el-tag class="permission-sourceCode" type="info">v-if="hasRole(['admin'])"</el-tag>
          </el-tab-pane>

          <el-tab-pane v-if="hasRole(['visitor'])" label="visitor">
            只有 visitor 有权限看
            <el-tag class="permission-sourceCode" type="info">v-if="hasRole(['visitor'])"</el-tag>
          </el-tab-pane>

          <el-tab-pane v-if="hasRole(['admin', 'visitor'])" label="admin 和 visitor">
            admin 和 visitor 都有权限看
            <el-tag class="permission-sourceCode" type="info">v-if="hasRole(['admin','visitor'])"</el-tag>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <div class="right-container">
      <el-card shadow="never">
        <template #header>Auth 切换</template>
        请修改当前路由的 meta.auths 来切换权限。
      </el-card>

      <el-tag size="large" effect="dark">当前拥有的 Auth 列表：{{ authList }}</el-tag>

      <el-card shadow="never">
        <template #header>
          <div class="card-header">组件方式判断权限</div>
        </template>
        <Auth value="btn_add">
          <el-button type="success">拥有 ['btn_add'] 权限可见</el-button>
        </Auth>
        <Auth :value="['btn_edit']">
          <el-button type="primary">拥有 ['btn_edit'] 权限可见</el-button>
        </Auth>
        <Auth :value="['btn_add', 'btn_edit', 'btn_delete']">
          <el-button type="danger">拥有 ['btn_add', 'btn_edit', 'btn_delete'] 权限可见</el-button>
        </Auth>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="card-header">函数方式判断权限</div>
        </template>
        <el-button type="success" v-if="hasAuth('btn_add')">拥有 'btn_add' 权限可见</el-button>
        <el-button type="primary" v-if="hasAuth(['btn_edit'])">拥有 ['btn_edit'] 权限可见</el-button>
        <el-button type="danger" v-if="hasAuth(['btn_add', 'btn_edit', 'btn_delete'])">
          拥有 ['btn_add', 'btn_edit', 'btn_delete'] 权限可见
        </el-button>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="card-header">指令方式判断权限（该方式不能动态修改权限）</div>
        </template>
        <el-button type="success" v-auth="'btn_add'">拥有 'btn_add' 权限可见</el-button>
        <el-button type="primary" v-auth="['btn_edit']">拥有 ['btn_edit'] 权限可见</el-button>
        <el-button type="danger" v-auth="['btn_add', 'btn_edit', 'btn_delete']">
          拥有 ['btn_add', 'btn_edit', 'btn_delete'] 权限可见
        </el-button>
      </el-card>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.switch-permission-container {
  .switch-info {
    display: flex;
    justify-content: space-around;
  }

  .left-container,
  .right-container {
    display: inline-flex;
    flex-direction: column;
    gap: 10px;

    > div {
      min-height: 140px;
    }
  }

  .right-container {
    width: 60%;
    margin-left: 10px;
  }

  .permission-alert {
    display: inline-block;
    width: 320px;
    padding: 8px 16px;
    margin-top: 15px;
    color: #ecf5ff;
    background-color: var(--#{$el-namespace}-color-primary);
    border-radius: 4px;
  }

  .permission-sourceCode {
    margin-left: 15px;
  }

  .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>
