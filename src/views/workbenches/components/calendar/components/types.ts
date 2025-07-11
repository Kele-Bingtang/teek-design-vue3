/**
 * 日程表单模型
 */
export interface ScheduleFormModel {
  title: string;
  date: string;
  time: string[];
  location: string;
}

/**
 * 日程数据
 */
export interface ScheduleData {
  /** 日程id */
  id: number | string;
  /** 日程标题 */
  title: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 地点 */
  location: string;
}

/**
 * 日历日程组件属性
 */
export interface CalendarScheduleProps {
  data?: { [key: string]: ScheduleData[] };
}

/**
 * 日历日程组件事件
 */
export interface CalendarScheduleEmits {
  confirm: [data: ScheduleData];
  cancel: [];
  open: [data?: ScheduleData, status?: "add" | "edit"];
  validate: [result: boolean, data?: ScheduleData];
}
