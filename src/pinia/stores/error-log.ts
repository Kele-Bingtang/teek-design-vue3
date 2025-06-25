import { ref } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./core/user";

export interface ErrorLog {
  error: unknown; // 错误对象
  vm?: ComponentPublicInstance | null; // 发生错误的 Vue 实例
  info: string; // Vue 组件的错误信息
  url: string; // 发生错误的 URL
  hasRead: boolean; // 错误日志是否已读
  time?: number; // 发生错误的时间
  userId?: string; // 用户 ID
  username?: string; // 用户名
  accessToken?: string; // 用户 token
  roles?: string[]; // 用户的角色
}

export const useErrorLogStore = defineStore("errorLogStore", () => {
  const errorLogs = ref<ErrorLog[]>([]);

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

  const deleteOneErrorLog = (errorLog: ErrorLog) => {
    for (const [i, e] of errorLogs.value.entries()) {
      if (e.time === errorLog.time) {
        errorLogs.value.splice(i, 1);
        break;
      }
    }
  };

  const clearErrorLog = () => {
    errorLogs.value.splice(0);
  };

  const setHasReadErrorLogsStatus = (status: boolean) => {
    errorLogs.value = errorLogs.value.map(errorLog => {
      errorLog.hasRead = status;
      return errorLog;
    });
  };
  return {
    errorLogs,
    addErrorLog,
    deleteOneErrorLog,
    clearErrorLog,
    setHasReadErrorLogsStatus,
  };
});
