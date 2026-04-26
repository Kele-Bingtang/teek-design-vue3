<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useNamespace, useTheme } from "@/composables";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { GlobalThemeEnum } from "@/common/enums";
import lightTheme from "@/common/assets/images/system-theme/light.png";
import darkTheme from "@/common/assets/images/system-theme/dark.png";
import systemTheme from "@/common/assets/images/system-theme/system.png";

defineOptions({ name: "GlobalTheme" });

const ns = useNamespace("global-theme");

const { changeGlobalTheme, changeThemeSurface, changeFunctionalColor, changeGreyOrWeak } = useTheme();
const settingStore = useSettingStore();
const { t } = useI18n();

const { theme } = storeToRefs(settingStore);

const globalThemeModeList = [
  { name: computed(() => t("_setting.theme.modeSelect.light")), theme: GlobalThemeEnum.Light, img: lightTheme },
  {
    name: computed(() => t("_setting.theme.modeSelect.dark")),
    theme: GlobalThemeEnum.Dark,
    img: darkTheme,
  },
  { name: computed(() => t("_setting.theme.modeSelect.system")), theme: GlobalThemeEnum.System, img: systemTheme },
];

/**
 * 主题外观选项
 */
const surfaceOptions = [
  { value: "teek-brand", label: "Teek Brand", labelZh: "Teek 品牌" }, // 默认品牌主题
  { value: "cloud-white", label: "Cloud White", labelZh: "云端洁白" }, // 纯净、普适
  { value: "mono-minimal", label: "Mono Minimal", labelZh: "极简单色" }, // 经典黑白灰
  { value: "slate-pro", label: "Slate Pro", labelZh: "石板专业" }, // 专业、中性
  { value: "steel-cool", label: "Steel Cool", labelZh: "冷钢工业" }, // 现代、工业
  { value: "ocean-breeze", label: "Ocean Breeze", labelZh: "海洋微风" }, // 清新、自然
  { value: "forest-moss", label: "Forest Moss", labelZh: "森林苔藓" }, // 护眼、自然
  { value: "sunset-dune", label: "Sunset Dune", labelZh: "日落沙丘" }, // 温暖、舒适
  { value: "warm-paper", label: "Warm Paper", labelZh: "暖色纸张" }, // 复古、舒适
  { value: "lilac-mist", label: "Lilac Mist", labelZh: "丁香薄雾" }, // 柔和、淡雅
  { value: "velvet-rose", label: "Velvet Rose", labelZh: "丝绒玫瑰" }, // 深沉、优雅
  { value: "berry-sweet", label: "Berry Sweet", labelZh: "浆果甜美" }, // 友好、女性
  { value: "nord-aurora", label: "Nord Aurora", labelZh: "北极光" }, // 冷静、专注
  { value: "deep-space", label: "Deep Space", labelZh: "深空" }, // 沉浸、夜间
  { value: "vintage-tech", label: "Vintage Tech", labelZh: "复古科技" }, // 怀旧、独特
  { value: "deep-wood", label: "Deep Wood", labelZh: "深邃木纹" }, // 沉稳、自然
  { value: "midnight-lavender", label: "Midnight Lavender", labelZh: "午夜薰衣草" }, // 神秘、优雅
  { value: "jade-luxe", label: "Jade Luxe", labelZh: "翡翠奢华" }, // 高级、东方
  { value: "desert-sand", label: "Desert Sand", labelZh: "荒漠流沙" }, // 极简、中性
  { value: "dusk-horizon", label: "Dusk Horizon", labelZh: "黄昏地平" }, // 浪漫、艺术
  { value: "obsidian-glass", label: "Obsidian Glass", labelZh: "黑曜石玻" }, // 现代、科技
  { value: "candy-floss", label: "Candy Floss", labelZh: "糖果棉花糖" }, // 活泼、童趣
  { value: "pop-art", label: "Pop Art", labelZh: "波普艺术" }, // 鲜艳、艺术
  { value: "cyberpunk-electric", label: "Cyberpunk Electric", labelZh: "赛博霓红" }, // 高饱和、未来
  { value: "hacker-terminal", label: "Hacker Terminal", labelZh: "黑客终端" }, // 极客、技术
];

/**
 * 颜色配置项列表
 */
const functionalColorOptions: { type: any; labelKey: string; storeKey: string }[] = [
  { type: "primary", labelKey: "_setting.theme.primaryColor", storeKey: "primaryColor" },
  { type: "success", labelKey: "_setting.theme.successColor", storeKey: "successColor" },
  { type: "warning", labelKey: "_setting.theme.warningColor", storeKey: "warningColor" },
  { type: "danger", labelKey: "_setting.theme.dangerColor", storeKey: "dangerColor" },
  { type: "error", labelKey: "_setting.theme.errorColor", storeKey: "errorColor" },
  { type: "info", labelKey: "_setting.theme.infoColor", storeKey: "infoColor" },
  // 如果还有 secondary，也可以加在这里
  // { type: "secondary", labelKey: "_setting.theme.secondaryColor", storeKey: "secondaryColor" },
];

// 预定义主题颜色
const colorList = computed(() => [theme.value.primaryColor, ...(serviceConfig.theme.presetsColor ?? [])]);

/**
 * 圆角选项
 */
const radiusOptions = [
  { value: "0", label: "0" },
  { value: "0.25", label: "0.25" },
  { value: "0.5", label: "0.5" },
  { value: "0.75", label: "0.75" },
  { value: "1", label: "1" },
  { value: "1.25", label: "1.25" },
  { value: "1.5", label: "1.5" },
  { value: "1.75", label: "1.75" },
  { value: "2", label: "2" },
];
</script>

<template>
  <div :class="ns.b()">
    <div class="flx-wrap gap-15">
      <div
        v-for="item in globalThemeModeList"
        :key="item.theme"
        :class="ns.e('theme-item')"
        @click="changeGlobalTheme(item.theme)"
      >
        <div :class="[ns.e('box'), ns.is('active', item.theme === theme.globalThemeMode)]">
          <img :src="item.img" />
        </div>
        <Icon :class="ns.m('icon')" v-show="item.theme === theme.globalThemeMode"><CircleCheckFilled /></Icon>
        <p :class="ns.m('name')">{{ item.name }}</p>
      </div>
    </div>

    <div :class="ns.e('item')">
      <span>主题外观</span>
      <el-select v-model="theme.surface" placeholder="Select" @change="changeThemeSurface">
        <el-option v-for="item in surfaceOptions" :key="item.value" :label="item.labelZh" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item-two')">
      <template v-for="item in functionalColorOptions" :key="item.type">
        <div>
          <span>{{ $t(item.labelKey) }}</span>
          <el-color-picker
            v-model="(theme as any)[item.storeKey]"
            :predefine="colorList"
            @change="val => val && changeFunctionalColor(val, item.type)"
          />
        </div>
      </template>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.functionalColorStrictly") }}</span>
      <el-switch v-model="theme.functionalColorStrictly" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.greyMode") }}</span>
      <el-switch v-model="theme.greyMode" @change="changeGreyOrWeak($event as boolean, 'greyMode')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.weakMode") }}</span>
      <el-switch v-model="theme.weakMode" @change="changeGreyOrWeak($event as boolean, 'weakMode')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.radius") }}</span>
      <el-select v-model="theme.radius" placeholder="Select">
        <el-option v-for="item in radiusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
