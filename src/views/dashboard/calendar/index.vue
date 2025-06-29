<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElPagination } from "element-plus";
import { useUserStore } from "@/pinia";
// import { usePagination } from "@/hooks";
import { useDialog } from "@/components";
import Add from "./add.vue";

const userStore = useUserStore();
const currentTime = ref<Date>(new Date());
const scheduleMeeting = ref<{ [key: string]: Recordable[] }>({});
const calendarDom = ref<any>(null);

const pagination = ref({
  currentPage: 1,
  pageSize: 4,
  total: 0,
});

const requestData = async (first: string, last: string) => {
  scheduleMeeting.value = {};
  // const res: Recordable[] = await getMeetingList(
  //   `${first} 00:00:00`,
  //   `${last} 23:59:59`,
  //   userStore.iWorkUserInfo.employeeNo,
  //   userStore.token
  // );

  const res: Recordable[] = [];

  res.forEach(e => {
    const startDate = e.StartTime?.substring(0, 10);
    if (scheduleMeeting.value[startDate]) {
      scheduleMeeting.value[startDate].push(e);
    } else {
      scheduleMeeting.value[startDate] = [];
      scheduleMeeting.value[startDate].push(e);
    }
  });
};

watch(currentTime, (newVal, oldVal) => {
  if (!(newVal?.getFullYear() === oldVal?.getFullYear() && newVal!.getMonth() + 1 === oldVal!.getMonth() + 1)) {
    const [firstDate, lastDate] = getFirstDayAndLast(newVal as Date);
    requestData(firstDate, lastDate);
  }
});

// Date类型转 "2023-01-01"
const dateToString = (d: Date) => {
  let mon, day;
  if (d.getMonth() + 1 < 10) {
    mon = "0" + String(d.getMonth() + 1);
  } else {
    mon = String(d.getMonth() + 1);
  }
  if (d.getDate() < 10) {
    day = "0" + String(d.getDate());
  } else {
    day = String(d.getDate());
  }
  const dateStr = `${d.getFullYear()}-${mon}-${day}`;
  return dateStr;
};

const selectDate = (val: string) => {
  calendarDom.value.selectDate(val);
};

const schedules = computed(() => {
  const res = scheduleMeeting.value[dateToString(currentTime.value)] || [];
  return res.sort((a, b) => {
    return a.StartTime < b.StartTime ? -1 : 1;
  });
});

const curScheduleList = computed(() => {
  return schedules.value.slice(
    pagination.value.currentPage * pagination.value.pageSize,
    (pagination.value.currentPage + 1) * pagination.value.pageSize
  );
});

const changePageIndex = (type: "prev" | "next") => {
  if (type === "prev") pagination.value.currentPage--;
  else pagination.value.currentPage++;
};

onMounted(async () => {
  const [firstDate, lastDate] = getFirstDayAndLast(new Date());
  await requestData(firstDate, lastDate);
});

const isToday = (d: string) => {
  const [year, mon, day] = d.split("-");
  const today = new Date();
  if (today.getDate() === Number(day) && today.getFullYear() === Number(year) && today.getMonth() + 1 === Number(mon)) {
    return true;
  }
  return false;
};

// 获取月份第一天和最后一天
const getFirstDayAndLast = (d: Date) => {
  let year = d!.getFullYear();
  let month: string | number = d!.getMonth() + 1;
  if (month > 12) {
    month = 1;
    year++;
  }
  if (month < 10) {
    month = "0" + month;
  }
  const monthLastDay = new Date(year, Number(month), 0).getDate();
  const firstDate = year + "-" + month + "-" + "01";
  const lastDate = year + "-" + month + "-" + monthLastDay;
  return [firstDate, lastDate];
};

const handleAddSchedule = () => {
  useDialog().open(
    {
      title: "新增日程",
      width: "500px",
      // beforeResolve: async (data: Recordable[]) => {
      //   const res = await addShedules(data, userStore.token);
      //   if (res.success && res.success > 0) {
      //     ElMessage.success("保存成功");
      //     const [firstDate, lastDate] = getFirstDayAndLast(new Date());
      //     await requestData(firstDate, lastDate);
      //   }
      // },
    },
    Add
  );
};
</script>

