import { ElMessageBox, ElMessage } from "element-plus";

/**
 * 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 *
 * @param fallback 操作数据接口的api方法 (必传)
 * @param message 提示信息 (必传)
 * @param confirmType icon类型 (不必传,默认为 warning)
 */
export const useConfirm = (
  fallback: () => void,
  message: string,
  confirmType: "" | "success" | "warning" | "info" | "error" = "warning"
) => {
  return new Promise(resolve => {
    ElMessageBox.confirm(`${message}?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true,
    }).then(async () => {
      fallback();
      ElMessage({
        type: "success",
        message: `${message}成功!`,
      });
      resolve(true);
    });
  });
};
