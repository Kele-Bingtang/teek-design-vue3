<script setup lang="ts">
import { Select, CloseBold } from "@element-plus/icons-vue";
import { type StyleValue } from "vue";

export interface Step {
  title: string;
  status: "success" | "active" | "wait" | "error";
  description?: string;
  icon?: string;
  isSubStep?: boolean;
  nodeIndex?: number | string;
}

interface StepsProps {
  type: "basic" | "align-top" | "custom-icon" | "column" | "dotted-row" | "dotted-column";
  data?: Step[];
}

const props = withDefaults(defineProps<StepsProps>(), { data: () => [] });

defineOptions({ name: "elCustomSteps" });
const statusBackground: any = { success: "#d9e6ff", active: "#395ae3", wait: "#f0f0f2", error: "#ef4a38" };
const titleColor: any = { success: "#20222b", active: "#395ae3", wait: "#20222b", error: "#ef4a38" };
const calcWidth = (item: Step) => {
  let result = "28px";
  if (item.isSubStep) {
    result = ["success", "error"].includes(item.status) ? "16px" : "12px";
  }
  return result;
};

const stepClass = (item: Step, index: number) => {
  const classes: string[] = ["step"];
  if (item.isSubStep) {
    classes.push("sub-step");
    if (["active", "error"].includes(item.status)) classes.push("activated");
  }
  if (index === props.data.length - 1) {
    classes.push("no-grow");
  }
  return classes;
};

const getStepLineStyle = (item: Step, index: number): StyleValue => {
  // 默认情况
  const result: StyleValue = {
    position: "absolute",
    top: "14px",
    left: "40px",
    width: "calc(100% - 52px)",
    height: "0px",
    borderTop: "1px solid",
    borderColor: item.status === "success" ? "#395ae3" : "#e4e5eb",
  };

  // subStep + normal 正常节点左右有 12px 边距，子节点完成状态、错误状态宽度为 16px, 进行、等待状态宽度为 12px，无边距
  if (item.isSubStep && !props.data[index + 1].isSubStep) {
    result.left = "16px";
    result.width = "calc(100% - 28px)";
    if (["active", "wait"].includes(item.status)) {
      result.left = "12px";
      result.width = "calc(100% - 24px)";
    }
  } else if (item.isSubStep && props.data[index + 1].isSubStep) {
    // subStep + subStep
    result.left = "16px";
    result.width = "calc(100% - 16px)";
    if (["active", "wait"].includes(item.status)) {
      result.left = "12px";
      result.width = "calc(100% - 12px)";
    }
  } else if (!item.isSubStep && props.data[index + 1].isSubStep) {
    // normal + subStep
    result.width = "calc(100% - 40px)";
  }
  return result;
};
</script>

