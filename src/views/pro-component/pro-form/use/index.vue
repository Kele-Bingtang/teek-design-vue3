<script setup lang="tsx" name="UseProForm">
import type { ComponentSize, FormItemProp, InputInstance } from "element-plus";
import type { FormColumn, ElFormProps } from "@/components";
import { ref, reactive } from "vue";
import { ElRadio, ElMessageBox, ElMessage } from "element-plus";
import { ProForm, useProForm } from "@/components";

const { formRegister, formMethods } = useProForm();
const {
  setProps,
  delColumn,
  addColumn,
  setValues,
  setColumn,
  getElInstance,
  getElFormItemInstance,
  getElFormInstance,
  getFormModel,
} = formMethods;

const model = ref<Recordable>({});

// 表单整体配置项
const elFormProps: ElFormProps = {
  inline: false,
  labelPosition: "right",
  labelWidth: 120,
  disabled: false,
  labelSuffix: " :",
};

// 表单列配置项 (formItemProps 代表 item 配置项，attrs 代表 输入、选择框 配置项)
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
      default: () => <el-button type="primary">Click to upload</el-button>,
      tip: () => <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>,
    },
  },
]);

const changeCol = (col: boolean) => {
  setProps({
    flexLayout: col,
  });
};

const changeLabelWidth = (width: number | string) => {
  setProps({
    elFormProps: { labelWidth: width },
  });
};

const changeSize = (size: ComponentSize) => {
  setProps({
    elFormProps: { size },
  });
};
const changeDisabled = (bool: boolean) => {
  setProps({
    elFormProps: { disabled: bool },
  });
};

const changeColumn = (del: boolean) => {
  if (del) {
    delColumn("select");
  } else if (!del && columns[1].prop !== "select") {
    addColumn(
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
      1
    );
  }
};

const setValue = async (reset: boolean) => {
  const elFormInstance = await getElFormInstance();
  if (reset) {
    elFormInstance?.resetFields();
  } else {
    setValues({
      input: "输入框",
      select: "2",
      radio: "2",
      checkbox: ["1", "3"],
      datePicker: "2022-01-27",
      timeSelect: "17:00",
      field8: [
        {
          name: "element-plus-logo.svg",
          url: "https://element-plus.org/images/element-plus-logo.svg",
        },
        {
          name: "element-plus-logo2.svg",
          url: "https://element-plus.org/images/element-plus-logo.svg",
        },
      ],
    });
    const formData = await getFormModel();
    console.log(formData);
  }
};

const index = ref(7);

const setSelectLabel = () => {
  setColumn([
    {
      prop: "select",
      field: "label",
      value: `选择器 ${index.value}`,
    },
    {
      prop: "select",
      field: "options",
      value: [
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
  ]);
  index.value++;
};

const addFormItem = () => {
  if (index.value % 2 === 0) {
    addColumn({
      prop: `input${index.value}`,
      label: `输入框 ${index.value}`,
      el: "el-input",
    });
  } else {
    addColumn(
      {
        prop: `input${index.value}`,
        label: `输入框 ${index.value}`,
        el: "el-input",
      },
      index.value
    );
  }
  index.value++;
};

const formValidation = async () => {
  const elFormInstance = await getElFormInstance();
  elFormInstance?.validate(isValid => {
    console.log(isValid);
  });
};

const verifyReset = async () => {
  const elFormInstance = await getElFormInstance();
  elFormInstance?.resetFields();
};

const inoutFocus = async () => {
  const inputEl = (await getElInstance("input")) as InputInstance;
  inputEl?.focus();
};

const inoutValidation = async () => {
  const formItemProps = await getElFormItemInstance("input");
  const inputEl = (await getElInstance("input")) as InputInstance;
  inputEl?.focus();
  formItemProps?.validate("focus", (val: boolean) => {
    console.log(val);
  });
};

const formValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.log(prop, isValid, message);
};

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
    <el-card shadow="never" header="UseForm 操作">
      <el-space wrap>
        <el-button @click="changeCol(false)">禁用栅格</el-button>
        <el-button @click="changeCol(true)">使用栅格</el-button>
        <el-button @click="changeLabelWidth(150)">更改 labelWidth</el-button>
        <el-button @click="changeLabelWidth('auto')">还原 labelWidth</el-button>
        <el-button @click="changeSize('large')">更改 size</el-button>
        <el-button @click="changeSize('default')">还原 size</el-button>
        <el-button @click="changeDisabled(true)">禁用表单</el-button>
        <el-button @click="changeDisabled(false)">还原表单</el-button>
        <el-button @click="changeColumn(true)">删除选择器</el-button>
        <el-button @click="changeColumn(false)">添加选择器</el-button>
        <el-button @click="setValue(false)">设置表单值</el-button>
        <el-button @click="setValue(true)">还原表单值</el-button>
        <el-button @click="setSelectLabel">设置选择器 label</el-button>
        <el-button @click="addFormItem">添加子项</el-button>
        <el-button @click="formValidation">表单验证</el-button>
        <el-button @click="verifyReset">表单重置</el-button>
        <el-button @click="inoutFocus">输入框聚焦</el-button>
        <el-button @click="inoutValidation">输入框表单验证</el-button>
      </el-space>
    </el-card>

    <el-card>
      <ProForm :elFormProps="elFormProps" :columns v-model="model" @register="formRegister" @validate="formValidate" />
    </el-card>
    {{ model }}
  </el-space>
</template>
