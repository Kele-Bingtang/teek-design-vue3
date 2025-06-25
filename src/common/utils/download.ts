/*
	_blank：在新窗口中打开被链接文档（默认）
	_self：在相同的框架中打开被链接文档
	_parent：在父框架集中打开被链接文档
	_top：在整个窗口中打开被链接文档
	framename：在指定的框架中打开被链接文档
*/
export type Target = "_blank" | "_self" | "_parent" | "_top" | "framename";

/**
 * @description 下载在线图片
 * @param url 需要下载的 url
 * @param filename 文件名
 * @param mime 	类型（ 可选 ）
 * @param bom BlobPart（ 可选 ）
 */
export const downloadByOnlineUrl = (url: string, filename: string, mime?: string, bom?: BlobPart) => {
  urlToBase64(url).then(base64 => {
    downloadByBase64(base64, filename, mime, bom);
  });
};

/**
 * @description 基于 base64 下载图片
 * @param base64 base64 图片
 * @param filename 文件名
 * @param mime 	类型（ 可选 ）
 * @param bom BlobPart（ 可选 ）
 */
export const downloadByBase64 = (base64: string, filename: string, mime?: string, bom?: BlobPart) => {
  const data = base64ToBlob(base64);
  downloadByData(data, filename, mime, bom);
};

/**
 * @description 根据后台接口文件流下载
 * @param data 文件流
 * @param filename 文件名
 * @param mime 	类型（ 可选 ）
 * @param bom BlobPart（ 可选 ）
 */
export const downloadByData = (data: BlobPart, filename: string, mime?: string, bom?: BlobPart) => {
  const blobParts = bom && typeof bom < "u" ? [bom, data] : [data];
  const blob = new Blob(blobParts, { type: mime || "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const aElement = document.createElement("a");
  aElement.style.display = "none";
  aElement.href = url;
  aElement.setAttribute("download", filename);
  typeof aElement.download > "u" && aElement.setAttribute("target", "_blank");
  document.body.appendChild(aElement);
  aElement.click();
  document.body.removeChild(aElement);
  window.URL.revokeObjectURL(url);
};

/**
 * @description 根据文件地址下载文件
 * @param url 文件地址
 * @param filename 文件名
 * @param target 打开方式：_blank、_self、_parent、_top、framename
 */
export const downloadByUrl = (url: string, filename: string, target: Target = "_self") => {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf("safari") > -1;
  if (/(iP)/g.test(window.navigator.userAgent)) return console.error("Your browser does not support download!");
  if (isChrome || isSafari) {
    const aElement = document.createElement("a");
    if (
      (aElement.href === url && aElement.target === target && aElement.download === filename) ||
      url.substring(url.lastIndexOf("/") + 1, url.length)
    ) {
      aElement.click();
      aElement.remove();
    }
  }
  url.indexOf("?") === -1 && (url += "?download");
  openLink(url, target);
};

/**
 * 图片链接转 Base64
 * @param url 需要下载的 url
 * @param mime 	类型（ 可选 ）
 * @param encoderOptions 转 Base64 的图片质量，0 - 1，
 * @returns base64 格式
 */
function urlToBase64(url: string, mime?: string, encoderOptions = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement("canvas") as any;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "";
    image.onload = function () {
      if (!canvas || !context) return reject();
      canvas.height = image.height;
      canvas.width = image.width;
      context.drawImage(image, 0, 0);
      const p = canvas.toDataURL(mime || "image/png", encoderOptions);
      canvas = null;
      resolve(p);
    };
    image.src = url;
  });
}

/**
 * base64 图片转文件流
 * @param base64 图片 base64
 * @returns Blob 文件流
 */
function base64ToBlob(base64: string) {
  const n = base64.split(",");
  const match = n[0].match(/:(.*?);/);
  const type = match ? match[1] : "";
  const o = window.atob(n[1]);
  let length = o.length;
  const uint8Array = new Uint8Array(length);
  for (; length--; ) uint8Array[length] = o.charCodeAt(length);
  return new Blob([uint8Array], { type });
}

/**
 * 下载 url 文件
 * @param url 需要下载的 url
 * @param target 打开方式：_blank、_self、_parent、_top、framename
 */
const openLink = (url: string, target: Target = "_blank") => {
  const aElement = document.createElement("a");
  aElement.setAttribute("href", url);
  aElement.setAttribute("target", target);
  aElement.setAttribute("rel", "noreferrer noopener");
  aElement.setAttribute("id", "external");
  const external = document.getElementById("external");
  external && document.body.removeChild(external);
  document.body.appendChild(aElement);
  aElement.click();
  aElement.remove();
};
