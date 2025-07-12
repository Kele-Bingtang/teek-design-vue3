<script setup lang="tsx">
import type { CalendarDateType, CalendarInstance } from "element-plus";
import type { CalendarScheduleEmits, CalendarScheduleProps, ScheduleData, ScheduleFormModel } from "./types";
import { dayjs } from "element-plus";
import { Plus, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useDialog, PointTag } from "@/components";
import ScheduleForm from "./schedule-form.vue";

const ns = useNamespace("calendar-schedule");

const props = withDefaults(defineProps<CalendarScheduleProps>(), {
  data: () => ({}),
});

const emits = defineEmits<CalendarScheduleEmits>();

const calendarInstance = useTemplateRef<CalendarInstance>("calendarInstance");

// 当前日历选择的日期
const currentTime = defineModel<Date>({ default: () => new Date() });
// 日程表单模型
const scheduleModel = defineModel<ScheduleFormModel>("form", { default: () => ({}) });

const { open } = useDialog();

// 当前日期的日程列表
const currentScheduleList = computed(() => {
  const res = props.data[dayjs(currentTime.value).format("YYYY-MM-DD")] || [];
  return res.sort((a, b) => {
    return a.startTime > b.startTime ? 1 : -1;
  });
});

/**
 * 日历切换日期
 */
const selectDate = (val: CalendarDateType) => {
  calendarInstance.value?.selectDate(val);
};

/**
 * 判断传入的日期字符串（YYYY-MM-DD）是否为今天
 */
const isToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const todayStr = dayjs().format("YYYY-MM-DD");

  return dateStr === todayStr;
};

/**
 * 新增日程
 */
const handleAddSchedule = () => {
  emits("open", undefined, "add");

  open({
    title: "新增日程",
    width: 550,
    height: 250,
    render: () => <ScheduleForm v-model={scheduleModel.value} />,
    onConfirm: async () => {
      const startTime = scheduleModel.value.time[0];
      const endTime = scheduleModel.value.time[1];

      // 判断是否与现有日程冲突
      const conflictSchedule = props.data[scheduleModel.value.date]?.find(item => {
        const itemStartTime = item.startTime;
        const itemEndTime = item.endTime;

        /**
         * 1. 判断新增的开始和结束是否在现有日程的开始和结束时间之间
         * 2. 判断新增的开始和结束是否包含现有日程的开始和结束时间
         */
        return (
          (startTime >= itemStartTime && startTime < itemEndTime) ||
          (endTime > itemStartTime && endTime <= itemEndTime) ||
          (startTime <= itemStartTime && endTime >= itemEndTime)
        );
      });

      if (conflictSchedule) {
        emits("validate", false, conflictSchedule);
        return false;
      } else emits("validate", true);

      const newSchedule = { ...scheduleModel.value, startTime, endTime, id: useId() };

      emits("confirm", newSchedule);
    },
    onCancel: () => {
      emits("cancel");
    },
  });
};

const handleClickSchedule = (item: ScheduleData) => {
  emits("open", item, "edit");

  const formModel = {
    title: item.title,
    date: dayjs(currentTime.value).format("YYYY-MM-DD"),
    time: [item.startTime, item.endTime],
    location: item.location,
  };

  open({
    title: "编辑日程",
    width: 550,
    height: 250,
    showFooter: false,
    render: () => <ScheduleForm v-model={formModel} disabled={true} />,
  });
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>会议日程</h2>
    </div>

    <el-calendar ref="calendarInstance" v-model="currentTime">
      <template #header="{ date }">
        <div :class="ns.e('switch-icon')" @click="selectDate('prev-month')">
          <Icon :icon="ArrowLeft" />
        </div>

        <span class="date">{{ date }}</span>

        <div :class="ns.e('switch-icon')" @click="selectDate('next-month')">
          <Icon :icon="ArrowRight" />
        </div>
      </template>

      <template #date-cell="{ data }">
        <div class="flx-column-center">
          <span :class="[ns.is('today', isToday(data.day))]" class="picked">
            {{ data.day.split("-").slice(2).join() }}
          </span>
          <PointTag v-if="props.data[data.day]" :size="6" :offset="0" class="dot" />
        </div>
      </template>
    </el-calendar>

    <div :class="ns.e('schedule')">
      <div :class="ns.e('schedule-header')" class="flx-align-center-between">
        <span>我的日程({{ currentScheduleList.length }})</span>
        <el-button type="primary" link @click="handleAddSchedule" :icon="Plus">新增日程</el-button>
      </div>

      <el-timeline v-if="currentScheduleList.length" :class="ns.e('schedule-list')">
        <el-timeline-item
          v-for="item in currentScheduleList"
          :key="item.id"
          :timestamp="item.startTime"
          :hide-timestamp="true"
          :class="ns.e('list-item')"
          @click="handleClickSchedule(item)"
        >
          <div class="title flx-align-center">
            <span>{{ item.startTime }} - {{ item.endTime }}</span>
            <span class="sle flx-1">{{ item.title }}</span>
          </div>
          <div class="location sle">{{ item.location }}</div>
        </el-timeline-item>
      </el-timeline>

      <el-empty v-else description="暂无日程" :image-size="100" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
