/*
  需求：给整个页面或组件添加背景水印。

  思路：
    1、使用 canvas 生成 base64 图片，设置字体、颜色等。
    2、插入绝对定位 overlay 层，作为水印层，内容不会覆盖水印。
  使用：
    <div v-waterMarker="{text:'版权所有', fontSize:'32px', textColor:'rgba(180,180,180,0.4)'}"></div>
*/
import type { Directive, DirectiveBinding } from "vue";

interface WaterMarkerOptions {
  text?: string;
  fontSize?: string;
  textColor?: string;
  width?: number;
  height?: number;
  fontFamily?: string;
}

/**
 * 生成水印 base64 图片
 */
function createWatermarkBase64({
  text = "水印",
  fontSize = "16px",
  textColor = "rgba(180,180,180,0.3)",
  width = 205,
  height = 140,
  fontFamily = "Microsoft YaHei",
}: WaterMarkerOptions) {
  const can = document.createElement("canvas");
  can.width = width;
  can.height = height;
  const ctx = can.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, width, height);
  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = `${fontSize} ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 10, height / 2);
  return can.toDataURL("image/png");
}

const WATER_MARKER_CLASS = "water-marker-bg";

const waterMarker: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options: WaterMarkerOptions = binding.value || {};
    const base64 = createWatermarkBase64(options);

    // 设置父元素 position: relative，防止 overlay 层脱离
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.position === "static" || !computedStyle.position) {
      el.style.position = "relative";
    }

    // 创建 overlay 层
    const markDiv = document.createElement("div");
    markDiv.className = WATER_MARKER_CLASS;
    markDiv.style.position = "absolute";
    markDiv.style.left = "0";
    markDiv.style.top = "0";
    markDiv.style.width = "100%";
    markDiv.style.height = "100%";
    markDiv.style.pointerEvents = "none";
    markDiv.style.zIndex = "1";
    markDiv.style.backgroundImage = `url(${base64})`;
    markDiv.style.backgroundRepeat = "repeat";
    markDiv.style.backgroundPosition = "0 0";
    markDiv.style.backgroundSize = "auto";
    markDiv.setAttribute("data-water-marker", "true");

    el.appendChild(markDiv);
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 支持动态更新水印内容
    const markDiv = el.querySelector(`.${WATER_MARKER_CLASS}`) as HTMLElement;
    if (markDiv) {
      const options: WaterMarkerOptions = binding.value || {};
      const base64 = createWatermarkBase64(options);
      markDiv.style.backgroundImage = `url(${base64})`;
    }
  },

  unmounted(el: HTMLElement) {
    // 移除 overlay 层
    const markDiv = el.querySelector(`.${WATER_MARKER_CLASS}`);
    if (markDiv) el.removeChild(markDiv);
  },
};

export default waterMarker;
