/**
 * 进度回调使用示例
 *
 * 本示例展示了如何使用 onUploadProgress 和 onDownloadProgress 回调函数
 * 来监控文件上传和下载的进度
 */

import { createRequest } from "@/common/http";
import type { AxiosProgressEvent } from "axios";

// 创建一个示例请求实例
const exampleRequest = createRequest();

/**
 * 上传文件并监控进度
 * @param file 要上传的文件
 */
export async function uploadFileWithProgress(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const result = await exampleRequest.post("/upload", formData, {
      contentType: "multipart",
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`上传进度: ${progress}%`);

          // 可以更新 UI 进度条
          // updateUploadProgressBar(progress);
        }
      },
    });

    console.log("文件上传成功:", result);
  } catch (error) {
    console.error("文件上传失败:", error);
  }
}

/**
 * 下载文件并监控进度
 * @param url 下载地址
 * @param filename 保存的文件名
 */
export async function downloadFileWithProgress(url: string, filename: string): Promise<void> {
  try {
    const blob = await exampleRequest.get(url, undefined, {
      responseType: "blob",
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`下载进度: ${progress}%`);

          // 可以更新 UI 进度条
          // updateDownloadProgressBar(progress);
        }
      },
    });

    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(new Blob([blob as BlobPart]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    console.log("文件下载成功");
  } catch (error) {
    console.error("文件下载失败:", error);
  }
}

// 使用示例:
//
// 假设你有一个文件输入元素
// const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//
// fileInput.addEventListener('change', (event) => {
//   const file = (event.target as HTMLInputElement).files?.[0];
//   if (file) {
//     uploadFileWithProgress(file);
//   }
// });
//
// 或者下载文件
// downloadFileWithProgress('/api/download/document.pdf', 'document.pdf');