<template>
  <div style="width: 100%">
    <!-- 顶部对齐式 -->
    <div v-if="type == 'align-top'" :style="{ display: 'flex' }" class="custom-steps">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="step"
        style="display: flex"
        :class="index === data.length - 1 ? 'no-grow' : ''"
      >
        <div
          :style="{
            position: 'relative',
            width: '28px',
            height: '28px',
            lineHeight: '28px',
            borderRadius: '50%',
            textAlign: 'center',
            fontFamily: 'Arial',
            background: statusBackground[item.status],
          }"
        >
          <el-icon style="margin-top: 7px" color="#395ae3" v-if="item.status === 'success'"><Select /></el-icon>
          <el-icon style="margin-top: 7px" color="#ffffff" v-else-if="item.status === 'error'"><CloseBold /></el-icon>
          <span v-else :style="{ color: item.status === 'active' ? '#ffffff' : '#4d505e' }">{{ index + 1 }}</span>
          <div
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              fontWeight: item.status === 'active' || item.status === 'error' ? 700 : 400,
              color: titleColor[item.status],
              position: 'absolute',
              left: '36px',
              bottom: 0,
            }"
          >
            {{ item.title }}
          </div>
          <div
            v-if="item.description"
            class="description"
            :style="{ position: 'absolute', left: `50%`, bottom: '-32px', transform: 'translateX(-50%)' }"
          >
            {{ item.description }}
          </div>
        </div>
        <div
          v-if="index < data.length - 1"
          :style="{
            position: 'absolute',
            top: '14px',
            left: '90px',
            width: 'calc(100% - 102px)',
            height: '0px',
            borderTop: '1px solid',
            borderColor: item.status === 'success' ? '#395ae3' : '#e4e5eb',
          }"
        ></div>
      </div>
    </div>

    <!-- 自定义图标 -->
    <div v-else-if="type == 'custom-icon'" :style="{ display: 'flex' }" class="custom-steps">
      <div v-for="(item, index) in data" :key="index" class="step" :class="index === data.length - 1 ? 'no-grow' : ''">
        <div
          :style="{
            position: 'relative',
            width: '28px',
            height: '28px',
            lineHeight: '28px',
            borderRadius: '50%',
            textAlign: 'center',
            fontFamily: 'Arial',
            background: statusBackground[item.status],
          }"
        >
          <el-icon
            style="margin-top: 7px"
            :color="item.status === 'success' ? '#395ae3' : item.status === 'active' ? '#ffffff' : '#4d505e'"
          >
            <component :is="item.icon" />
          </el-icon>
          <div
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              fontWeight: item.status === 'active' || item.status === 'error' ? 700 : 400,
              color: titleColor[item.status],
              position: 'absolute',
              left: `50%`,
              bottom: '-30px',
              transform: 'translateX(-50%)',
            }"
          >
            {{ item.title }}
          </div>
          <div
            v-if="item.description"
            class="description"
            :style="{ position: 'absolute', left: `50%`, bottom: '-54px', transform: 'translateX(-50%)' }"
          >
            {{ item.description }}
          </div>
        </div>
        <div
          v-if="index < data.length - 1"
          :style="{
            position: 'absolute',
            top: '14px',
            left: '40px',
            width: 'calc(100% - 52px)',
            height: '0px',
            borderTop: '1px solid',
            borderColor: item.status === 'success' ? '#395ae3' : '#e4e5eb',
          }"
        ></div>
      </div>
    </div>

    <!-- 竖向步骤条 -->
    <div v-else-if="type == 'column'" class="custom-steps">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="step"
        style="display: flex; margin-bottom: 84px"
        :class="index === data.length - 1 ? 'no-grow' : ''"
      >
        <div
          :style="{
            position: 'relative',
            width: '28px',
            height: '28px',
            lineHeight: '28px',
            borderRadius: '50%',
            textAlign: 'center',
            fontFamily: 'Arial',
            background: statusBackground[item.status],
          }"
        >
          <el-icon style="margin-top: 7px" color="#395ae3" v-if="item.status === 'success'"><Select /></el-icon>
          <el-icon style="margin-top: 7px" color="#ffffff" v-else-if="item.status === 'error'"><CloseBold /></el-icon>
          <span v-else :style="{ color: item.status === 'active' ? '#ffffff' : '#4d505e' }">{{ index + 1 }}</span>
          <div
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              fontWeight: item.status === 'active' || item.status === 'error' ? 700 : 400,
              color: titleColor[item.status],
              position: 'absolute',
              left: `40px`,
              bottom: 0,
            }"
          >
            {{ item.title }}
          </div>
          <div
            v-if="item.description"
            class="description"
            :style="{ position: 'absolute', left: `40px`, bottom: '-24px' }"
          >
            {{ item.description }}
          </div>
        </div>
        <div
          v-if="index < data.length - 1"
          :style="{
            position: 'absolute',
            top: '40px',
            left: '14px',
            width: '0px',
            height: '60px',
            borderLeft: '1px solid',
            borderColor: item.status === 'success' ? '#395ae3' : '#e4e5eb',
          }"
        ></div>
      </div>
    </div>

    <!-- 点状步骤条--横向 -->
    <div v-else-if="type == 'dotted-row'" :style="{ display: 'flex' }" class="custom-steps">
      <div v-for="(item, index) in data" :key="index" class="step" :class="index === data.length - 1 ? 'no-grow' : ''">
        <div
          :style="{
            position: 'relative',
            borderRadius: '50%',
            textAlign: 'center',
            fontFamily: 'Arial',
            width: item.status === 'active' || item.status === 'error' ? '10px' : '8px',
            height: item.status === 'active' || item.status === 'error' ? '10px' : '8px',
            lineHeight: item.status === 'active' || item.status === 'error' ? '10px' : '8px',
            background: item.status === 'wait' ? '#b7b9c4' : item.status === 'error' ? '#ef4a38' : '#395ae3',
          }"
        >
          <div
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              fontWeight: item.status === 'active' || item.status === 'error' ? 700 : 400,
              color: titleColor[item.status],
              position: 'absolute',
              left: `50%`,
              bottom: '-30px',
              transform: 'translateX(-50%)',
            }"
          >
            {{ item.title }}
          </div>
          <div
            v-if="item.description"
            class="description"
            :style="{ position: 'absolute', left: `50%`, bottom: '-54px', transform: 'translateX(-50%)' }"
          >
            {{ item.description }}
          </div>
        </div>
        <div
          v-if="index < data.length - 1"
          :style="{
            position: 'absolute',
            top: '3px',
            left: '20px',
            width: 'calc(100% - 32px)',
            height: '0px',
            borderTop: '1px solid',
            borderColor: item.status === 'success' ? '#395ae3' : '#e4e5eb',
          }"
        ></div>
      </div>
    </div>

    <!-- 点状步骤条--竖向 -->
    <div v-else-if="type == 'dotted-column'" class="custom-steps">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="step"
        style="display: flex; margin-bottom: 84px"
        :class="index === data.length - 1 ? 'no-grow' : ''"
      >
        <div
          :style="{
            position: 'relative',
            borderRadius: '50%',
            textAlign: 'center',
            fontFamily: 'Arial',
            width: item.status === 'active' || item.status === 'error' ? '10px' : '8px',
            height: item.status === 'active' || item.status === 'error' ? '10px' : '8px',
            lineHeight: item.status === 'active' || item.status === 'error' ? '10px' : '8px',
            background: item.status === 'wait' ? '#b7b9c4' : item.status === 'error' ? '#ef4a38' : '#395ae3',
          }"
        >
          <div
            v-if="index < data.length - 1"
            :style="{
              position: 'absolute',
              top: '20px',
              left: '3px',
              width: '0px',
              height: '60px',
              borderLeft: '1px solid',
              borderColor: item.status === 'success' ? '#395ae3' : '#e4e5eb',
            }"
          ></div>
          <div
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              fontWeight: item.status === 'active' || item.status === 'error' ? 700 : 400,
              color: titleColor[item.status],
              position: 'absolute',
              left: `20px`,
              top: '0px',
            }"
          >
            {{ item.title }}
          </div>
          <div
            v-if="item.description"
            class="description"
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              color: '#848691',
              position: 'absolute',
              left: `20px`,
              top: '24px',
            }"
          >
            {{ item.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- 基本用法/带描述信息 -->
    <div v-else :style="{ display: 'flex' }" class="custom-steps">
      <div v-for="(item, index) in data" :key="index" :class="stepClass(item, index)">
        <div
          :style="{
            position: 'relative',
            width: calcWidth(item),
            height: calcWidth(item),
            lineHeight: calcWidth(item),
            borderRadius: '50%',
            textAlign: 'center',
            fontFamily: 'Arial',
            background: statusBackground[item.status],
          }"
        >
          <el-icon style="margin-top: 7px" color="#395ae3" v-if="item.status === 'success'"><Select /></el-icon>
          <el-icon style="margin-top: 7px" color="#ffffff" v-else-if="item.status === 'error'"><CloseBold /></el-icon>
          <span v-else-if="!item.isSubStep" :style="{ color: item.status === 'active' ? '#ffffff' : '#4d505e' }">
            {{ item.nodeIndex || index + 1 }}
          </span>
          <div
            class="title"
            :style="{
              whiteSpace: 'nowrap',
              fontFamily: 'Microsoft YaHei',
              fontWeight: item.status === 'active' || item.status === 'error' ? 700 : 400,
              color: titleColor[item.status],
              position: 'absolute',
              left: `50%`,
              bottom: '-30px',
              transform: 'translateX(-50%)',
            }"
          >
            {{ item.title }}
          </div>
          <div
            v-if="item.description"
            class="description"
            :style="{ position: 'absolute', left: `50%`, bottom: '-54px', transform: 'translateX(-50%)' }"
          >
            {{ item.description }}
          </div>
        </div>
        <div v-if="index < data.length - 1" :style="getStepLineStyle(item, index)"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-steps {
  width: 100%;
  font-size: 1rem;

  .step {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;

    .description {
      color: #848691;
      white-space: nowrap;
    }
  }

  .sub-step {
    .#{$el-namespace}-icon {
      width: 7px;
      height: 3px;
    }

    .title,
    .description {
      display: none;
    }

    &:hover {
      cursor: pointer;

      .title,
      .description {
        display: block;
      }
    }
  }

  .activated .title,
  .description {
    display: block;
  }

  .no-grow {
    flex-grow: 0;
  }
}
</style>
