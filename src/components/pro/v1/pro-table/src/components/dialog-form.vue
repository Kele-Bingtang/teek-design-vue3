<script setup lang="ts">
import type { DialogProps, FormInstance } from "element-plus";
import type { ProFormProps, FormColumn, ProFormInstance } from "@/components";
import { ref, computed, unref, useTemplateRef, inject } from "vue";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";
import { deepClone } from "@/common/utils";
import { ProForm, ProDialog } from "@/components";
import { tableEnumMapKey } from "../interface";

defineOptions({ name: "DialogForm" });

export type DialogStatus = "" | "edit" | "add" | "read";

export interface DialogFormColumnProps extends FormColumn {
  destroyIn?: Array<"add" | "edit">; // 是否销毁表单，类似于 v-if
  hiddenIn?: Array<"add" | "edit">; // 是否隐藏表单，类似于 v-show
  disabledIn?: Array<"add" | "edit">; // 是否禁用表单
}

export interface DialogFormProps<T = any> {
  formProps?: Omit<ProFormProps, "schema"> & {
    schema?: DialogFormColumnProps<T>[] | ComputedRef<DialogFormColumnProps<T>[]>;
  };
  dialog?: Partial<
    Omit<DialogProps, "modelValue" | "title" | "height"> & {
      title: string | ((model: any, status: DialogStatus) => string);
      fullscreen: boolean;
      height: string | number | ((model: any, status: DialogStatus) => string | number);
    }
  >; // el-dialog 配置项
  id?: string | string[]; // 数据主键。编辑时必传，默认 id
  cache?: boolean; // 是否缓存新增、编辑后遗留的数据
  addApi?: (params: any) => Promise<any>; // 新增接口
  addCarryParams?: Record<string, any>; // 新增时，额外添加的函数
  addFilterKeys?: string[]; // 新增时，过滤的参数
  editApi?: (params: any) => Promise<any>; // 编辑接口
  editCarryParams?: Record<string, any>; // 编辑时，额外添加的参数
  editFilterKeys?: string[]; // 编辑时，过滤的参数
  removeApi?: (params: any) => Promise<any>; // 删除接口
  removeCarryParams?: Record<string, any>; // 删除时，额外添加的参数
  removeFilterKeys?: string[]; // 删除时，过滤的参数
  removeBatchCarryParams?: Record<string, any>; // 批量删除时，额外添加的参数
  removeBatchFilterKeys?: string[]; // 批量删除时，过滤的参数
  removeBatchApi?: (params: any) => Promise<any>; // 批量删除接口
  apiFilterKeys?: string[]; // 新增、编辑、删除时，过滤的参数
  apiCarryParams?: Record<string, any>; // 新增、编辑、删除时，额外添加的参数
  clickAdd?: (model: Record<string, any>) => void | Promise<any> | any; // 点击新增按钮回调
  clickEdit?: (model: Record<string, any>) => void | Promise<any> | any; // 点击编辑按钮回调
  beforeAdd?: (model: Record<string, any>) => void | Promise<any> | any; // 新增前回调
  afterAdd?: (model: Record<string, any>, result: any) => void; // 新增后回调
  beforeEdit?: (model: Record<string, any>) => void | Promise<any> | any; // 编辑前回调
  afterEdit?: (model: Record<string, any>, result: any) => void; // 编辑后回调
  beforeRemove?: (model: Record<string, any>) => void | Promise<any> | any; // 删除前回调
  afterRemove?: (model: Record<string, any>, result: any) => void; // 删除后回调
  beforeRemoveBatch?: (model: Record<string, any>) => void | Promise<any> | any; // 批量删除前回调
  afterRemoveBatch?: (model: Record<string, any>, result: any) => void; // 批量删除后回调
  beforeConfirm?: (status: string) => void; // 确定按钮触发前回调
  afterConfirm?: (status: string, result: any) => void; // 确定按钮触发后回调
  disableAdd?: boolean; // 禁用新增按钮
  disableEdit?: boolean; // 禁用编辑按钮
  disableRemove?: boolean; // 禁用删除按钮
  disableRemoveBatch?: boolean; // 禁用批量删除按钮
  useAdd?: boolean; // 使用新增按钮
  useEdit?: boolean; // 使用编辑按钮
  useRemove?: boolean; // 使用删除按钮
  useRemoveBatch?: boolean; // 使用批量删除按钮
}

const props = defineProps<DialogFormProps>();
const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");
const dialogFormVisible = ref(false);

// 表单
const model = ref<Record<string, any>>({});
const status = ref<DialogStatus>("");

const enumMap = inject(tableEnumMapKey);

const dialogProps = computed(() => {
  const { dialog } = props;

  const title = typeof dialog?.title === "function" ? dialog?.title(model.value, status.value) : dialog?.title;
  const height = typeof dialog?.height === "function" ? dialog.height(model.value, status.value) : dialog?.height;
  return { ...dialog, title, height };
});

