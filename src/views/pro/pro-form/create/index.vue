<script setup lang="tsx" name="CreateProForm">
import type { FormItemProp } from "element-plus";
import type { FormColumn, ElFormProps } from "@/components";
import { ref, reactive, onMounted } from "vue";
import { ElButton, ElRadio, ElMessageBox, ElMessage } from "element-plus";
import { useProForm } from "@/components";

const model1 = ref<Recordable>({});
const model2 = ref<Recordable>({});

const {
  createMethods: { createForm, createFormComponent },
} = useProForm();

/**
 * context 里有 slots 和 attrs，如果元素里有 slots 和 attrs，则必传
 */
const RenderProForm = (_: any, context: Recordable) => {
  return createFormComponent(
    {
      columns: columns as FormColumn[],
      modelValue: model1.value,
      elFormProps,
      onValidate: formValidate,
    },
    context
  );
};

onMounted(() => {
  createForm("proFormRef", {
    columns: columns as FormColumn[],
    modelValue: model2.value,
    elFormProps,
    onValidate: formValidate,
  });
});

const formValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.log(prop, isValid, message);
};

// 表单整体配置项
const elFormProps: ElFormProps = {
  inline: false,
  labelPosition: "right",
  labelWidth: 120,
  disabled: false,
  labelSuffix: " :",
};

const columns = reactive<FormColumn[]>([
  {
    label: "使用 ProForm",
    prop: "input",
    el: "ElDivider",
  },
  {
    formItemProps: { required: true },
    label: "输入框",
    prop: "input",
    el: "ElInput",
  },
  {
    formItemProps: { required: true },
    label: "选择器",
    prop: "select",
    el: "el-select",
    defaultValue: "1",
    options: [
      {
        label: "option1",
        value: "1",
      },
      {
        label: "option2",
        value: "2",
      },
    ],
  },
  {
    prop: "radio",
    label: "单选框",
    el: "el-radio-group",
    defaultValue: "1",
    elSlots: {
      default: ({ options }) => {
        return options.map(option => {
          return (
            <ElRadio disabled={option.disabled} label={option.label} value={option.value} key={option.value}></ElRadio>
          );
        });
      },
    },
    options: [
      {
        label: "option-1",
        value: "1",
      },
      {
        label: "option-2",
        value: "2",
      },
    ],
  },
  {
    prop: "checkbox",
    label: "多选框",
    el: "el-checkbox-group",
    defaultValue: ["2"],
    options: [
      {
        label: "option-1",
        value: "1",
      },
      {
        label: "option-2",
        value: "2",
      },
      {
        label: "option-3",
        value: "3",
      },
    ],
  },
  {
    label: "日期选择器",
    prop: "datePicker",
    el: "el-date-picker",
    elProps: { type: "date" },
  },
  {
    label: "时间选择器",
    prop: "timeSelect",
    el: "el-time-select",
  },
  {
    label: "树形选择",
    prop: "treeSelect",
    el: "el-tree-select",
    options: () => getTreeSelectData(), // 模拟远程获取数据
  },
  {
    label: "上传",
    prop: "upload",
    el: "el-upload",
    defaultValue: [
      {
        name: "element-plus-logo.svg",
        url: "https://element-plus.org/images/element-plus-logo.svg",
      },
      {
        name: "element-plus-logo2.svg",
        url: "https://element-plus.org/images/element-plus-logo.svg",
      },
    ],
    elProps: {
      limit: 3,
      action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
      multiple: true,
      onPreview: uploadFile => {
        console.log(uploadFile);
      },
      onRemove: file => {
        console.log(file);
      },
      beforeRemove: uploadFile => {
        return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
          () => true,
          () => false
        );
      },
      onExceed: (files, uploadFiles) => {
        ElMessage.warning(
          `The limit is 3, you selected ${files.length} files this time, add up to ${
            files.length + uploadFiles.length
          } totally`
        );
      },
    },
    elSlots: {
      default: () => <ElButton type="primary">Click to upload</ElButton>,
      tip: () => <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>,
    },
  },
]);

const treeSelectData = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [
          {
            value: "1-1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [
          {
            value: "2-1-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [
          {
            value: "2-2-1",
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [
          {
            value: "3-1-1",
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [
          {
            value: "3-2-1",
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];

// 模拟远程加载
const getTreeSelectData = (): Promise<typeof treeSelectData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(treeSelectData);
    }, 3000);
  });
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="createFormComponent 函数式创建 Template 组件">
      <RenderProForm></RenderProForm>

      {{ model1 }}
    </el-card>

    <el-card shadow="never" header="createForm 函数式动态渲染组件到指定元素">
      <div ref="proFormRef"></div>

      {{ model2 }}
    </el-card>
  </el-space>
</template>
