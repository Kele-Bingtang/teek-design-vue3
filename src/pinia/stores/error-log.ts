import type { ComponentPublicInstance } from "vue";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./core/user";

export interface ErrorLog {
  /** 错误日志 ID */
  id: string;
  /** 错误对象 */
  error: unknown;
  /** 发生错误的 Vue 实例 */
  vm?: ComponentPublicInstance | null;
  /** Vue 组件的错误信息 */
  info: string;
  /** 发生错误的 URL */
  url: string;
  /** 错误日志是否已读 */
  hasRead: boolean;
  /** 发生错误的时间 */
  time?: number;
  /** 用户 ID */
  userId?: string;
  /** 用户名 */
  username?: string;
  /** 用户 token */
  accessToken?: string;
  /** 用户的角色 */
  roles?: string[];
}

export const useErrorLogStore = defineStore("errorLogStore", () => {
  const errorLogs = ref<ErrorLog[]>([]);

  /**
   * 添加错误日志
   *
   * @param errorLog 错误日志
   */
  const addErrorLog = (errorLog: ErrorLog) => {
    const userStore = useUserStore();
    const { userInfo, accessToken, roles } = userStore;
    const log: ErrorLog = {
      ...errorLog,
      userId: userInfo.userId,
      username: userInfo.username,
      accessToken,
      roles,
      time: new Date().getTime(),
    };
    errorLogs.value.push(log);
  };

  /**
   * 删除一条错误日志
   *
   * @param errorLog 错误日志
   */
  const deleteOneErrorLog = (errorLog: ErrorLog) => {
    const index = errorLogs.value.findIndex(e => e.time === errorLog.time);
    index !== -1 && errorLogs.value.splice(index, 1);
  };

  /**
   * 清空错误日志
   *
   * @param errorLog 错误日志
   */
  const clearErrorLog = () => {
    errorLogs.value.splice(0);
  };

  /**
   * 设置错误日志的已读状态
   *
   * @param status 是否已读
   */
  const readAllErrorLogs = (status: boolean) => {
    errorLogs.value = errorLogs.value.map(errorLog => {
      errorLog.hasRead = status;
      return errorLog;
    });
  };

  /**
   * 设置指定错误日志的已读状态
   *
   * @param errorLog 错误日志
   */
  const readOneErrorLog = (id: string) => {
    const index = errorLogs.value.findIndex(e => e.id === id);
    index !== -1 && (errorLogs.value[index].hasRead = true);
  };

  return {
    errorLogs,
    addErrorLog,
    deleteOneErrorLog,
    clearErrorLog,
    readAllErrorLogs,
    readOneErrorLog,
  };
});
