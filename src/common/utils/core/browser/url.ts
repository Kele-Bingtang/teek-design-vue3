/**
 * 获取 URL ? 后面的参数
 */
export function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}
