import type { ScheduleData } from "../components/types";
import { dayjs } from "element-plus";

const scheduleTemplate: ScheduleData[] = [
  {
    id: "2",
    title: "日常例会-早会",
    startTime: "08:30",
    endTime: "09:00",
    location: "(Teek 大厦)6-B01中会议室",
  },
  {
    id: "1",
    title: "Teek团队产品运营会议",
    startTime: "10:00",
    endTime: "12:00",
    location: "(Teek 大厦)3-B05大会议室",
  },
  {
    id: "3",
    title: "【培训通知】项目风险管理培训",
    startTime: "14:00",
    endTime: "14:30",
    location: "(Teek 大厦)8-A09中会议室",
  },
  {
    id: "4",
    title: "Teek团队产品周例会",
    startTime: "15:00",
    endTime: "16:00",
    location: "(Teek 大厦)3-B05大会议室",
  },
  {
    id: "5",
    title: "需求评审会议",
    startTime: "16:20",
    endTime: "17:00",
    location: "(Teek 大厦)1-A01大会议室",
  },
  {
    id: "6",
    title: "前端代码Review会议",
    startTime: "17:30",
    endTime: "18:00",
    location: "(Teek 大厦)2-A01小会议室",
  },
];

export const scheduleData = {
  // 当前日期
  [dayjs().format("YYYY-MM-DD")]: scheduleTemplate,
  // 前一天
  [dayjs().subtract(1, "day").format("YYYY-MM-DD")]: scheduleTemplate,
  // 后一天
  [dayjs().add(1, "day").format("YYYY-MM-DD")]: scheduleTemplate,
  // 前一周
  [dayjs().subtract(1, "week").format("YYYY-MM-DD")]: scheduleTemplate,
  // 后一周
  [dayjs().add(1, "week").format("YYYY-MM-DD")]: scheduleTemplate,
};