// 组装主键 id & ProForm 不过滤的 keys
const includeModelKeys = computed(() => {
  const ids = Array.isArray(props.id) ? props.id : [props.id || "id"];

  const { formProps } = props;
  return formProps?.includeModelKeys?.length ? [...formProps.includeModelKeys, ...ids] : ids;
});

/**
 * 表单配置项
 */
const newSchema = computed((): FormColumn[] | undefined => {
  // 目前 status 一变化，都走一遍循环，优化：可以利用 Map 存储有 show 的 column（存下标），然后监听 status，当 status 变化，则通过下标获取 column，将 hidden 设置为 true
  unref(props.formProps?.schema)?.forEach(column => {
    if (!column) return;
    const { destroyIn, hiddenIn, disabledIn } = column;

    if (Array.isArray(destroyIn)) {
      if (destroyIn.includes("add")) (column.destroy as boolean) = status.value === "add";
      else if (destroyIn.includes("edit")) (column.destroy as boolean) = status.value === "edit";
    }
    if (Array.isArray(hiddenIn)) {
      if (hiddenIn.includes("add")) (column.hidden as boolean) = status.value === "add";
      else if (hiddenIn.includes("edit")) (column.hidden as boolean) = status.value === "edit";
    }

    if (Array.isArray(disabledIn)) {
      if (disabledIn.includes("add")) (column.disabled as boolean) = status.value === "add";
      else if (disabledIn.includes("edit")) (column.disabled as boolean) = status.value === "edit";
    }
  });

  return props.formProps?.schema as FormColumn[];
});

/**
 * 触发新增事件
 */
const handleAdd = async (row?: any) => {
  const { cache, id = "id", clickAdd } = props;

  status.value = "add";
  proFormInstance.value?.form?.resetFields();
  // 过滤掉 Event 类型
  if (row && !(row instanceof Event)) model.value = deepClone(row);
  else if (!cache) model.value = {};
  else if (Array.isArray(id)) {
    id.forEach(key => {
      delete model.value[key];
    });
  } else id && delete model.value[id];
  clickAdd && (model.value = (await clickAdd(model.value)) ?? model.value);
  dialogFormVisible.value = true;
};

/**
 * 触发编辑事件
 */
const handleEdit = async (row: any) => {
  // 过滤掉 Event 类型
  if (row instanceof Event) return;

  const { clickEdit } = props;

  status.value = "edit";
  proFormInstance.value?.form?.resetFields();
  if (!(row instanceof Event)) model.value = deepClone(row);
  clickEdit && (model.value = (await clickEdit(model.value)) ?? model.value);
  dialogFormVisible.value = true;
};

/**
 * 点击保存事件
 */
const handleFormConfirm = (data: any, status: DialogStatus) => {
  const { beforeConfirm } = props;

  beforeConfirm && beforeConfirm(status);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  if (status === "add") handleDoAdd(data);
  else if (status === "edit") handleDoEdit(data);
};

/**
 * 执行新增事件
 */
const handleDoAdd = (data: any) => {
  const formRef = proFormInstance.value?.form as FormInstance;

  formRef.validate(async valid => {
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
          dialogFormVisible.value = false;
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
  const formRef = proFormInstance.value?.form as FormInstance;

  formRef.validate(async valid => {
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
          dialogFormVisible.value = false;
          // 回调
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
      apiFilterKeys,
      removeBatchFilterKeys,
      removeBatchApi,
      apiCarryParams,
      removeBatchCarryParams,
      afterRemoveBatch,
      cache,
      afterConfirm,
    } = props;

    beforeConfirm && beforeConfirm("deleteBatch");
    data = (beforeRemoveBatch && (await beforeRemoveBatch(data))) || data;

    // 删除 Remove 不允许传输的数据
    const filterParams = [...(apiFilterKeys || []), ...(removeBatchFilterKeys || [])];
    filterParams.forEach(item => delete data[item]);

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
  <ProDialog v-model="dialogFormVisible" draggable v-bind="dialogProps">
    <slot name="form">
      <ProForm
        v-if="formProps?.schema"
        ref="proFormInstance"
        v-bind="{ ...$attrs, ...formProps }"
        v-model="model"
        :schema="newSchema"
        :includeModelKeys="includeModelKeys"
        :enumMapProps="enumMap"
      >
        <template #operation v-if="$slots.formOperation">
          <slot name="formOperation" v-bind="model" />
        </template>
      </ProForm>
    </slot>

    <template #header="scope" v-if="$slots.dialogHeader">
      <slot name="dialogHeader" v-bind="{ ...model, ...scope }" />
    </template>

    <template #footer>
      <slot name="dialogFooter" v-bind="model">
        <slot name="footerExtraPre" v-bind="model" />
        <el-button @click="dialogFormVisible = !dialogFormVisible">取消</el-button>
        <el-button type="primary" @click="handleFormConfirm(model, status)">保存</el-button>
        <slot name="footerExtraPro" v-bind="model" />
      </slot>
    </template>
  </ProDialog>
</template>
