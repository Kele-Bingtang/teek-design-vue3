/**
 * 上传文件到本地浏览器
 */
export function uploadLocal(file: File): Promise<{ blobInfo: { id: string; file: File; base64: string }; file: File }> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function () {
      const id = "id" + new Date().getTime(); // 本地图片的文件名
      const base64 = (reader as any).result.split(",")[1];
      const blobInfo = { id, file, base64 };
      resolve({ blobInfo, file });
    };
    reader.readAsDataURL(file);
  });
}
