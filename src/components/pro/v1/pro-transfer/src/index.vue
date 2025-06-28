<script setup lang="ts">
import { ElTransfer } from "element-plus";
import { computed } from "vue";

defineOptions({ name: "ProTransfer" });

const transferInstance = useTemplateRef("transferInstance");

const clearQuery = computed(() => transferInstance.value?.clearQuery);

// 抛出实例
defineExpose({ el: transferInstance, clearQuery });
</script>

<template>
  <el-transfer ref="transferInstance" v-bind="$attrs">
    <template v-for="(_value, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </el-transfer>
</template>

<style lang="scss" scoped>
:deep(.el-transfer-panel) {
  width: 240px;

  // 头部
  .el-transfer-panel__header {
    background-color: #f5f5f5;
    border-color: var(--el-color-regular-4);

    .el-checkbox__label {
      font-size: 1rem;
      font-weight: 700;
      color: var(--el-color-regular-9);

      span {
        font-size: 1rem;
        color: var(--el-color-regular-7);
      }
    }
  }

  // 内容区域
  .el-transfer-panel__body {
    border-color: var(--el-color-regular-4);

    // 搜索
    .el-input {
      padding: 16px 16px 10px;
    }

    .el-input__wrapper {
      height: 32px;

      .el-input__inner {
        font-size: 1rem;
      }

      .el-icon {
        color: var(--el-color-regular-7);
      }
    }

    // 列表
    .el-transfer-panel__list {
      &::-webkit-scrollbar {
        display: none;
      }

      .el-checkbox {
        display: flex;
        min-height: 32px;
        padding: 0 16px;
        margin: 0;
        color: var(--el-color-regular-9);

        .el-checkbox__label {
          padding-left: 24px;
          font-size: 1rem;
        }

        &:hover {
          background-color: var(--el-color-blue-1);
        }

        &.is-disabled {
          &:hover {
            background-color: transparent;
          }

          .el-checkbox__inner {
            background: var(--el-color-regular-2);
            border-color: var(--el-color-regular-5);
          }
        }

        &.is-checked {
          font-weight: 700;

          .el-checkbox__label {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  // 尾部
  .el-transfer-panel__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    border: 1px solid var(--el-color-regular-4);
  }
}

// 复选框
:deep(.el-checkbox__inner) {
  border-color: var(--el-color-regular-5);
  border-radius: 2px;
}

// 箭头按钮
:deep(.el-transfer__buttons) {
  display: inline-flex;
  flex-direction: column-reverse;
  padding: 0 8px;

  .el-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 8px;
    margin: 0;
    background: var(--el-color-regular-1);
    border: 1px solid;
    border-color: var(--el-color-regular-7);
    border-radius: 4px;

    .el-icon {
      color: var(--el-color-regular-9);
    }

    &:last-child {
      margin-bottom: 8px;
    }

    &:hover {
      border-color: var(--el-color-primary-light-7);

      .el-icon {
        color: var(--el-color-primary-light-7);
      }
    }

    &:active {
      border-color: var(--el-color-primary-dark-2);

      .el-icon {
        color: var(--el-color-primary-dark-2);
      }
    }

    &.is-disabled {
      background: var(--el-color-regular-2);
      border-color: var(--el-color-regular-5);

      .el-icon {
        color: var(--el-color-regular-6);
      }
    }
  }
}

// 空状态
:deep(.el-transfer-panel__empty) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 115px;
  height: 100px;
  font-size: 1rem;
  line-height: 190px;
  background: url("/assets/images/noData.png") no-repeat top center;
  background-size: 88px 80px;
  transform: translate(-50%, -50%);
}
</style>
