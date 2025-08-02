/**
 * 日程表单模型
 */
export interface ScheduleFormModel extends Pick<ScheduleData, "title" | "location" | "appointed" | "createUser"> {
  date: string;
  time: string[];
}

/**
 * 日程数据
 */
export interface ScheduleData {
  /** 日程 id */
  id: number | string;
  /** 日程标题 */
  title: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 地点 */
  location: string;
  /** 预约人 */
  appointed: string;
  /** 创建人 */
  createUser: string;
  /** 创建时间 */
  createTime: string;
  /** 参会人 */
  attendee: string[];
  /** 会议号 */
  number?: string;
  /** 入会密码 */
  password?: string;
  /** 入会电话1 */
  phone1?: string;
  /** 入会电话2 */
  phone2?: string;
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
