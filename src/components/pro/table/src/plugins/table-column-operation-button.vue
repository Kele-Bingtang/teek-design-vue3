<script setup lang="ts">
import type { ElMessageBoxProps, OperationButtonEmits, OperationButtonProps } from "../types";
import { computed, toRaw, toValue } from "vue";
import { ElPopconfirm, ElTooltip, ElIcon, ElButton, ElLink, ElMessageBox } from "element-plus";
import { toCamelCase } from "@/components/pro/helper";
import { OperationConfirmEl, OperationEl } from "../helper";

defineOptions({ name: "TableColumnOperationButton" });

const props = withDefaults(defineProps<OperationButtonProps>(), {
  text: "",
  el: "ElLink",
  elProps: undefined,
  icon: undefined,
  tooltipProps: undefined,
  confirmEl: undefined,
  confirmProps: undefined,
});

const emits = defineEmits<OperationButtonEmits>();

const defaultTitle = "温馨提示";
const defaultMessage = "确定执行本次操作?";

const icon = computed(() => toRaw(props.icon));
const confirmElValue = computed(() => toCamelCase(toValue(props.confirmEl)));

const handleButtonClick = (event: MouseEvent) => {
  emits("click", event);

  const { confirmProps } = props;

  if (confirmElValue.value === OperationConfirmEl.ElMessageBox) {
    const { title = defaultTitle, message = defaultMessage, options, appContext } = confirmProps as ElMessageBoxProps;

    ElMessageBox.confirm(message, title, { type: "warning", ...options }, appContext)
      .then(() => emits("confirm", event))
      .catch(() => emits("cancel", event));
  }
};

const handleConfirm = (event: MouseEvent) => {
  emits("confirm", event);
};

const handleCancel = (event: MouseEvent) => {
  emits("cancel", event);
};
</script>

<template>
  <!-- Icon 类型按钮 -->
  <el-tooltip v-if="el === OperationEl.ElIcon" placement="top" :content="text" v-bind="tooltipProps">
    <!-- 带二次确认的图标按钮 -->
    <span v-if="confirmElValue === OperationConfirmEl.ElPopconfirm" class="el-icon">
      <el-popconfirm
        trigger="click"
        :title="defaultMessage"
        v-bind="confirmProps"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #reference>
          <el-icon size="16" v-bind="elProps" @click="handleButtonClick">
            <component v-if="icon" :is="icon" />
          </el-icon>
        </template>
      </el-popconfirm>
    </span>

    <!-- 普通图标按钮 -->
    <el-icon v-else size="16" v-bind="elProps" @click="handleButtonClick">
      <component v-if="icon" :is="icon" />
    </el-icon>
  </el-tooltip>

  <!-- 按钮/链接类型 -->
  <template v-else>
    <!-- 带二次确认的按钮 -->
    <el-popconfirm
      v-if="confirmElValue === OperationConfirmEl.ElPopconfirm"
      trigger="click"
      :title="defaultMessage"
      v-bind="confirmProps"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #reference>
        <component
          :is="el === OperationEl.ElButton ? ElButton : ElLink"
          size="small"
          :href="el === OperationEl.ElLink ? 'javascript:;' : undefined"
          v-bind="elProps"
          @click="handleButtonClick"
        >
          {{ text }}
        </component>
      </template>
    </el-popconfirm>

    <!-- 普通按钮 -->
    <component
      v-else
      :is="el === OperationEl.ElButton ? ElButton : ElLink"
      size="small"
      :href="el === OperationEl.ElLink ? 'javascript:;' : undefined"
      v-bind="elProps"
      @click="handleButtonClick"
    >
      {{ text }}
    </component>
  </template>
</template>
