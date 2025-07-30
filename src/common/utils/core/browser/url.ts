/**
 * 获取 URL ? 后面的参数
 */
export function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * 新窗口打开URL。
 *
 * @param url - 需要打开的网址。
 * @param options - 打开窗口的选项。
 */
export function openWindow(
  url: string,
  options: {
    noopener?: boolean;
    noreferrer?: boolean;
    target?: "_blank" | "_parent" | "_self" | "_top" | string;
  } = {}
): void {
  // 解构并设置默认值
  const { noopener = true, noreferrer = true, target = "_blank" } = options;

  // 基于选项创建特性字符串
  const features = [noopener && "noopener=yes", noreferrer && "noreferrer=yes"].filter(Boolean).join(",");

  // 打开窗口
  window.open(url, target, features);
}

/**
 * 在新窗口中打开路由
 */
export function openRouteInNewWindow(path: string) {
  const { hash, origin } = location;
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${origin}${hash ? "/#" : ""}${fullPath}`;
  openWindow(url, { target: "_blank" });
}
