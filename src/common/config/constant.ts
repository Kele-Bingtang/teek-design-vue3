export const HOME_URL = "/home";
export const HOME_NAME = "Home";
export const LOGIN_URL = "/login";
export const LOGIN_NAME = "Login";
export const LAYOUT_NAME = "Layout";
export const REDIRECT_NAME = "Redirect";
export const NOT_FOUND = "NotFound";

// 移动端最大宽度
export const mobileMaxWidthMedia = "(max-width: 960px)";

/**
 * 表格状态过滤器
 *
 * @param status 状态
 */
export const tableStatusFilter = (status: string): "success" | "info" | "danger" => {
  const statusMap: Record<string, "success" | "info" | "danger"> = {
    Enable: "success",
    Disable: "info",
    Deleted: "danger",
  };

  return statusMap[status];
};
