import { ref } from "vue";
import { createImageViewer } from "@/components";

export const useImage = () => {
  // 预览图片的 src 数组
  const imgPreview = ref<string[]>([]);
  // 当前预览的图片 src
  const currentImg = ref("");

  const previewImg = ref(null);

  // 监听富文本的点击事件
  const handleRichClick = (e: any, richText: string) => {
    if (e.target.tagName === "INPUT") return;
    e.preventDefault();
    // 图片预览
    if (e.target.tagName === "IMG") {
      imgPreview.value = getImgSrc(richText);
      currentImg.value = e.target.src;
      createImageViewer({ urlList: imgPreview.value, initialIndex: imgPreview.value.indexOf(currentImg.value) });
    }
    // 附件下载
    if (["SPAN", "A"].includes(e.target.tagName)) {
      const arr = getFileSrc(richText);
      const obj = arr.find((item: any) => item.fileName === e.target.innerText);
      if (obj) {
        // 下载附件
        // downloadFile();
      }
    }
  };

  /** * 提取富文本中的所有图片 */
  const getImgSrc = (richText: string) => {
    const imgList: string[] = [];
    richText.replace(/< img [^>]*src=['"]([^'"]+)[^>]*>/g, (match: string, capture: string) => {
      // 处理 & 转义成 &amp; 问题
      if (capture.includes("&amp;")) {
        capture = capture.replace("&amp;", "&");
      }
      imgList.push(capture);
      return "";
    });
    return imgList;
  };

  /** * 提取富文本中的所有附件 */
  const getFileSrc = (richText: string) => {
    const fileList: string[] = [];
    const fileNameList: string[] = [];

    richText.replace(/<a [^>]*href=['"]([^'"]+)[^>]*>/g, (match: string, capture: string) => {
      // 处理 & 转义成 &amp; 问题
      if (capture.includes("&amp;")) {
        capture = capture.replace("&amp;", "&");
      }
      fileList.push(capture);
      return "";
    });

    richText.replace(/<a [^>]*download=['"]([^'"]+)[^>]*>/g, (match: string, capture: string) => {
      // 处理 & 转义成 &amp; 问题
      if (capture.includes("&amp;")) {
        capture = capture.replace("&amp;", "&");
      }
      fileNameList.push(capture);
      return "";
    });
    return fileList.map((item: any, index: number) => {
      return { fileUrl: item, fileName: fileNameList[index] };
    });
  };

  /** * 删除字符串的图片标签 */
  const removeImg = (richText: string) => {
    return richText.replace(/<img.*?>/g, "");
  };

  return { previewImg, imgPreview, currentImg, handleRichClick, getImgSrc, removeImg };
};
