<script setup lang="ts" name="RolePermission">
import type { TreeKey } from "element-plus";
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox, ElNotification, ElTree } from "element-plus";
import router, { resetRouter } from "@/router";
import { formatTitle } from "@/router/helper";
import { useRouteStore, useUserStore } from "@/pinia";
import { useMenu, useRouteFn } from "@/composables";
import { ProDialog } from "@/components";

interface Role {
  /** 角色 ID */
  key: number;
  /** 角色姓名 */
  name: string;
  /** 角色描述 */
  description: string;
  /** 角色路由 */
  routes: RouterConfigRaw[];
}

interface RoutesTreeData {
  /** 子节点 */
  children: RoutesTreeData[];
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
}

const defaultRole: Role = {
  key: 0,
  name: "",
  description: "",
  routes: [],
};

const dialogTitle: Record<string, string> = {
  edit: "角色编辑",
  add: "角色创建",
};

const routeStore = useRouteStore();
const userStore = useUserStore();
const { menuList, getMenuList } = useMenu();
const { filterFlatRoutes, loadDynamicRoutes } = useRouteFn();

const role = ref(defaultRole);
const serviceRoutes = ref<RouterConfig[]>([]); // 所有的路由，以供选择
const rolesList = ref<Role[]>([]); // 当前用户的角色信息，包含角色路由

const dialogVisible = ref(false);
const dialogStatus = ref("add");
const checkStrictly = ref(false);

const defaultProps = reactive({
  children: "children",
  label: "title",
});

const treeRef = useTemplateRef<InstanceType<typeof ElTree>>("treeRef");

const routesTreeData = computed(() => generateTreeData(menuList.value));

onMounted(() => {
  getRoutes();
  getRoleList();
});

const getRoutes = async () => {
  serviceRoutes.value = routeStore.loadedRouteList;
};

/**
 * 获取当前用户的信息
 */
const getRoleList = async () => {
  userStore.roles.forEach(role => {
    const item = {
      key: parseInt(Math.random() * 1000 + ""), // 随机 ID
      name: role,
      description: role === "admin" ? "超级管理员" : role === "visitor" ? "游客" : "",
      routes: routeStore.loadedRouteList, // 这里应该填角色实际拥有的路由权限
    };
    rolesList.value.push(item);
  });
};

/**
 * 生产树节点组件需要的信息
 */
const generateTreeData = (routes: RouterConfig[]) => {
  const data: RoutesTreeData[] = [];
  for (const route of routes) {
    const temp: RoutesTreeData = {
      children: [],
      title: "",
      path: "",
    };
    temp.title = formatTitle(route);
    temp.path = (route.meta._fullPath || route.name || route.path) as string;
    if (route.children) temp.children = generateTreeData(route.children);
    data.push(temp);
  }
  return data;
};

/**
 * 新增角色
 */
const handleCreateRole = () => {
  role.value = { ...defaultRole };
  treeRef.value?.setCheckedKeys([]); // 创建用户，将节点取消全选
  dialogStatus.value = "add";
  dialogVisible.value = true;
};

/**
 * 编辑角色
 */
const handleEdit = (row: any) => {
  dialogStatus.value = "edit";
  dialogVisible.value = true;
  checkStrictly.value = true;
  role.value = { ...row };
  nextTick(() => {
    const routes = filterFlatRoutes(getMenuList(role.value.routes as RouterConfig[]));
    const treeData = generateTreeData(routes);
    const treeDataKeys = treeData.map(t => t.path);
    treeRef.value?.setCheckedKeys(treeDataKeys);
    // 设置节点的已检查状态不会影响其父节点和子节点
    checkStrictly.value = false;
  });
};

/**
 * 删除角色
 */
const handleDelete = (row: any, index: number) => {
  ElMessageBox.confirm("确定删除该角色吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      rolesList.value.splice(index, 1);
      ElMessage.success("删除成功！");
    })
    .catch(err => {
      console.warn(err);
    });
};

/**
 * 确认角色
 */
const confirmRole = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys();
  role.value.routes = generateTree(serviceRoutes.value, checkedKeys || []); // 去所有路由里找出选择的节点
  if (dialogStatus.value === "edit") {
    for (let index = 0; index < rolesList.value.length; index++) {
      if (rolesList.value[index].key === role.value.key) {
        rolesList.value.splice(index, 1, role.value); // 替换新的 role
        break;
      }
    }
  } else {
    role.value.key = parseInt(Math.random() * 1000 + ""); // 没有后台，所以模拟出唯一的 key
    rolesList.value.push(role.value);
  }

  // 更新路由
  if (userStore.roles.includes(role.value.name)) {
    resetRouter();
    loadDynamicRoutes(role.value.routes, [role.value.name], router);
  }

  const { description, key, name } = role.value;
  dialogVisible.value = false;
  ElNotification.success({
    title: `${dialogStatus.value === "add" ? "新增" : "编辑"}成功`,
    dangerouslyUseHTMLString: true,
    message: `
          <div>角色 Key：${key}</div>
          <div>角色名：${name}</div>
          <div>角色描述：${description}</div>
        `,
  });
};
/**
 * 找出在编辑或者新增中，选中的节点，赋值给 role
 */
const generateTree = (routes: RouterConfig[], checkedKeys: TreeKey[]) => {
  const res: RouterConfig[] = [];
  for (const route of routes) {
    const r = { ...route };
    // 递归子路由
    if (r.children) r.children = generateTree(r.children, checkedKeys);
    if (checkedKeys.includes(r.meta._fullPath || "") || (r.children && r.children.length >= 1)) {
      res.push(r);
    }
  }
  return res;
};
</script>

<template>
  <div class="tk-card-minimal">
    <el-alert
      title="只有 admin 有权限进入该页面，可以尝试在「权限切换」菜单中切换非 admin 角色"
      type="info"
      style="margin-bottom: 16px"
    ></el-alert>

    <el-button type="primary" @click="handleCreateRole" style="margin-bottom: 16px">新增</el-button>

    <el-table :data="rolesList" style="width: 100%" border>
      <el-table-column prop="key" align="center" label="角色 Key" width="220"></el-table-column>
      <el-table-column prop="name" align="center" label="角色名" width="220"></el-table-column>
      <el-table-column prop="description" align="header-center" label="角色描述"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row, $index }">
          <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ProDialog
      v-model="dialogVisible"
      :title="dialogTitle[dialogStatus]"
      @confirm="confirmRole"
      @cancel="() => (dialogVisible = false)"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="role.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="treeRef"
            :data="routesTreeData"
            :props="defaultProps"
            :check-strictly="checkStrictly"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
    </ProDialog>
  </div>
</template>
