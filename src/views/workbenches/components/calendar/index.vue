<script setup lang="tsx">
import type { ScheduleData, ScheduleFormModel } from "./components/types";
import { ref, watch, onMounted } from "vue";
import { dayjs, ElMessage } from "element-plus";
import CalendarSchedule from "./components/calendar-schedule.vue";
import { scheduleData } from "./data";

const currentTime = ref(new Date());
const scheduleMeeting = ref<{ [key: string]: ScheduleData[] }>({});

const scheduleModel = ref<ScheduleFormModel>({
  title: "",
  date: "",
  time: [],
  location: "",
  appointed: "",
  createUser: "",
});

watch(currentTime, (newVal, oldVal) => {
  // 判断是否为同一个月
  const isSameMonth = newVal?.getFullYear() === oldVal?.getFullYear() && newVal?.getMonth() === oldVal?.getMonth();

  if (!isSameMonth) {
    const [firstDate, lastDate] = getFirstDayAndLast(newVal);
    requestData(firstDate, lastDate);
  }
});

/**
 * 获取指定日期所在月份的第一天和最后一天（格式：yyyy-MM-dd）
 */
const getFirstDayAndLast = (d: Date): [string, string] => {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const monthStr = pad(month);
  const lastDay = new Date(year, month, 0).getDate();
  const firstDate = `${year}-${monthStr}-01`;
  const lastDate = `${year}-${monthStr}-${pad(lastDay)}`;

  return [firstDate, lastDate];
};

/**
 * 请求数据
 *
 * @param first - 开始日期，格式 YYYY-MM-DD
 * @param last - 结束日期，格式 YYYY-MM-DD
 */
const requestData = async (first: string, last: string) => {
  scheduleMeeting.value = {};

  // 模拟请求数据，查询指定 first 到 last 范围内的日程数据
  Object.keys(scheduleData).forEach(date => {
    if (
      (dayjs(date).isSame(dayjs(first), "day") || dayjs(date).isAfter(dayjs(first), "day")) &&
      (dayjs(date).isSame(dayjs(last), "day") || dayjs(date).isBefore(dayjs(last), "day"))
    ) {
      scheduleMeeting.value[date] = scheduleData[date];
    }
  });
};

const handleConfirm = (data: ScheduleData) => {
  scheduleMeeting.value[scheduleModel.value.date] = [...(scheduleMeeting.value[scheduleModel.value.date] || []), data];
  ElMessage.success("新增日程成功！");
};

const handleValidate = (result: boolean, data?: ScheduleData) => {
  if (!result) ElMessage.error(`与「${data?.title}」会议时间冲突！`);
};

onMounted(() => {
  const [firstDate, lastDate] = getFirstDayAndLast(new Date());

  requestData(firstDate, lastDate);
});
</script>

<template>
  <CalendarSchedule
    :data="scheduleMeeting"
    v-model="currentTime"
    v-model:form="scheduleModel"
    @confirm="handleConfirm"
    @validate="handleValidate"
  />
</template>
