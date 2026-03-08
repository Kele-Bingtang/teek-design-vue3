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

const model = ref<Recordable>({});
const feedbackFormVisible = ref(false);
const status = ref<FeedbackStatus>("");

const proFormTypeInstance = useTemplateRef<ProFormDialogInstance | ProFormDrawerInstance>("proFormTypeInstance");

const feedbackProps = computed(() => {
  const { feedbackProps } = props;

  const title = isFunction(feedbackProps?.title)
    ? feedbackProps.title(model.value, status.value)
    : feedbackProps?.title;
  const height = isFunction(feedbackProps?.height)
    ? feedbackProps.height(model.value, status.value)
    : feedbackProps?.height;
  return { ...feedbackProps, title, height };
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
const handleAdd = async <T extends Recordable = any>(row?: T) => {
  const { cache, id, clickAdd } = props;

  status.value = "add";
  proFormTypeInstance.value?.proFormInstance?.elFormInstance?.resetFields();
  // 过滤掉 Event 类型
  if (row && !(row instanceof Event)) model.value = deepClone(row);
  // 如果不缓存，则清空 model
  else if (!cache) model.value = {};
  // 删除主键 id
  else if (isArray(id)) {
    id.forEach(key => {
      delete model.value[key];
    });
  } else id && delete model.value[id];

  const result = await clickAdd?.(model.value);
  // 返回值为 false，则不显示表单
  if (result === false) return;
  model.value = result ?? model.value;

  feedbackFormVisible.value = true;
};

/**
 * 触发编辑事件
 */
const handleEdit = async <T extends Recordable = any>(row: T) => {
  // 过滤掉 Event 类型
  if (row instanceof Event) return;

  const { clickEdit } = props;

  status.value = "edit";
  proFormTypeInstance.value?.proFormInstance?.elFormInstance?.resetFields();
  if (!(row instanceof Event)) model.value = deepClone(row);

  const result = await clickEdit?.(model.value);
  // 返回值为 false，则不显示表单
  if (result === false) return;
  model.value = result ?? model.value;

  feedbackFormVisible.value = true;
};

/**
 * 点击保存事件
 */
const handleConfirm = <T extends Recordable = any>(data: T, status: FeedbackStatus) => {
  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._options;

  if (status === "add") handleDoAdd(data);
  else if (status === "edit") handleDoEdit(data);
};

/**
 * 执行新增事件
 */
const handleDoAdd = <T extends Recordable = any>(data: T) => {
  const elFormInstance = proFormTypeInstance.value?.proFormInstance?.elFormInstance;

  elFormInstance?.validate(async valid => {
    if (valid) {
      const {
        cache,
        addApi,
        apiFilterKeys,
        addFilterKeys,
        apiCarryParams,
        addCarryParams,
        onAdd,
        afterConfirm,
        requestFailed,
      } = props;

      // 删除 Add 不允许传输的数据
      const filterParams = [...(apiFilterKeys || []), ...(addFilterKeys || [])];
      filterParams.forEach(item => delete data[item]);

      if (onAdd) return onAdd(data);

      // 执行新增接口
      executeApi(
        addApi,
        { ...apiCarryParams, ...addCarryParams, ...data },
        "添加成功！",
        "添加失败！",
        async () => {
          if (!cache) model.value = {};
          feedbackFormVisible.value = false;
          afterConfirm?.(status.value, true);
        },
        err => {
          afterConfirm?.(status.value, false);
          requestFailed?.(err, model.value);
        }
      );
    }
  });
};

/**
 * 执行编辑事件
 */
const handleDoEdit = <T extends Recordable = any>(data: T) => {
  const elFormInstance = proFormTypeInstance.value?.proFormInstance?.elFormInstance;

  elFormInstance?.validate(async valid => {
    if (valid) {
      const {
        cache,
        editApi,
        apiFilterKeys,
        editFilterKeys,
        apiCarryParams,
        editCarryParams,
        onEdit,
        requestFailed,
        afterConfirm,
      } = props;

      // 删除 Update 不允许传输的数据
      const filterParams = [...(apiFilterKeys || []), ...(editFilterKeys || [])];
      filterParams.forEach(item => delete data[item]);

      if (onEdit) return onEdit?.(data);

      executeApi(
        editApi,
        { ...apiCarryParams, ...editCarryParams, ...data },
        "编辑成功！",
        "编辑失败！",
        async () => {
          if (!cache) model.value = {};
          feedbackFormVisible.value = false;
          afterConfirm?.(status.value, true);
        },
        err => {
          afterConfirm?.(status.value, false);
          requestFailed?.(err, model.value);
        }
      );
    }
  });
};

/**
 * 执行删除事件
 */
const handleRemove = async <T extends Recordable = any>(row: T, fallback: (result: any) => void) => {
  const {
    cache,
    removeApi,
    apiFilterKeys,
    removeFilterKeys,
    apiCarryParams,
    removeCarryParams,
    onRemove,
    afterConfirm,
    requestFailed,
  } = props;

  const data = deepClone(row);
  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  // 删除 Remove 不允许传输的数据
  const filterParams = [...(apiFilterKeys || []), ...(removeFilterKeys || [])];
  filterParams.forEach(item => delete data[item]);

  if (onRemove) return onRemove(data);

  executeApi(
    removeApi,
    { ...apiCarryParams, ...removeCarryParams, ...data },
    "删除成功！",
    "删除失败！",
    async res => {
      if (!cache) model.value = {};
      afterConfirm?.(status.value, true);
      fallback(res);
    },
    err => {
      afterConfirm?.(status.value, false);
      requestFailed?.(err, model.value);
    }
  );
};

/**
 * 执行批量删除事件
 */
const handleRemoveBatch = async (selectedListIds: string[], selectedList: any, fallback: (result: any) => void) => {
  const { clickRemoveBatch } = props;

  let data = { idList: selectedListIds, dataList: selectedList };

  const result = await clickRemoveBatch?.(data);
  if (result === false) return;
  data = result ?? data;

  ElMessageBox.confirm(`删除所选信息?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  }).then(async () => {
    const {
      cache,
      removeBatchApi,
      apiCarryParams,
      removeBatchCarryParams,
      onRemoveBatch,
      requestFailed,
      afterConfirm,
    } = props;

    if (onRemoveBatch) return onRemoveBatch(data);

    executeApi(
      removeBatchApi,
      { ...apiCarryParams, ...removeBatchCarryParams, ...data },
      "删除成功！",
      "删除失败！",
      async res => {
        if (!cache) model.value = {};
        fallback(res);
      },
      err => {
        afterConfirm?.(status.value, false);
        requestFailed?.(err, model.value);
      }
    );
  });
};

const executeApi = (
  api: undefined | ((params: any) => Promise<any>),
  params: Recordable,
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
        ? { drawer: { destroyOnClose: true, ...feedbackProps } }
        : { dialog: { destroyOnClose: true, ...feedbackProps } }
    "
  >
    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </component>
</template>