<template>
  <div class="calendar__container">
    <div class="title">日程</div>
    <el-calendar ref="calendarDom" v-model="currentTime">
      <template #header="{ date }">
        <el-icon class="calendar__top-icon" @click="selectDate('prev-month')"><ArrowLeft /></el-icon>
        <span class="calendar__top-date">{{ date }}</span>
        <el-icon class="calendar__top-icon" @click="selectDate('next-month')"><ArrowRight /></el-icon>
      </template>
      <template #date-cell="{ data }">
        <div class="calendar__cell">
          <div
            :class="[
              isToday(data.day) ? 'calendar__cell-today' : '',
              scheduleMeeting[data.day] && 'calendar__cell-dot',
              'calendar__cell-picked',
              'calendar__cell-num',
            ]"
          >
            {{ data.day.split("-").slice(2).join() }}
          </div>
        </div>
      </template>
    </el-calendar>
    <div class="mySchedule">
      <div class="myScheduleTitle">
        <div class="text">
          我的日程
          <code>{{ schedules.length }}</code>
        </div>
        <div class="pager">
          <el-button
            @click="changePageIndex('prev')"
            icon="ArrowLeft"
            circle
            :disabled="ElPagination.disablePrevArrow"
          />
          <el-button
            @click="changePageIndex('next')"
            icon="ArrowRight"
            circle
            :disabled="ElPagination.disableNextArrow"
          />
        </div>
      </div>
      <ul class="scheduleList">
        <transaction name="scheduleList">
          <li v-for="item in curScheduleList" :key="item.Id" class="listTimeLine">
            <div class="timelineTitle">{{ item.Title }}</div>
            <div class="timelineContent">
              {{ `${item.Location} ${item.StartTime}` }}
              <div class="timelineTail"></div>
            </div>
          </li>
        </transaction>
      </ul>
      <div class="newShedule" @click="handleAddSchedule">+&nbsp;新增日程</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mySchedule {
  padding: 0 20px;

  .myScheduleTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;

    .text {
      font-size: 16px;
      color: #20222b;
    }
  }

  .newShedule {
    padding: 8px 0;
    font-size: 14px;
    color: #666666;
    text-align: center;
    border: 1px solid rgb(153 153 153);
    border-radius: 5px;

    &:hover {
      color: #ffffff;
      cursor: pointer;
      background-color: #3763f3;
      border: 1px solid #3763f3;
      transition: all 0.2s;
    }
  }

  // .empty {
  //   min-height: 202px; margin: 8px 0;
  // }

  .scheduleList {
    // min-height: 202px; padding-left: 0;
    .listTimeLine {
      list-style: none;

      .timelineTitle {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #20222b;

        &::before {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 20px;
          content: "";
          background: #b7b9c4;
          border-radius: 50%;
        }
      }

      .timelineContent {
        position: relative;
        padding-left: 26px;
        margin-bottom: 6px;
        font-size: 14px;
        line-height: 30px;
        color: #848691;

        .timelineTail {
          position: absolute;
          top: 0;
          left: 2px;
          height: 30px;
          border-left: 2px solid #b7b9c4;
        }
      }
    }
  }
}

:deep(.#{$el-namespace}-calendar) {
  --#{$el-namespace}-calendar-border: none;

  margin: 15px 0;
  border: 1px solid #eeeeee;
  border-radius: 10px;

  .#{$el-namespace}-calendar__body {
    padding: 0;
    border-top: 1px solid #eeeeee;
  }
}

:deep(.#{$el-namespace}-calendar-table) {
  td {
    border-right: none;
    border-bottom: none;
  }

  td.is-selected {
    background-color: #ffffff;

    .calendar__cell-picked {
      color: #ffffff;
      outline-offset: 0 !important;
      background-color: #3763f3;
      border: 8px solid #3763f3;
    }
  }

  td.is-today {
    color: currentcolor;
  }
}

:deep(.#{$el-namespace}-calendar__header) {
  display: flex;
  align-items: center;
  justify-content: center;

  .calendar__top-date {
    margin: 0 10px;
    font-size: 16px;
  }

  .calendar__top-icon:hover {
    cursor: pointer;
    transform: scale(1.4);
    transition: 0.2s ease-in-out;
  }
}

:deep(.#{$el-namespace}-calendar-day) {
  height: 40px;
  min-height: 40px;
}

:deep(.#{$el-namespace}-calendar-day:hover) {
  background-color: #ffffff;
}

.calendar__container {
  width: 100%;
  padding: 0 15px 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 4px rgb(0 0 0 / 10%);

  .title {
    padding-top: 20px;
    font-size: 18px;
    font-weight: bold;
  }
}

.calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;

  .calendar__cell-dot {
    color: #3763f3;
    background-color: #e8f1ff;
    border: 8px solid #e8f1ff;
  }

  .calendar__cell-today {
    outline: 1px solid #a5c7ff;
    outline-offset: 6px;
  }

  .calendar__cell-num {
    padding: 1px 1.5px;
    border-radius: 50%;
  }

  &:hover {
    .calendar__cell-num {
      color: #3763f3;
      outline: none;
      background-color: #e8f1ff;
      border: 8px solid #e8f1ff;
    }
  }
}
</style>
