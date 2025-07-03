/**
 * 上传文件到本地浏览器
 */
export function uploadLocal(file: File): Promise<{ blobInfo: { id: string; file: File; base64: string }; file: File }> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function () {
      // 使用时间戳作为本地图片的文件名
      const id = "id" + new Date().getTime();
      const base64 = (reader as any).result.split(",")[1];
      const blobInfo = { id, file, base64 };
      resolve({ blobInfo, file });
    };
    reader.readAsDataURL(file);
  });
}
