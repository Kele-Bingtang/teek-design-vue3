<script setup lang="ts">
import type { ProFormDialogInstance } from "@/components/pro/form-dialog";
import type { ProFormDrawerInstance } from "@/components/pro/form-drawer";
import type { FeedbackFormProps, FeedbackStatus } from "./types";
import { computed, ref, unref, useTemplateRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone, isArray, isFunction } from "@/common/utils";
import { ProFormDialog } from "@/components/pro/form-dialog";
import { ProFormDrawer } from "@/components/pro/form-drawer";

const props = withDefaults(defineProps<FeedbackFormProps>(), {
  type: "dialog",
  id: "id",
  cache: false,
});

const model = ref<Record<string, any>>({});
const feedbackFormVisible = ref(false);
const status = ref<FeedbackStatus>("");

const proFormTypeInstance = useTemplateRef<ProFormDialogInstance | ProFormDrawerInstance>("proFormTypeInstance");

const typeProps = computed(() => {
  const { typeProps } = props;

  const title = isFunction(typeProps?.title) ? typeProps.title(model.value, status.value) : typeProps?.title;
  const height = isFunction(typeProps?.height) ? typeProps.height(model.value, status.value) : typeProps?.height;
  return { ...typeProps, title, height };
});

// 组装主键 id & ProForm 不过滤的 keys
const notCleanModelKeys = computed(() => {
  const ids = Array.isArray(props.id) ? props.id : [props.id];

  const { form } = props;
  return form?.notCleanModelKeys?.length ? [...form.notCleanModelKeys, ...ids] : ids;
});

/**
 * 表单配置项
 */
const newColumn = computed(() => {
  const columns = unref(props.form?.columns) || [];
  // 目前 status 一变化，都走一遍循环，优化：可以利用 Map 存储有 show 的 column（存下标），然后监听 status，当 status 变化，则通过下标获取 column，将 hidden 设置为 true
  columns.forEach(column => {
    const { destroyIn, hiddenIn, disabledIn } = column;

    if (isArray(destroyIn)) {
      if (destroyIn.includes("add")) column.destroy = status.value === "add";
      else if (destroyIn.includes("edit")) column.destroy = status.value === "edit";
    }
    if (isArray(hiddenIn)) {
      if (hiddenIn.includes("add")) column.hidden = status.value === "add";
      else if (hiddenIn.includes("edit")) column.hidden = status.value === "edit";
    }

    if (isArray(disabledIn)) {
      column.elProps ??= {};
      if (disabledIn.includes("add")) (column.elProps as any).disabled = status.value === "add";
      else if (disabledIn.includes("edit")) (column.elProps as any).disabled = status.value === "edit";
    }
  });

  return columns;
});

/**
 * 触发新增事件
 */
const handleAdd = async (row?: any) => {
  const { cache, id, clickAdd } = props;

  status.value = "add";
  proFormTypeInstance.value?.proFormInstance?.elFormInstance?.resetFields();
  // 过滤掉 Event 类型
  if (row && !(row instanceof Event)) model.value = deepClone(row);
  else if (!cache) model.value = {};
  else if (isArray(id)) {
    id.forEach(key => {
      delete model.value[key];
    });
  } else id && delete model.value[id];
  clickAdd && (model.value = (await clickAdd(model.value)) ?? model.value);
  feedbackFormVisible.value = true;
};

/**
 * 触发编辑事件
 */
const handleEdit = async (row: any) => {
  // 过滤掉 Event 类型
  if (row instanceof Event) return;

  const { clickEdit } = props;

  status.value = "edit";
  proFormTypeInstance.value?.proFormInstance?.elFormInstance?.resetFields();
  if (!(row instanceof Event)) model.value = deepClone(row);
  clickEdit && (model.value = (await clickEdit(model.value)) ?? model.value);
  feedbackFormVisible.value = true;
};

/**
 * 点击保存事件
 */
const handleConfirm = (data: any, status: FeedbackStatus) => {
  const { beforeConfirm } = props;

  beforeConfirm && beforeConfirm(status);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._options;

  if (status === "add") handleDoAdd(data);
  else if (status === "edit") handleDoEdit(data);
};

/**
 * 执行新增事件
 */
const handleDoAdd = (data: any) => {
  const elFormInstance = proFormTypeInstance.value?.proFormInstance?.elFormInstance;

  elFormInstance?.validate(async valid => {
    if (valid) {
      const {
        beforeAdd,
        apiFilterKeys,
        addFilterKeys,
        addApi,
        apiCarryParams,
        addCarryParams,
        afterAdd,
        cache,
        afterConfirm,
      } = props;

      data = (beforeAdd && (await beforeAdd(data))) || data;

      // 删除 Add 不允许传输的数据
      const filterParams = [...(apiFilterKeys || []), ...(addFilterKeys || [])];
      filterParams.forEach(item => delete data[item]);

      // 执行新增接口
      executeApi(
        addApi,
        { ...apiCarryParams, ...addCarryParams, ...data },
        "添加成功！",
        "添加失败！",
        async res => {
          afterAdd && (await afterAdd({ ...addCarryParams, data }, res));
          if (!cache) model.value = {};
          feedbackFormVisible.value = false;
          afterConfirm && afterConfirm(status.value, true);
        },
        () => afterConfirm && afterConfirm(status.value, false)
      );
    }
  });
};

