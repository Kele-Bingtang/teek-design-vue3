<script setup lang="ts" name="QrCode">
import type { QrCodeEmits, QrCodeLogo, QrCodeProps } from "./types";
import type { QRCodeRenderersOptions } from "qrcode";
import { ref, computed, nextTick, watch, useTemplateRef } from "vue";
import { ElIcon } from "element-plus";
import { RefreshRight } from "@element-plus/icons-vue";
import QRCode from "qrcode";
import { isString } from "@/common/utils";
import { useNamespace } from "@/composables";

defineOptions({ name: "QrCode" });

const props = withDefaults(defineProps<QrCodeProps>(), {
  tag: "canvas",
  text: "",
  options: (): QRCodeRenderersOptions => ({}),
  width: 200,
  logo: "",
  disabled: false,
  disabledText: "",
});

const emits = defineEmits<QrCodeEmits>();

const ns = useNamespace("qrcode");

const { toCanvas, toDataURL } = QRCode;
const loading = ref(true);
const ImgInstance = useTemplateRef("ImgInstance");
const renderText = computed(() => String(props.text));
const wrapStyle = computed(() => {
  return {
    width: props.width + "px",
    height: props.width + "px",
  };
});

/**
 * 初始化二维码
 */
const initQrCode = async () => {
  await nextTick();
  const options = JSON.parse(JSON.stringify(props.options) || "{}");
  if (props.tag === "canvas") {
    // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
    options.errorCorrectionLevel = options.errorCorrectionLevel || getErrorCorrectionLevel(renderText.value);
    const _width: number = await getOriginWidth(renderText.value, options);
    options.scale = props.width === 0 ? undefined : (props.width / _width) * 4;
    const canvasRef: any = await toCanvas(ImgInstance.value, renderText.value, options);

    if (props.logo) {
      const url = (await createLogoCode(canvasRef)) as string;
      emits("done", url);
      loading.value = false;
    } else {
      emits("done", canvasRef.toDataURL());
      loading.value = false;
    }
  } else {
    const url = await toDataURL(renderText.value, {
      errorCorrectionLevel: "H",
      width: props.width,
      ...options,
    });

    (ImgInstance.value as any).src = url;
    emits("done", url as unknown as string);
    loading.value = false;
  }
};

watch(
  () => renderText.value,
  val => {
    val && initQrCode();
  },
  { deep: true, immediate: true }
);

/**
 * 创建 logo 二维码
 */
const createLogoCode = (canvasRef: HTMLCanvasElement) => {
  const canvasWidth = canvasRef.width;
  const logoOptions: QrCodeLogo = Object.assign(
    {
      logoSize: 0.15,
      bgColor: "#ffffff",
      borderSize: 0.05,
      crossOrigin: "anonymous",
      borderRadius: 8,
      logoRadius: 0,
    },
    isString(props.logo) ? {} : props.logo
  );

  const {
    logoSize = 0.15,
    bgColor = "#ffffff",
    borderSize = 0.05,
    crossOrigin = "anonymous",
    borderRadius = 8,
    logoRadius = 0,
  } = logoOptions;

  const logoSrc = isString(props.logo) ? props.logo : props.logo.src;
  const logoWidth = canvasWidth * logoSize;
  const logoXY = (canvasWidth * (1 - logoSize)) / 2;
  const logoBgWidth = canvasWidth * (logoSize + borderSize);
  const logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2;
  const ctx = canvasRef.getContext("2d");
  if (!ctx) return;

  // logo 底色
  canvasRoundRect(ctx)(logoBgXY, logoBgXY, logoBgWidth, logoBgWidth, borderRadius);
  ctx.fillStyle = bgColor;
  ctx.fill();

  // logo
  const image = new Image();
  if (crossOrigin || logoRadius) {
    image.setAttribute("crossOrigin", crossOrigin);
  }
  (image as any).src = logoSrc;

  /**
   * 使用 image 绘制可以避免某些跨域情况
   */
  const drawLogoWithImage = (image: HTMLImageElement) => {
    ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
  };

  /**
   * 使用canvas绘制以获得更多的功能
   */
  const drawLogoWithCanvas = (image: HTMLImageElement) => {
    const canvasImage = document.createElement("canvas");
    canvasImage.width = logoXY + logoWidth;
    canvasImage.height = logoXY + logoWidth;
    const imageCanvas = canvasImage.getContext("2d");

    if (!imageCanvas || !ctx) return;

    imageCanvas.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
    canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius);

    if (!ctx) return;

    const fillStyle = ctx.createPattern(canvasImage, "no-repeat");

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
  };

  /**
   * 将 logo绘制到 canvas上
   */
  return new Promise((resolve: any) => {
    image.onload = () => {
      logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image);
      resolve(canvasRef.toDataURL());
    };
  });
};

/**
 * 得到原QrCode的大小，以便缩放得到正确的QrCode大小
 */
const getOriginWidth = async (content: string, options: QRCodeRenderersOptions) => {
  const _canvas = document.createElement("canvas");
  await toCanvas(_canvas, content, options);
  return _canvas.width;
};

/**
 * 对于内容少的QrCode，增大容错率
 */
const getErrorCorrectionLevel = (content: string) => {
  if (content.length > 36) {
    return "M";
  } else if (content.length > 16) {
    return "Q";
  } else {
    return "H";
  }
};

/**
 * 用于绘制圆角
 */
const canvasRoundRect = (ctx: CanvasRenderingContext2D) => {
  return (x: number, y: number, w: number, h: number, r: number) => {
    const minSize = Math.min(w, h);
    if (r > minSize / 2) {
      r = minSize / 2;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
  };
};

/**
 * 点击二维码
 */
const clickCode = () => {
  emits("click");
};

/**
 * 禁用点击二维码
 */
const disabledClick = () => {
  emits("disabledClick");
};
</script>

<template>
  <div v-loading="loading" :class="ns.b()" :style="wrapStyle">
    <canvas v-if="props.tag === 'canvas'" ref="ImgInstance" @click="clickCode"></canvas>
    <img v-else ref="ImgInstance" @click="clickCode" />

    <div v-if="props.disabled" :class="ns.m('disabled')" @click="disabledClick">
      <div :class="ns.e('icon')" :color="ns.cssVarEl('color-primary')">
        <el-icon style="cursor: pointer" :size="30"><RefreshRight /></el-icon>
        <div>{{ props.disabledText }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