/**
 * 执行编辑事件
 */
const handleDoEdit = (data: any) => {
  const elFormInstance = proFormTypeInstance.value?.proFormInstance?.elFormInstance;

  elFormInstance?.validate(async valid => {
    if (valid) {
      const {
        beforeEdit,
        apiFilterKeys,
        editFilterKeys,
        editApi,
        apiCarryParams,
        editCarryParams,
        afterEdit,
        cache,
        afterConfirm,
      } = props;

      data = (beforeEdit && (await beforeEdit(data))) || data;

      // 删除 Update 不允许传输的数据
      const filterParams = [...(apiFilterKeys || []), ...(editFilterKeys || [])];
      filterParams.forEach(item => delete data[item]);

      executeApi(
        editApi,
        { ...apiCarryParams, ...editCarryParams, ...data },
        "编辑成功！",
        "编辑失败！",
        async res => {
          afterEdit && (await afterEdit({ ...editCarryParams, data }, res));
          if (!cache) model.value = {};
          feedbackFormVisible.value = false;

          afterConfirm && afterConfirm(status.value, res);
        },
        () => afterConfirm && afterConfirm(status.value, false)
      );
    }
  });
};

/**
 * 执行删除事件
 */
const handleRemove = async (row: any) => {
  let data = deepClone(row);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  const {
    beforeConfirm,
    beforeRemove,
    apiFilterKeys,
    removeFilterKeys,
    removeApi,
    apiCarryParams,
    removeCarryParams,
    afterRemove,
    cache,
    afterConfirm,
  } = props;

  beforeConfirm && beforeConfirm("remove");
  data = (beforeRemove && (await beforeRemove(data))) || data;

  // 删除 Remove 不允许传输的数据
  const filterParams = [...(apiFilterKeys || []), ...(removeFilterKeys || [])];
  filterParams.forEach(item => delete data[item]);

  executeApi(
    removeApi,
    { ...apiCarryParams, ...removeCarryParams, ...data },
    "删除成功！",
    "删除失败！",
    async res => {
      afterRemove && (await afterRemove(model, res));
      if (!cache) model.value = {};
      afterConfirm && afterConfirm(status.value, res);
    },
    () => afterConfirm && afterConfirm(status.value, false)
  );
};

/**
 * 执行批量删除事件
 */
const handleRemoveBatch = async (selectedListIds: string[], selectedList: any, fallback: () => void) => {
  ElMessageBox.confirm(`删除所选信息?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  }).then(async () => {
    let data = { idList: selectedListIds, dataList: selectedList };

    const {
      beforeConfirm,
      beforeRemoveBatch,
      removeBatchApi,
      apiCarryParams,
      removeBatchCarryParams,
      afterRemoveBatch,
      cache,
      afterConfirm,
    } = props;

    beforeConfirm && beforeConfirm("deleteBatch");
    data = (beforeRemoveBatch && (await beforeRemoveBatch(data))) || data;

    executeApi(
      removeBatchApi,
      { ...apiCarryParams, ...removeBatchCarryParams, ...data },
      "删除成功！",
      "删除失败！",
      async res => {
        afterRemoveBatch && (await afterRemoveBatch(model, res));
        if (!cache) model.value = {};
        afterConfirm && afterConfirm(status.value, res);
        fallback();
      },
      () => afterConfirm && afterConfirm(status.value, false)
    );
  });
};

const executeApi = (
  api: undefined | ((params: any) => Promise<any>),
  params: any,
  success: string,
  failure: string,
  successCallBack?: (res: any) => void,
  failureCallBack?: (res: any) => void
) => {
  if (!api) return ElMessage.warning({ message: `${failure}没有提供对应接口`, plain: true });
  api(params)
    .then(res => {
      ElMessage.success({ message: success, plain: true });
      return successCallBack && successCallBack(res);
    })
    .catch(err => {
      return failureCallBack && failureCallBack(err);
    });
};

defineExpose({ handleAdd, handleEdit, handleRemove, handleRemoveBatch });
</script>

<template>
  <component
    :is="unref(type) === 'drawer' ? ProFormDrawer : ProFormDialog"
    ref="proFormTypeInstance"
    v-model:visible="feedbackFormVisible"
    v-model="model"
    :form="{ ...form, notCleanModelKeys, columns: newColumn }"
    @confirm="handleConfirm(model, status)"
    @cancel="feedbackFormVisible = false"
    v-bind="
      type === 'drawer'
        ? { drawer: { destroyOnClose: true, ...typeProps } }
        : { dialog: { destroyOnClose: true, ...typeProps } }
    "
  >
    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </component>
</template>
